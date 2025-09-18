import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { students, leetcodeStats, type InsertStudent, type Student, type InsertLeetcodeStats, type LeetcodeStats, type StudentWithStats } from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const neonClient = neon(process.env.DATABASE_URL);
    this.db = drizzle(neonClient);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await this.db.select().from(students).where(eq(students.id, id));
    return result[0] || undefined;
  }

  async getStudentByUsername(username: string): Promise<Student | undefined> {
    const result = await this.db.select().from(students).where(eq(students.username, username));
    return result[0] || undefined;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const result = await this.db.insert(students).values(student).returning();
    return result[0];
  }

  async updateStudent(username: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await this.db
      .update(students)
      .set({ ...student, lastUpdated: new Date() })
      .where(eq(students.username, username))
      .returning();
    return result[0] || undefined;
  }

  async getAllStudents(): Promise<Student[]> {
    return await this.db.select().from(students);
  }

  async getLeetcodeStats(username: string): Promise<LeetcodeStats | undefined> {
    const result = await this.db.select().from(leetcodeStats).where(eq(leetcodeStats.username, username));
    return result[0] || undefined;
  }

  async createOrUpdateLeetcodeStats(stats: InsertLeetcodeStats): Promise<LeetcodeStats> {
    // Try to update first
    const updateResult = await this.db
      .update(leetcodeStats)
      .set({ ...stats, lastUpdated: new Date() })
      .where(eq(leetcodeStats.username, stats.username))
      .returning();

    if (updateResult.length > 0) {
      return updateResult[0];
    }

    // If no existing record, insert new one
    const insertResult = await this.db.insert(leetcodeStats).values(stats).returning();
    return insertResult[0];
  }

  async getStudentsWithStats(): Promise<StudentWithStats[]> {
    const studentsData = await this.db.select().from(students);
    const studentsWithStats: StudentWithStats[] = [];

    for (const student of studentsData) {
      const stats = await this.getLeetcodeStats(student.username);
      studentsWithStats.push({
        ...student,
        stats,
      });
    }

    return studentsWithStats;
  }

  async clearAllData(): Promise<void> {
    // Delete in correct order due to foreign key constraints (if any)
    await this.db.delete(leetcodeStats);
    await this.db.delete(students);
  }
}