// Error codes
export const ErrorCodes = {
  // Auth errors (1xxx)
  UNAUTHORIZED: 1001,
  INVALID_TOKEN: 1002,
  TOKEN_EXPIRED: 1003,
  INVALID_CREDENTIALS: 1004,
  ACCOUNT_DISABLED: 1005,
  
  // Validation errors (2xxx)
  VALIDATION_ERROR: 2001,
  INVALID_INPUT: 2002,
  MISSING_REQUIRED_FIELD: 2003,
  
  // Resource errors (3xxx)
  NOT_FOUND: 3001,
  ALREADY_EXISTS: 3002,
  CONFLICT: 3003,
  
  // Permission errors (4xxx)
  FORBIDDEN: 4001,
  CONSENT_REQUIRED: 4002,
  CONSENT_EXPIRED: 4003,
  
  // Rate limiting (5xxx)
  RATE_LIMIT_EXCEEDED: 5001,
  
  // Server errors (9xxx)
  INTERNAL_ERROR: 9001,
  SERVICE_UNAVAILABLE: 9002,
  DATABASE_ERROR: 9003,
} as const;

// HTTP Status codes mapping
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Application status flow
export const ApplicationStatusFlow = {
  submitted: ['viewed', 'rejected'],
  viewed: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['hired', 'rejected'],
  rejected: [],
  hired: [],
} as const;

// File upload limits
export const FileUploadLimits = {
  RESUME_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  RESUME_ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  CERTIFICATE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  CERTIFICATE_ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const;

// Rate limiting defaults
export const RateLimits = {
  COMPANY_API_REQUESTS_PER_MINUTE: 60,
  CANDIDATE_REQUESTS_PER_MINUTE: 30,
  AUTH_ATTEMPTS_PER_HOUR: 10,
} as const;

// Token expiry times (in seconds)
export const TokenExpiry = {
  ACCESS_TOKEN: 15 * 60, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
  CONSENT_TOKEN: 10 * 60, // 10 minutes
  RESUME_SIGNED_URL: 24 * 60 * 60, // 24 hours
} as const;

// Service names for inter-service communication
export const Services = {
  API_GATEWAY: 'api-gateway',
  CANDIDATE_SERVICE: 'candidate-service',
  COMPANY_SERVICE: 'company-service',
  APPLICATION_SERVICE: 'application-service',
  DOCUMENT_SERVICE: 'document-service',
  NOTIFICATION_SERVICE: 'notification-service',
} as const;

// Event types for audit logging
export const AuditEvents = {
  // Auth events
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  PASSWORD_RESET: 'user.password_reset',
  
  // Profile events
  PROFILE_CREATED: 'profile.created',
  PROFILE_UPDATED: 'profile.updated',
  PROFILE_DELETED: 'profile.deleted',
  
  // Document events
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_DELETED: 'document.deleted',
  
  // Consent events
  CONSENT_GRANTED: 'consent.granted',
  CONSENT_REVOKED: 'consent.revoked',
  
  // Application events
  APPLICATION_SUBMITTED: 'application.submitted',
  APPLICATION_STATUS_CHANGED: 'application.status_changed',
  
  // Company events
  COMPANY_REGISTERED: 'company.registered',
  API_KEY_GENERATED: 'company.api_key_generated',
  API_KEY_ROTATED: 'company.api_key_rotated',
  WEBHOOK_CONFIGURED: 'company.webhook_configured',
  
  // API events
  CANDIDATE_LOOKUP: 'api.candidate_lookup',
  PROFILE_FETCHED: 'api.profile_fetched',
} as const;
