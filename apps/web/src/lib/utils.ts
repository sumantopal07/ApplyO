import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: 'badge-gray',
    viewed: 'badge-blue',
    shortlisted: 'badge-purple',
    interview: 'badge-yellow',
    rejected: 'badge-red',
    hired: 'badge-green',
  };
  return colors[status] || 'badge-gray';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: 'Submitted',
    viewed: 'Viewed',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    rejected: 'Rejected',
    hired: 'Hired',
  };
  return labels[status] || status;
}

export function calculateProfileCompletion(profile: any): number {
  const fields = [
    'fullName',
    'phone',
    'headline',
    'location',
    'about',
    'education',
    'experience',
    'skills',
    'documents',
  ];
  
  let completed = 0;
  
  if (profile?.fullName) completed++;
  if (profile?.phone) completed++;
  if (profile?.headline) completed++;
  if (profile?.location) completed++;
  if (profile?.about) completed++;
  if (profile?.education?.length > 0) completed++;
  if (profile?.experience?.length > 0) completed++;
  if (profile?.skills?.length > 0) completed++;
  if (profile?.documents?.length > 0) completed++;
  
  return Math.round((completed / fields.length) * 100);
}

export function getMissingProfileSections(profile: any): string[] {
  const missing: string[] = [];
  
  if (!profile?.fullName) missing.push('Full Name');
  if (!profile?.phone) missing.push('Phone');
  if (!profile?.headline) missing.push('Headline');
  if (!profile?.location) missing.push('Location');
  if (!profile?.about) missing.push('About');
  if (!profile?.education?.length) missing.push('Education');
  if (!profile?.experience?.length) missing.push('Experience');
  if (!profile?.skills?.length) missing.push('Skills');
  if (!profile?.documents?.length) missing.push('Resume');
  
  return missing;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
