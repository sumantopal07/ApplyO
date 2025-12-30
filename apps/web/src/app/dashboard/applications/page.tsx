'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { applicationApi } from '@/lib/api';
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  MoreVertical,
  Loader2,
  X,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  salary?: string;
  status: string;
  appliedAt: string;
  notes?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationApi.getAll();
      setApplications(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ];

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offer: applications.filter((a) => a.status === 'offer').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
          <div className="text-sm text-gray-600">Applied</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.interview}</div>
          <div className="text-sm text-gray-600">Interview</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.offer}</div>
          <div className="text-sm text-gray-600">Offers</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Building2 className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all'
                ? 'No applications match your filters'
                : 'No applications yet. Start tracking your job search!'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary mt-4"
              >
                Add Your First Application
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedApp(app);
                      setShowDetailModal(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{app.companyName}</div>
                        <div className="text-sm text-gray-600">{app.jobTitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {app.location || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdd={(app) => {
            setApplications([app, ...applications]);
          }}
        />
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedApp(null);
          }}
          onUpdate={(updatedApp) => {
            setApplications(
              applications.map((a) => (a.id === updatedApp.id ? updatedApp : a))
            );
            setSelectedApp(updatedApp);
          }}
          onDelete={(id) => {
            setApplications(applications.filter((a) => a.id !== id));
            setShowDetailModal(false);
            setSelectedApp(null);
          }}
        />
      )}
    </div>
  );
}

// Add Application Modal
function AddApplicationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (app: Application) => void;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationForm) => {
    setSaving(true);
    try {
      const response = await applicationApi.create({
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobUrl: data.jobUrl || undefined,
        location: data.location,
        salary: data.salary,
        notes: data.notes,
      });
      onAdd(response.data.data);
      toast.success('Application added');
      onClose();
    } catch (error) {
      toast.error('Failed to add application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Add New Application</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Company Name *</label>
            <input
              {...register('companyName')}
              className="input mt-1"
              placeholder="e.g., Google"
            />
            {errors.companyName && (
              <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label className="label">Job Title *</label>
            <input
              {...register('jobTitle')}
              className="input mt-1"
              placeholder="e.g., Senior Software Engineer"
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-600 mt-1">{errors.jobTitle.message}</p>
            )}
          </div>

          <div>
            <label className="label">Job URL</label>
            <input
              {...register('jobUrl')}
              className="input mt-1"
              placeholder="https://..."
            />
            {errors.jobUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.jobUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input
                {...register('location')}
                className="input mt-1"
                placeholder="e.g., Remote"
              />
            </div>
            <div>
              <label className="label">Salary</label>
              <input
                {...register('salary')}
                className="input mt-1"
                placeholder="e.g., $150k"
              />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes')}
              className="input mt-1"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Application Detail Modal
function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
  onDelete,
}: {
  application: Application;
  onClose: () => void;
  onUpdate: (app: Application) => void;
  onDelete: (id: string) => void;
}) {
  const [status, setStatus] = useState(application.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await applicationApi.updateStatus(application.id, newStatus);
      setStatus(newStatus);
      onUpdate({ ...application, status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    setDeleting(true);
    try {
      await applicationApi.delete(application.id);
      onDelete(application.id);
      toast.success('Application deleted');
    } catch (error) {
      toast.error('Failed to delete application');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {application.companyName}
            </h3>
            <p className="text-gray-600">{application.jobTitle}</p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="input flex-1"
            >
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Applied: {formatDate(application.appliedAt)}</span>
            </div>
            {application.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{application.location}</span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{application.salary}</span>
              </div>
            )}
          </div>

          {application.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {application.notes}
              </p>
            </div>
          )}

          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Job Posting
            </a>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 flex items-center"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete Application
            </button>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
