// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// API Request Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Candidate Lookup Response
export interface CandidateLookupResponse {
  exists: boolean;
  candidateId?: string;
  requiresConsent?: boolean;
}

// Candidate Profile Response (for companies)
export interface CandidateProfileResponse {
  candidateId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  about?: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    startYear: number;
    endYear?: number;
  }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  resumeUrl?: string;
  timestamp: string;
}

// Consent Request/Response
export interface ConsentRequest {
  candidateId: string;
  companyId: string;
  email: string;
}

export interface ConsentResponse {
  status: 'approved' | 'denied';
  consentToken?: string;
  expiresIn?: number;
}

// Application Request
export interface CreateApplicationRequest {
  candidateId: string;
  companyId: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  status?: string;
  meta?: any;
}

// Webhook Payload
export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    candidateId?: string;
    companyId?: string;
    jobId?: string;
    applicationId?: string;
    status?: string;
  };
}

// Auth Types
export interface TokenPayload {
  sub: string;
  email: string;
  type: 'candidate' | 'company';
  iat: number;
  exp: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    type: 'candidate' | 'company';
  };
}

// Service-to-Service Communication
export interface ServiceRequest {
  service: string;
  action: string;
  payload: any;
  correlationId: string;
}

export interface ServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  correlationId: string;
}
