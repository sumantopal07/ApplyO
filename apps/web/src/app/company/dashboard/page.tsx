'use client';

import { useState, useEffect } from 'react';
import { companyApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import {
  Key,
  Users,
  Briefcase,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    apiCalls: 0,
    apiQuota: 10000,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to be ready before fetching data
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        companyApi.getStats(),
        companyApi.getRecentActivity(),
      ]);
      setStats(statsRes.data.data);
      setRecentActivity(activityRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Candidates',
      value: stats.totalCandidates,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+3',
      changeType: 'positive',
    },
    {
      name: 'API Calls This Month',
      value: stats.apiCalls.toLocaleString(),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: `${Math.round((stats.apiCalls / stats.apiQuota) * 100)}%`,
      changeType: 'neutral',
      subtitle: `of ${stats.apiQuota.toLocaleString()} quota`,
    },
    {
      name: 'API Keys',
      value: '2',
      icon: Key,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Active',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
        <p className="text-gray-600">Manage your API access and candidate data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.changeType !== 'neutral' && (
                <div
                  className={`flex items-center text-sm ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.name}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Usage Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">API Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Monthly Quota</span>
                <span className="font-medium">
                  {stats.apiCalls.toLocaleString()} / {stats.apiQuota.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    (stats.apiCalls / stats.apiQuota) > 0.8
                      ? 'bg-red-500'
                      : (stats.apiCalls / stats.apiQuota) > 0.5
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min((stats.apiCalls / stats.apiQuota) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Mock API endpoints breakdown */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Calls by Endpoint</h4>
              <div className="space-y-2">
                {[
                  { endpoint: '/api/v1/candidates/lookup', calls: 450, color: 'bg-blue-500' },
                  { endpoint: '/api/v1/candidates/profile', calls: 280, color: 'bg-green-500' },
                  { endpoint: '/api/v1/consent/request', calls: 150, color: 'bg-purple-500' },
                  { endpoint: '/api/v1/jobs', calls: 120, color: 'bg-orange-500' },
                ].map((item) => (
                  <div key={item.endpoint} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`} />
                    <span className="text-sm text-gray-600 flex-1 truncate">
                      {item.endpoint}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.calls}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-2">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/company/dashboard/api-keys"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <Key className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">Manage API Keys</span>
          </a>
          <a
            href="/company/dashboard/candidates"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <Users className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">Lookup Candidate</span>
          </a>
          <a
            href="/company/dashboard/docs"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">View API Docs</span>
          </a>
        </div>
      </div>
    </div>
  );
}
