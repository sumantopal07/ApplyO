'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { candidateApi } from '@/lib/api';
import {
  Shield,
  Check,
  X,
  Building2,
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Phone,
  Mail,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface ConsentRequest {
  companyName: string;
  companyLogo?: string;
  requestedFields: string[];
  purpose: string;
  expiresAt: string;
  jobTitle?: string;
}

function ConsentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consentRequest, setConsentRequest] = useState<ConsentRequest | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState<'approved' | 'denied' | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid consent link');
      setLoading(false);
      return;
    }

    fetchConsentRequest();
  }, [token]);

  const fetchConsentRequest = async () => {
    try {
      const response = await candidateApi.getConsentRequest(token!);
      const data = response.data.data;
      setConsentRequest(data);
      setSelectedFields(data.requestedFields);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid or expired consent link');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field to share');
      return;
    }

    setProcessing(true);
    try {
      await candidateApi.approveConsent(token!, selectedFields);
      setCompleted('approved');
      toast.success('Consent approved successfully');
    } catch (error) {
      toast.error('Failed to approve consent');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async () => {
    setProcessing(true);
    try {
      await candidateApi.denyConsent(token!);
      setCompleted('denied');
      toast.success('Consent denied');
    } catch (error) {
      toast.error('Failed to deny consent');
    } finally {
      setProcessing(false);
    }
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const fieldInfo: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
    fullName: {
      label: 'Full Name',
      icon: <User className="w-5 h-5" />,
      description: 'Your complete name',
    },
    email: {
      label: 'Email Address',
      icon: <Mail className="w-5 h-5" />,
      description: 'Your email for contact',
    },
    phone: {
      label: 'Phone Number',
      icon: <Phone className="w-5 h-5" />,
      description: 'Your phone for contact',
    },
    location: {
      label: 'Location',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Your city/country',
    },
    headline: {
      label: 'Professional Headline',
      icon: <FileText className="w-5 h-5" />,
      description: 'Your professional summary',
    },
    about: {
      label: 'About',
      icon: <FileText className="w-5 h-5" />,
      description: 'Your detailed biography',
    },
    education: {
      label: 'Education',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Your educational background',
    },
    experience: {
      label: 'Work Experience',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Your employment history',
    },
    skills: {
      label: 'Skills',
      icon: <Code className="w-5 h-5" />,
      description: 'Your skills and expertise',
    },
    documents: {
      label: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      description: 'Resume and other documents',
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600">Loading consent request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Invalid Request</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary mt-6"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card p-8 max-w-md text-center">
          {completed === 'approved' ? (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Consent Approved
              </h2>
              <p className="mt-2 text-gray-600">
                Your profile information has been shared with {consentRequest?.companyName}.
                They can now access the selected fields.
              </p>
            </>
          ) : (
            <>
              <X className="w-12 h-12 mx-auto text-gray-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Consent Denied
              </h2>
              <p className="mt-2 text-gray-600">
                {consentRequest?.companyName} will not be able to access your profile
                information.
              </p>
            </>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary mt-6"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto text-primary-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Data Access Request
          </h1>
          <p className="mt-2 text-gray-600">
            Review and approve what information to share
          </p>
        </div>

        {/* Company Info Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {consentRequest?.companyLogo ? (
                <img
                  src={consentRequest.companyLogo}
                  alt={consentRequest.companyName}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {consentRequest?.companyName}
              </h2>
              {consentRequest?.jobTitle && (
                <p className="text-gray-600">For: {consentRequest.jobTitle}</p>
              )}
            </div>
          </div>

          {consentRequest?.purpose && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Purpose:</strong> {consentRequest.purpose}
              </p>
            </div>
          )}
        </div>

        {/* Data Fields */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Select information to share
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose which parts of your profile you want to share with this company.
          </p>

          <div className="space-y-3">
            {consentRequest?.requestedFields.map((field) => {
              const info = fieldInfo[field] || {
                label: field,
                icon: <FileText className="w-5 h-5" />,
                description: '',
              };
              const isSelected = selectedFields.includes(field);

              return (
                <button
                  key={field}
                  onClick={() => toggleField(field)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left flex items-center space-x-4 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{info.label}</p>
                    {info.description && (
                      <p className="text-sm text-gray-500">{info.description}</p>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="card p-4 mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Privacy Notice</p>
              <p className="mt-1">
                By approving, you allow {consentRequest?.companyName} to access the
                selected information. You can revoke access anytime from your
                dashboard settings.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDeny}
            disabled={processing}
            className="flex-1 btn-secondary flex items-center justify-center"
          >
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            Deny Access
          </button>
          <button
            onClick={handleApprove}
            disabled={processing || selectedFields.length === 0}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Approve ({selectedFields.length} fields)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConsentContent />
    </Suspense>
  );
}
