import { z } from 'zod';

// Auth Validators
export const signupValidator = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required').max(255),
});

export const loginValidator = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Profile Validators
export const createProfileValidator = z.object({
  fullName: z.string().min(1).max(255),
  phone: z.string().optional(),
  headline: z.string().max(500).optional(),
  location: z.string().max(255).optional(),
  about: z.string().max(5000).optional(),
  preferredRoles: z.array(z.string()).max(10).optional(),
});

export const updateProfileValidator = createProfileValidator.partial();

// Education Validators
export const createEducationValidator = z.object({
  degree: z.string().min(1).max(255),
  institution: z.string().min(1).max(255),
  startYear: z.number().int().min(1950).max(2030),
  endYear: z.number().int().min(1950).max(2030).optional(),
});

export const updateEducationValidator = createEducationValidator.partial();

// Experience Validators
export const createExperienceValidator = z.object({
  companyName: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  description: z.string().max(5000).optional(),
});

export const updateExperienceValidator = createExperienceValidator.partial();

// Skill Validators
export const addSkillsValidator = z.object({
  skills: z.array(z.string().min(1).max(100)).min(1).max(50),
});

// Company Validators
export const companySignupValidator = z.object({
  companyName: z.string().min(1).max(255),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  domain: z.string().optional(),
});

export const updateCompanyValidator = z.object({
  companyName: z.string().min(1).max(255).optional(),
  domain: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

// Job Validators
export const createJobValidator = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  location: z.string().max(255).optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
});

export const updateJobValidator = createJobValidator.partial();

// Application Validators
export const createApplicationValidator = z.object({
  companyId: z.string().uuid().optional(),
  companyName: z.string().min(1).max(255),
  jobId: z.string().uuid().optional(),
  jobTitle: z.string().min(1).max(255),
  jobLink: z.string().url().optional(),
  resumeDocumentId: z.string().uuid().optional(),
  meta: z.any().optional(),
});

export const updateApplicationStatusValidator = z.object({
  status: z.enum(['submitted', 'viewed', 'shortlisted', 'interview', 'rejected', 'hired']),
});

// Consent Validators
export const consentRequestValidator = z.object({
  candidateId: z.string().uuid(),
  companyId: z.string().uuid(),
  email: z.string().email(),
});

// API Query Validators
export const paginationValidator = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const candidateLookupValidator = z.object({
  email: z.string().email('Invalid email format'),
});

export const profileFetchValidator = z.object({
  candidateId: z.string().uuid('Invalid candidate ID'),
  consentToken: z.string().min(1, 'Consent token is required'),
});

// Webhook Validators
export const webhookPayloadValidator = z.object({
  candidateId: z.string().uuid(),
  companyId: z.string().uuid(),
  jobId: z.string().uuid().optional(),
  newStatus: z.enum(['submitted', 'viewed', 'shortlisted', 'interview', 'rejected', 'hired']),
});
