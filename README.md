# ApplyO - Job Application SaaS Platform

## Architecture Overview

ApplyO is an enterprise microservices-based SaaS platform that eliminates repetitive job application form filling. The platform consists of:

### Backend Services (Java 21 + Spring Boot 3.2)

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 8080 | Spring Cloud Gateway - routing, rate limiting, JWT auth |
| **Auth Service** | 8083 | User authentication, JWT tokens, password management |
| **Candidate Service** | 8081 | Candidate profiles, education, experience, skills |
| **Company Service** | 8082 | Company registration, jobs, API keys |
| **Application Service** | 8084 | Job applications, consent tokens |
| **Document Service** | 8085 | Resume/document upload with GridFS |

### Frontend (Next.js 14)

| App | Port | Description |
|-----|------|-------------|
| **Web** | 3000 | Candidate & Company dashboards |

### Infrastructure

- **MongoDB 7.0** - Document database
- **Redis 7** - Caching & rate limiting
- **Docker** - Containerization

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for frontend development)
- Maven 3.9+

### Running with Docker

```bash
# Clone and navigate to project
cd ApplyO

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Local Development

#### Start Infrastructure
```bash
# Start MongoDB and Redis only
docker-compose up -d mongodb redis
```

#### Run Services Individually
```bash
# Auth Service
cd services/auth-service
mvn spring-boot:run

# Candidate Service
cd services/candidate-service
mvn spring-boot:run

# Company Service
cd services/company-service
mvn spring-boot:run

# Application Service
cd services/application-service
mvn spring-boot:run

# Document Service
cd services/document-service
mvn spring-boot:run

# API Gateway (run last)
cd services/api-gateway
mvn spring-boot:run
```

#### Run Frontend
```bash
cd apps/web
npm install
npm run dev
```

## API Endpoints

### Authentication
```
POST /api/v1/auth/signup     - Register new user
POST /api/v1/auth/login      - Login
POST /api/v1/auth/refresh    - Refresh access token
POST /api/v1/auth/logout     - Logout
GET  /api/v1/auth/me         - Get current user
```

### Candidates
```
POST /api/v1/candidate            - Create profile
GET  /api/v1/candidate/profile    - Get my profile
PUT  /api/v1/candidate/profile    - Update profile
POST /api/v1/candidate/education  - Add education
POST /api/v1/candidate/experience - Add experience
POST /api/v1/candidate/skills     - Add skills
```

### Companies
```
POST /api/v1/company              - Create company
GET  /api/v1/company/profile      - Get my company
PUT  /api/v1/company/profile      - Update company
POST /api/v1/company/api-keys     - Create API key
POST /api/v1/company/jobs         - Create job
GET  /api/v1/company/jobs         - Get company jobs
```

### Jobs (Public)
```
GET /api/v1/jobs                  - List active jobs
GET /api/v1/jobs/{id}             - Get job details
```

### Applications
```
POST /api/v1/applications                    - Submit application
GET  /api/v1/applications/candidate          - My applications
GET  /api/v1/applications/job/{jobId}        - Job applications (company)
PUT  /api/v1/applications/{id}/status        - Update status (company)
POST /api/v1/applications/{id}/withdraw      - Withdraw application
```

### Consent
```
POST /api/v1/consent/request             - Create consent request (company)
GET  /api/v1/consent/token/{token}       - Get consent details
POST /api/v1/consent/token/{token}/respond - Respond to consent
POST /api/v1/consent/{id}/revoke         - Revoke consent
```

### Documents
```
POST /api/v1/documents/upload            - Upload document
GET  /api/v1/documents                   - List my documents
GET  /api/v1/documents/{id}              - Get document info
GET  /api/v1/documents/{id}/download     - Download document
DELETE /api/v1/documents/{id}            - Delete document
```

## Project Structure

```
ApplyO/
├── services/
│   ├── api-gateway/           # Spring Cloud Gateway
│   │   ├── src/main/java/
│   │   │   └── com/applyo/gateway/
│   │   │       ├── ApiGatewayApplication.java
│   │   │       ├── config/
│   │   │       ├── filter/
│   │   │       └── util/
│   │   ├── src/main/resources/
│   │   │   └── application.yml
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── auth-service/          # Authentication
│   │   ├── src/main/java/
│   │   │   └── com/applyo/auth/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── model/
│   │   │       ├── dto/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── exception/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── candidate-service/     # Candidate Management
│   ├── company-service/       # Company & Jobs
│   ├── application-service/   # Applications & Consent
│   └── document-service/      # Document Storage
│
├── apps/
│   └── web/                   # Next.js Frontend
│       ├── app/
│       ├── components/
│       └── lib/
│
├── docker/
│   └── mongo-init.js          # MongoDB initialization
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Key Features

### For Candidates
- ✅ One-time profile setup
- ✅ Education, experience, skills management
- ✅ Resume upload and management
- ✅ One-click job applications
- ✅ Application tracking
- ✅ Consent management (control data sharing)

### For Companies
- ✅ Company profile & verification
- ✅ Job posting with custom questions
- ✅ API key management for integration
- ✅ Applicant management
- ✅ Consent-based data access
- ✅ Webhook support

### Security
- ✅ JWT-based authentication
- ✅ API key authentication for companies
- ✅ Rate limiting per API key
- ✅ BCrypt password hashing
- ✅ Consent token flow

## Technology Stack

- **Backend**: Java 21, Spring Boot 3.2, Spring Cloud Gateway
- **Database**: MongoDB 7.0, GridFS for documents
- **Cache**: Redis 7
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Auth**: JWT with refresh tokens
- **Containerization**: Docker, Docker Compose

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_USERNAME` | MongoDB admin username | admin |
| `MONGO_PASSWORD` | MongoDB admin password | admin123 |
| `JWT_SECRET` | JWT signing key (Base64) | (provided) |
| `REDIS_HOST` | Redis hostname | localhost |
| `REDIS_PORT` | Redis port | 6379 |

## License

MIT License - see LICENSE file
