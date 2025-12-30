import { Database, createDatabaseConfig } from './client';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  console.log('Starting database migration...');
  
  const db = Database.initialize(createDatabaseConfig());

  try {
    // Create migrations tracking table
    await db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      // Check if migration already executed
      const { rows } = await db.query(
        'SELECT 1 FROM schema_migrations WHERE name = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`Executing ${file}...`);
      
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      await db.transaction(async (client) => {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [file]
        );
      });

      console.log(`Completed ${file}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrate();
