import { Database, createDatabaseConfig } from './client';
import * as crypto from 'crypto';

// Simple password hashing for seed data
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'applyo_salt').digest('hex');
}

function generateApiKey(): string {
  return 'apo_' + crypto.randomBytes(32).toString('hex');
}

async function seed() {
  console.log('Starting database seed...');
  
  const db = Database.initialize(createDatabaseConfig());

  try {
    await db.transaction(async (client) => {
      // Seed test candidate
      const candidateResult = await client.query(`
        INSERT INTO users (id, email, password_hash, email_verified)
        VALUES (
          'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          'rohini@example.com',
          $1,
          true
        )
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `, [hashPassword('password123')]);

      const candidateId = candidateResult.rows[0]?.id || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

      // Seed profile
      await client.query(`
        INSERT INTO profiles (user_id, full_name, phone, headline, location, about, preferred_roles)
        VALUES (
          $1,
          'Rohini Sharma',
          '+91 9876543210',
          'Product Manager | Ex-Zetwerk | IIM Indore',
          'Bangalore, India',
          'Passionate product manager with 3+ years of experience in building B2B SaaS products.',
          ARRAY['Product Manager', 'Senior PM', 'Product Lead']
        )
        ON CONFLICT (user_id) DO NOTHING;
      `, [candidateId]);

      // Seed education
      await client.query(`
        INSERT INTO education (user_id, degree, institution, start_year, end_year)
        VALUES 
          ($1, 'MBA', 'IIM Indore', 2020, 2022),
          ($1, 'B.Tech Computer Science', 'NIT Trichy', 2014, 2018)
        ON CONFLICT DO NOTHING;
      `, [candidateId]);

      // Seed experience
      await client.query(`
        INSERT INTO experience (user_id, company_name, role, start_date, end_date, description)
        VALUES 
          ($1, 'Zetwerk', 'Product Analyst', '2023-01-01', NULL, 'Led workflow automation initiatives reducing manual effort by 40%'),
          ($1, 'Flipkart', 'Associate PM', '2022-06-01', '2022-12-31', 'Managed seller onboarding product with 2M+ active sellers')
        ON CONFLICT DO NOTHING;
      `, [candidateId]);

      // Seed skills
      await client.query(`
        INSERT INTO skills (user_id, skill)
        VALUES 
          ($1, 'Product Management'),
          ($1, 'SQL'),
          ($1, 'Figma'),
          ($1, 'Data Analysis'),
          ($1, 'Agile'),
          ($1, 'User Research')
        ON CONFLICT DO NOTHING;
      `, [candidateId]);

      // Seed test company
      const apiKey = generateApiKey();
      const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      await client.query(`
        INSERT INTO companies (id, company_name, domain, email, password_hash, api_key_hash)
        VALUES (
          'c1d2e3f4-a5b6-7890-cdef-123456789012',
          'TechCorp India',
          'techcorp.com',
          'hr@techcorp.com',
          $1,
          $2
        )
        ON CONFLICT (email) DO NOTHING;
      `, [hashPassword('company123'), apiKeyHash]);

      console.log('Test company API key (save this!):', apiKey);

      // Seed test job
      await client.query(`
        INSERT INTO jobs (company_id, title, description, location, type)
        VALUES (
          'c1d2e3f4-a5b6-7890-cdef-123456789012',
          'Senior Product Manager',
          'We are looking for an experienced PM to lead our B2B platform.',
          'Bangalore, India',
          'full-time'
        )
        ON CONFLICT DO NOTHING;
      `);

      console.log('Seed data inserted successfully!');
      console.log('---');
      console.log('Test Candidate Login:');
      console.log('  Email: rohini@example.com');
      console.log('  Password: password123');
      console.log('---');
      console.log('Test Company Login:');
      console.log('  Email: hr@techcorp.com');
      console.log('  Password: company123');
    });
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

seed();
