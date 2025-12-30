// MongoDB initialization script
// This runs when the container is first created

// Create the applyo database and collections
db = db.getSiblingDB('applyo');

// Create collections with validation
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'passwordHash', 'userType'],
            properties: {
                email: {
                    bsonType: 'string',
                    description: 'User email - required'
                },
                passwordHash: {
                    bsonType: 'string',
                    description: 'Hashed password - required'
                },
                userType: {
                    enum: ['CANDIDATE', 'COMPANY'],
                    description: 'User type - required'
                }
            }
        }
    }
});

db.createCollection('candidates');
db.createCollection('companies');
db.createCollection('jobs');
db.createCollection('applications');
db.createCollection('consent_tokens');
db.createCollection('documents');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });

db.candidates.createIndex({ userId: 1 }, { unique: true });
db.candidates.createIndex({ email: 1 }, { unique: true });

db.companies.createIndex({ userId: 1 }, { unique: true });
db.companies.createIndex({ email: 1 }, { unique: true });

db.jobs.createIndex({ companyId: 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ companyId: 1, status: 1 });

db.applications.createIndex({ candidateId: 1 });
db.applications.createIndex({ jobId: 1 });
db.applications.createIndex({ companyId: 1 });
db.applications.createIndex({ candidateId: 1, jobId: 1 }, { unique: true });

db.consent_tokens.createIndex({ token: 1 }, { unique: true });
db.consent_tokens.createIndex({ candidateId: 1 });
db.consent_tokens.createIndex({ companyId: 1 });

db.documents.createIndex({ ownerId: 1 });
db.documents.createIndex({ ownerId: 1, documentType: 1 });

print('ApplyO database initialized successfully!');
