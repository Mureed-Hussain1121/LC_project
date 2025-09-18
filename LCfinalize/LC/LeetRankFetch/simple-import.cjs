const XLSX = require('xlsx');
const { Pool } = require('pg');

async function simpleImport(filePath) {
  console.log('Reading XLSX file:', filePath);
  
  // Read the XLSX file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`Found ${jsonData.length} rows in the spreadsheet`);
  
  // Connect to database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM leetcode_stats');
    await client.query('DELETE FROM students');
    console.log('Existing data cleared');
    
    // Process each row and insert
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of jsonData) {
      try {
        // Map XLSX columns to database columns
        const username = getColumnValue(row, ['Username', 'username', 'LeetCode Username']);
        const name = getColumnValue(row, ['NAME', 'name', 'Name', 'Full Name']);
        const rollNo = getColumnValue(row, ['ROLL NO.', 'rollNo', 'roll_no', 'Roll No']);
        const batch = getColumnValue(row, ['BATCH', 'batch', 'Batch', 'Year']) || '2024';
        const programme = getColumnValue(row, ['PROGRAMME', 'program', 'Program', 'Degree']) || 'BS CS';
        const skills = parseSkills(getColumnValue(row, ['SKILLS', 'skills', 'Skills']));
        const avatarUrl = getColumnValue(row, ['AvatarURL', 'avatarUrl', 'avatar_url']);
        const ranking = parseInt(getColumnValue(row, ['RANK', 'ranking', 'global_ranking'])) || null;
        
        // Skip if missing required fields
        if (!username || !name) {
          console.warn('Skipping row due to missing required fields:', { username, name });
          errorCount++;
          continue;
        }
        
        const leetcodeUrl = `https://leetcode.com/${username}`;
        
        // Insert student
        const studentQuery = `
          INSERT INTO students (username, name, roll_no, batch, program, skills, avatar_url, leetcode_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        await client.query(studentQuery, [
          username, name, rollNo, batch, programme, 
          JSON.stringify(skills), avatarUrl, leetcodeUrl
        ]);
        
        // Insert stats if ranking available
        if (ranking) {
          const statsQuery = `
            INSERT INTO leetcode_stats (username, global_ranking, total_solved, easy_solved, medium_solved, hard_solved)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await client.query(statsQuery, [
            username, ranking, 0, 0, 0, 0
          ]);
        }
        
        successCount++;
        console.log(`✓ Imported: ${username} (${name})`);
        
      } catch (error) {
        console.error('Error importing row:', row, error.message);
        errorCount++;
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} students`);
    console.log(`❌ Errors: ${errorCount} rows`);
    console.log(`📋 Total processed: ${jsonData.length} rows`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

function getColumnValue(row, possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return String(row[key]).trim();
    }
  }
  return undefined;
}

function parseSkills(skillsString) {
  if (!skillsString || skillsString === '') return [];
  
  return skillsString
    .split(/[,;|\n]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}

// Run import if called directly
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide the path to the XLSX file');
    console.log('Usage: node simple-import.js <path-to-xlsx-file>');
    process.exit(1);
  }
  
  simpleImport(filePath)
    .then(() => {
      console.log('🎉 Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}

module.exports = { simpleImport };