// Script to update Supabase database schema
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://vqlevlvqxwwofnecitxo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbGV2bHZxeHd3b2ZuZWNpdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDk1NzMsImV4cCI6MjA2MzMyNTU3M30.haGyIaB50jdZKBHS9rRE-7ULf-3fAYeFYwe-5bONmKE';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'supabase-setup.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split the SQL content into individual statements
const sqlStatements = sqlContent
  .replace(/--.*$/gm, '') // Remove comments
  .split(';')
  .filter(statement => statement.trim() !== '');

// Function to execute SQL statements
async function executeSQL() {
  console.log('Starting Supabase database update...');
  
  try {
    // Execute each SQL statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error.message);
          console.log('Statement:', statement);
        } else {
          console.log(`Statement ${i + 1} executed successfully.`);
        }
      }
    }
    
    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error updating database:', error.message);
  }
}

// Execute the SQL statements
executeSQL();
