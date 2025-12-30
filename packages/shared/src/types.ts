import { z } from 'zod';

// User/Candidate Types
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Profile Types
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string().min(1).max(255),
  phone: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  preferredRoles: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Education Types
export const EducationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  degree: z.string(),
  institution: z.string(),
  startYear: z.number().int().min(1950).max(2030),
  endYear: z.number().int().min(1950).max(2030).optional(),
  createdAt: z.date(),
});

export type Education = z.infer<typeof EducationSchema>;

// Experience Types
export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyName: z.string(),
  role: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// Skill Types
export const SkillSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  skill: z.string(),
});

export type Skill = z.infer<typeof SkillSchema>;

// Document Types
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['resume', 'certificate', 'other']),
  storagePath: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.date(),
});

export type Document = z.infer<typeof DocumentSchema>;

// Company Types
export const CompanySchema = z.object({
  id: z.string().uuid(),
  companyName: z.string(),
  domain: z.string().optional(),
  email: z.string().email(),
  passwordHash: z.string(),
  apiKey: z.string(),
  apiKeyHash: z.string(),
  webhookUrl: z.string().url().optional(),
  webhookSecret: z.string().optional(),
  formSchema: z.any().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Company = z.infer<typeof CompanySchema>;

// Job Types
export const JobSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Job = z.infer<typeof JobSchema>;

// Application Types
export const ApplicationStatusEnum = z.enum([
  'submitted',
  'viewed',
  'shortlisted',
  'interview',
  'rejected',
  'hired',
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyId: z.string().uuid().optional(),
  companyName: z.string(),
  jobId: z.string().uuid().optional(),
  jobTitle: z.string(),
  jobLink: z.string().url().optional(),
  status: ApplicationStatusEnum.default('submitted'),
  resumeDocumentId: z.string().uuid().optional(),
  meta: z.any().optional(),
  appliedAt: z.date(),
});

export type Application = z.infer<typeof ApplicationSchema>;

// Consent Token Types
export const ConsentTokenSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid(),
  companyId: z.string().uuid(),
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type ConsentToken = z.infer<typeof ConsentTokenSchema>;

// Audit Log Types
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  actorType: z.enum(['candidate', 'company', 'system']),
  actorId: z.string().uuid().optional(),
  payload: z.any(),
  createdAt: z.date(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
