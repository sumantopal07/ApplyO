'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfileStore } from '@/store/profile';
import { applicationsApi } from '@/lib/api';
import {
  User,
  FileText,
  Briefcase,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  calculateProfileCompletion,
  getMissingProfileSections,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from '@/lib/utils';

interface ApplicationStats {
  total: number;
  byStatus: {
    submitted: number;
    viewed: number;
    shortlisted: number;
    interview: number;
    rejected: number;
    hired: number;
  };
}

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
}

export default function DashboardPage() {
  const { profile, isLoading: profileLoading } = useProfileStore();
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, applicationsRes] = await Promise.all([
          applicationsApi.getStats(),
          applicationsApi.getAll({ limit: 5 }),
        ]);
        setStats(statsRes.data.data);
        setRecentApplications(applicationsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profileCompletion = profile ? calculateProfileCompletion(profile) : 0;
  const missingSections = profile ? getMissingProfileSections(profile) : [];

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.fullName?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your job applications.
        </p>
      </div>

      {/* Profile Completion Banner */}
      {profileCompletion < 100 && (
        <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Complete your profile</h3>
              </div>
              <p className="text-gray-600 mt-1">
                Your profile is {profileCompletion}% complete. Add{' '}
                {missingSections.slice(0, 2).join(', ')}
                {missingSections.length > 2 && ` and ${missingSections.length - 2} more`} to improve your chances.
              </p>
              <div className="mt-3 w-full bg-white rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="btn-primary ml-4 flex-shrink-0"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.shortlisted || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.interviews || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Profile</p>
              <p className="text-2xl font-bold text-gray-900">{profileCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/profile" className="card p-6 hover:border-primary-300 transition-colors">
          <User className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Edit Profile</h3>
          <p className="text-sm text-gray-500 mt-1">Update your information and preferences</p>
        </Link>

        <Link href="/dashboard/documents" className="card p-6 hover:border-primary-300 transition-colors">
          <FileText className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Upload Resume</h3>
          <p className="text-sm text-gray-500 mt-1">Keep your resume up to date</p>
        </Link>

        <Link href="/dashboard/applications" className="card p-6 hover:border-primary-300 transition-colors">
          <Plus className="w-8 h-8 text-primary-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Track Application</h3>
          <p className="text-sm text-gray-500 mt-1">Add a new job application</p>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-primary-600 text-sm font-medium hover:underline flex items-center">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        
        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your job applications</p>
            <Link href="/dashboard/applications" className="btn-primary">
              Add Application
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recentApplications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-500">{app.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(app.appliedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
