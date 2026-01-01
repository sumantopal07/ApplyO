import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth';

// Use CloudFront URL for production, env var for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://d2z6dl8z16a4dw.cloudfront.net' 
    : 'http://localhost:8080');

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data.data;
          useAuthStore.getState().setAccessToken(accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; fullName: string; userType: 'CANDIDATE' | 'COMPANY' }) =>
    api.post<ApiResponse>('/auth/signup', data),
    
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/login', data),
  
  companyLogin: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/company/login', data),
  
  companySignup: (data: { email: string; password: string; companyName: string }) =>
    api.post<ApiResponse>('/auth/company/signup', data),
    
  refresh: (refreshToken: string) =>
    api.post<ApiResponse>('/auth/refresh', { refreshToken }),
    
  logout: (refreshToken: string) =>
    api.post<ApiResponse>('/auth/logout', { refreshToken }),
  
  updateProfile: (data: any) =>
    api.put<ApiResponse>('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>('/auth/password', data),
  
  deleteAccount: () =>
    api.delete<ApiResponse>('/auth/account'),
};

// Candidate API
export const candidateApi = {
  createProfile: (data: { userId: string; email: string; fullName: string }) =>
    api.post<ApiResponse>('/candidate', data),
  
  getProfile: () =>
    api.get<ApiResponse>('/candidate/profile'),
    
  updateProfile: (data: any) =>
    api.put<ApiResponse>('/candidate/profile', data),
    
  // Education
  getEducation: () =>
    api.get<ApiResponse>('/candidate/education'),
    
  addEducation: (data: any) =>
    api.post<ApiResponse>('/candidate/education', data),
    
  deleteEducation: (id: string) =>
    api.delete<ApiResponse>(`/candidate/education/${id}`),
    
  // Experience
  getExperience: () =>
    api.get<ApiResponse>('/candidate/experience'),
    
  addExperience: (data: any) =>
    api.post<ApiResponse>('/candidate/experience', data),
    
  deleteExperience: (id: string) =>
    api.delete<ApiResponse>(`/candidate/experience/${id}`),
    
  // Skills
  getSkills: () =>
    api.get<ApiResponse>('/candidate/skills'),
    
  addSkills: (skills: string[]) =>
    api.post<ApiResponse>('/candidate/skills', { skills }),
    
  deleteSkill: (id: string) =>
    api.delete<ApiResponse>(`/candidate/skills/${id}`),
    
  // Consent
  getConsentRequest: (token: string) =>
    api.get<ApiResponse>(`/candidate/consent/${token}`),
    
  approveConsent: (token: string, fields: string[]) =>
    api.post<ApiResponse>(`/candidate/consent/${token}/approve`, { fields }),
    
  denyConsent: (token: string) =>
    api.post<ApiResponse>(`/candidate/consent/${token}/deny`),
};

// Applications API
export const applicationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse>('/applications', { params }),
    
  getOne: (id: string) =>
    api.get<ApiResponse>(`/applications/${id}`),
    
  create: (data: any) =>
    api.post<ApiResponse>('/applications', data),
    
  update: (id: string, data: any) =>
    api.put<ApiResponse>(`/applications/${id}`, data),
    
  delete: (id: string) =>
    api.delete<ApiResponse>(`/applications/${id}`),
    
  getStats: () =>
    api.get<ApiResponse>('/applications/stats/summary'),
};

// Documents API
export const documentsApi = {
  getAll: (type?: string) =>
    api.get<ApiResponse>('/documents', { params: { type } }),
    
  upload: (file: File, type: string = 'resume') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post<ApiResponse>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getDownloadUrl: (id: string) =>
    api.get<ApiResponse>(`/documents/${id}/download`),
    
  delete: (id: string) =>
    api.delete<ApiResponse>(`/documents/${id}`),
    
  replace: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.put<ApiResponse>(`/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Application API (aliased for dashboard)
export const applicationApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse>('/applications', { params }),
    
  getOne: (id: string) =>
    api.get<ApiResponse>(`/applications/${id}`),
    
  create: (data: any) =>
    api.post<ApiResponse>('/applications', data),
    
  update: (id: string, data: any) =>
    api.put<ApiResponse>(`/applications/${id}`, data),
    
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse>(`/applications/${id}/status`, { status }),
    
  delete: (id: string) =>
    api.delete<ApiResponse>(`/applications/${id}`),
    
  getStats: () =>
    api.get<ApiResponse>('/applications/stats/summary'),
};

// Document API (aliased for dashboard)
export const documentApi = {
  getAll: (type?: string) =>
    api.get<ApiResponse>('/documents', { params: { type } }),
    
  upload: (formData: FormData) =>
    api.post<ApiResponse>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  delete: (id: string) =>
    api.delete<ApiResponse>(`/documents/${id}`),
    
  download: async (id: string): Promise<string> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },
};

// Company API
export const companyApi = {
  // Dashboard
  getStats: () =>
    api.get<ApiResponse>('/company/stats'),
    
  getRecentActivity: () =>
    api.get<ApiResponse>('/company/activity'),
    
  // API Keys
  getApiKeys: () =>
    api.get<ApiResponse>('/company/api-keys'),
    
  createApiKey: (data: { name: string }) =>
    api.post<ApiResponse>('/company/api-keys', data),
    
  revokeApiKey: (id: string) =>
    api.delete<ApiResponse>(`/company/api-keys/${id}`),
    
  // Candidate Lookup
  lookupCandidate: (email: string) =>
    api.get<ApiResponse>('/candidate/lookup', { params: { email } }),
    
  getCandidateProfile: (id: string) =>
    api.get<ApiResponse>(`/candidate/${id}/profile`),
    
  requestConsent: (data: { candidateEmail: string; requestedFields: string[]; purpose?: string }) =>
    api.post<ApiResponse>('/candidate/consent/request', data),
    
  // Jobs
  getJobs: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse>('/company/jobs', { params }),
    
  createJob: (data: any) =>
    api.post<ApiResponse>('/company/jobs', data),
    
  updateJob: (id: string, data: any) =>
    api.put<ApiResponse>(`/company/jobs/${id}`, data),
    
  deleteJob: (id: string) =>
    api.delete<ApiResponse>(`/company/jobs/${id}`),
    
  // Applications
  getApplications: (jobId?: string) =>
    api.get<ApiResponse>('/company/applications', { params: { jobId } }),
};

// Consent API (for candidates)
export const consentApi = {
  getRequest: (token: string) =>
    api.get<ApiResponse>(`/consent/${token}`),
    
  approve: (token: string, fields: string[]) =>
    api.post<ApiResponse>(`/consent/${token}/approve`, { fields }),
    
  deny: (token: string) =>
    api.post<ApiResponse>(`/consent/${token}/deny`),
};

// Auth API extended - extends base authApi with additional methods
const authApiExtended = {
  ...authApi,
  
  updateProfile: (data: any) =>
    api.put<ApiResponse>('/auth/profile', data),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse>('/auth/change-password', data),
    
  deleteAccount: () =>
    api.delete<ApiResponse>('/auth/account'),
    
  // Company auth
  companySignup: (data: { email: string; password: string; companyName: string }) =>
    api.post<ApiResponse>('/auth/company/signup', data),
    
  companyLogin: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/company/login', data),
};

// Export extended auth API as authApiExt to avoid duplicate
export { authApiExtended as authApiExt };

export default api;
