import XLSX from 'xlsx';
import { DatabaseStorage } from './server/database-storage';
import type { InsertStudent, InsertLeetcodeStats } from '@shared/schema';

interface XLSXRow {
  [key: string]: any;
}

async function importXLSXData(filePath: string) {
  try {
    console.log('Reading XLSX file:', filePath);
    
    // Read the XLSX file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use the first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData: XLSXRow[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${jsonData.length} rows in the spreadsheet`);
    console.log('First few rows:', jsonData.slice(0, 3));
    
    // Initialize database storage
    const storage = new DatabaseStorage();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await storage.clearAllData();
    console.log('Existing data cleared');
    
    // Process each row
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of jsonData) {
      try {
        // Map XLSX columns to our schema - we'll need to adjust these based on actual column names
        const student: InsertStudent = {
          username: getColumnValue(row, ['username', 'Username', 'LeetCode Username', 'leetcode_username']),
          name: getColumnValue(row, ['name', 'Name', 'Full Name', 'Student Name']),
          rollNo: getColumnValue(row, ['rollNo', 'roll_no', 'Roll No', 'Roll Number', 'Student ID']),
          batch: getColumnValue(row, ['batch', 'Batch', 'Year', 'Graduation Year']) || '2024',
          program: getColumnValue(row, ['program', 'Program', 'Degree', 'Course']) || 'BS CS',
          skills: parseSkills(getColumnValue(row, ['skills', 'Skills', 'Programming Languages', 'Languages'])),
          avatarUrl: getColumnValue(row, ['avatarUrl', 'avatar_url', 'Avatar URL', 'Profile Picture']),
          leetcodeUrl: generateLeetCodeUrl(getColumnValue(row, ['username', 'Username', 'LeetCode Username', 'leetcode_username']))
        };
        
        // Validate required fields
        if (!student.username || !student.name) {
          console.warn('Skipping row due to missing required fields:', row);
          errorCount++;
          continue;
        }
        
        // Create student record
        await storage.createStudent(student);
        
        // Create LeetCode stats if available
        const stats: InsertLeetcodeStats = {
          username: student.username,
          totalSolved: parseInt(getColumnValue(row, ['totalSolved', 'total_solved', 'Problems Solved', 'Total Problems'])) || 0,
          easySolved: parseInt(getColumnValue(row, ['easySolved', 'easy_solved', 'Easy Problems', 'Easy'])) || 0,
          mediumSolved: parseInt(getColumnValue(row, ['mediumSolved', 'medium_solved', 'Medium Problems', 'Medium'])) || 0,
          hardSolved: parseInt(getColumnValue(row, ['hardSolved', 'hard_solved', 'Hard Problems', 'Hard'])) || 0,
          globalRanking: parseInt(getColumnValue(row, ['globalRanking', 'global_ranking', 'Ranking', 'Global Rank'])) || null,
        };
        
        await storage.createOrUpdateLeetcodeStats(stats);
        
        successCount++;
        console.log(`✓ Imported student: ${student.username} (${student.name})`);
        
      } catch (error) {
        console.error('Error importing row:', row, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} students`);
    console.log(`❌ Errors: ${errorCount} rows`);
    console.log(`📋 Total processed: ${jsonData.length} rows`);
    
  } catch (error) {
    console.error('Error importing XLSX data:', error);
    throw error;
  }
}

// Helper function to get column value by checking multiple possible column names
function getColumnValue(row: XLSXRow, possibleKeys: string[]): string | undefined {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return String(row[key]).trim();
    }
  }
  return undefined;
}

// Helper function to parse skills from various formats
function parseSkills(skillsString: string | undefined): string[] {
  if (!skillsString) return [];
  
  // Handle various separators: comma, semicolon, pipe, newline
  return skillsString
    .split(/[,;|\n]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}

// Helper function to generate LeetCode URL from username
function generateLeetCodeUrl(username: string | undefined): string {
  if (!username) return '';
  return `https://leetcode.com/${username}`;
}

// Export the function for use
export { importXLSXData };

// If this script is run directly, import from the provided file
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide the path to the XLSX file');
    console.log('Usage: tsx import-xlsx.ts <path-to-xlsx-file>');
    process.exit(1);
  }
  
  importXLSXData(filePath)
    .then(() => {
      console.log('🎉 Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}