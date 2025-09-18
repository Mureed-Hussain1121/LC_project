import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scraper } from "./services/scraper";
import { leetcodeAPI } from "./services/leetcode";
import { insertStudentSchema, insertLeetcodeStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all students with their LeetCode stats
  app.get("/api/students", async (req, res) => {
    try {
      const studentsWithStats = await storage.getStudentsWithStats();
      res.json(studentsWithStats);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ 
        message: "Failed to fetch students",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get aggregated statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const studentsWithStats = await storage.getStudentsWithStats();
      
      const totalStudents = studentsWithStats.length;
      const activeThisWeek = studentsWithStats.filter(s => 
        s.stats && s.stats.lastUpdated && 
        new Date(s.stats.lastUpdated).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;
      
      const totalProblems = studentsWithStats.reduce((sum, s) => 
        sum + (s.stats?.totalSolved || 0), 0
      );
      
      const studentsWithRanking = studentsWithStats.filter(s => s.stats?.globalRanking);
      const avgRanking = studentsWithRanking.length > 0 
        ? Math.round(studentsWithRanking.reduce((sum, s) => sum + (s.stats?.globalRanking || 0), 0) / studentsWithRanking.length)
        : 0;

      res.json({
        totalStudents,
        activeThisWeek,
        totalProblems,
        avgRanking,
      });
    } catch (error) {
      console.error("Error calculating statistics:", error);
      res.status(500).json({ 
        message: "Failed to calculate statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Scrape students from NEDUET website
  app.post("/api/scrape", async (req, res) => {
    try {
      console.log("Starting scraping process...");
      const scrapedStudents = await scraper.scrapeStudents();
      
      let createdCount = 0;
      let updatedCount = 0;

      for (const scrapedStudent of scrapedStudents) {
        const insertStudent = scraper.convertToInsertStudent(scrapedStudent);
        const existing = await storage.getStudentByUsername(insertStudent.username);
        
        if (existing) {
          await storage.updateStudent(insertStudent.username, insertStudent);
          updatedCount++;
        } else {
          await storage.createStudent(insertStudent);
          createdCount++;
        }
      }

      console.log(`Scraping completed: ${createdCount} created, ${updatedCount} updated`);
      res.json({
        message: "Scraping completed successfully",
        created: createdCount,
        updated: updatedCount,
        total: scrapedStudents.length,
      });
    } catch (error) {
      console.error("Error during scraping:", error);
      res.status(500).json({ 
        message: "Scraping failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Fetch LeetCode stats for all students
  app.post("/api/fetch-leetcode-stats", async (req, res) => {
    try {
      console.log("Starting LeetCode stats fetch...");
      const students = await storage.getAllStudents();
      
      let successCount = 0;
      let failedCount = 0;
      const batchSize = 5; // Process in small batches to avoid rate limiting

      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);
        
        const promises = batch.map(async (student) => {
          try {
            const stats = await leetcodeAPI.getUserStatsWithRetry(student.username);
            if (stats) {
              const insertStats = leetcodeAPI.convertToInsertStats(stats);
              await storage.createOrUpdateLeetcodeStats(insertStats);
              successCount++;
              return true;
            } else {
              failedCount++;
              return false;
            }
          } catch (error) {
            console.error(`Failed to fetch stats for ${student.username}:`, error);
            failedCount++;
            return false;
          }
        });

        await Promise.all(promises);
        
        // Small delay between batches
        if (i + batchSize < students.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log(`LeetCode stats fetch completed: ${successCount} success, ${failedCount} failed`);
      res.json({
        message: "LeetCode stats fetch completed",
        success: successCount,
        failed: failedCount,
        total: students.length,
      });
    } catch (error) {
      console.error("Error fetching LeetCode stats:", error);
      res.status(500).json({ 
        message: "Failed to fetch LeetCode stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Refresh specific student's LeetCode stats
  app.post("/api/refresh-student/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const student = await storage.getStudentByUsername(username);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const stats = await leetcodeAPI.getUserStatsWithRetry(username);
      if (stats) {
        const insertStats = leetcodeAPI.convertToInsertStats(stats);
        await storage.createOrUpdateLeetcodeStats(insertStats);
        res.json({ message: "Stats refreshed successfully", stats });
      } else {
        res.status(404).json({ message: "Failed to fetch LeetCode stats for user" });
      }
    } catch (error) {
      console.error(`Error refreshing stats for ${req.params.username}:`, error);
      res.status(500).json({ 
        message: "Failed to refresh stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Full refresh: scrape + fetch LeetCode stats
  app.post("/api/full-refresh", async (req, res) => {
    try {
      console.log("Starting full refresh...");
      
      // First scrape students
      const scrapedStudents = await scraper.scrapeStudents();
      let studentResults = { created: 0, updated: 0 };

      for (const scrapedStudent of scrapedStudents) {
        const insertStudent = scraper.convertToInsertStudent(scrapedStudent);
        const existing = await storage.getStudentByUsername(insertStudent.username);
        
        if (existing) {
          await storage.updateStudent(insertStudent.username, insertStudent);
          studentResults.updated++;
        } else {
          await storage.createStudent(insertStudent);
          studentResults.created++;
        }
      }

      // Then fetch LeetCode stats
      const students = await storage.getAllStudents();
      let statsResults = { success: 0, failed: 0 };
      const batchSize = 5;

      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);
        
        const promises = batch.map(async (student) => {
          try {
            const stats = await leetcodeAPI.getUserStatsWithRetry(student.username);
            if (stats) {
              const insertStats = leetcodeAPI.convertToInsertStats(stats);
              await storage.createOrUpdateLeetcodeStats(insertStats);
              statsResults.success++;
            } else {
              statsResults.failed++;
            }
          } catch (error) {
            console.error(`Failed to fetch stats for ${student.username}:`, error);
            statsResults.failed++;
          }
        });

        await Promise.all(promises);
        
        if (i + batchSize < students.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log("Full refresh completed");
      res.json({
        message: "Full refresh completed successfully",
        students: studentResults,
        stats: statsResults,
      });
    } catch (error) {
      console.error("Error during full refresh:", error);
      res.status(500).json({ 
        message: "Full refresh failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Clear all data
  app.delete("/api/clear", async (req, res) => {
    try {
      await storage.clearAllData();
      res.json({ message: "All data cleared successfully" });
    } catch (error) {
      console.error("Error clearing data:", error);
      res.status(500).json({ 
        message: "Failed to clear data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
