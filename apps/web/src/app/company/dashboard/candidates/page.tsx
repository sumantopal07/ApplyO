'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { companyApi } from '@/lib/api';
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Loader2,
  AlertCircle,
  Send,
  Check,
  X,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  headline?: string;
  location?: string;
  about?: string;
  education?: Array<{
    degree: string;
    institution: string;
    startYear: number;
    endYear?: number;
  }>;
  experience?: Array<{
    companyName: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: string[];
  consentStatus: 'granted' | 'pending' | 'denied' | 'none';
}

export default function CandidatesPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CandidateProfile | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [requestingConsent, setRequestingConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'fullName',
    'email',
    'phone',
    'education',
    'experience',
    'skills',
  ]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const response = await companyApi.lookupCandidate(searchEmail);
      setSearchResult(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSearchError('No candidate found with this email address');
      } else if (error.response?.status === 403) {
        setSearchError('You do not have consent to view this candidate\'s profile');
        setSearchResult({
          id: error.response.data.candidateId,
          fullName: 'Consent Required',
          email: searchEmail,
          consentStatus: 'none',
        });
      } else {
        setSearchError('Failed to search for candidate');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleRequestConsent = async () => {
    if (!searchResult) return;

    setRequestingConsent(true);
    try {
      await companyApi.requestConsent({
        candidateEmail: searchEmail,
        requestedFields: selectedFields,
        purpose: 'Job application review',
      });
      toast.success('Consent request sent to candidate');
      setSearchResult({
        ...searchResult,
        consentStatus: 'pending',
      });
      setShowConsentModal(false);
    } catch (error) {
      toast.error('Failed to send consent request');
    } finally {
      setRequestingConsent(false);
    }
  };

  const availableFields = [
    { id: 'fullName', label: 'Full Name', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'headline', label: 'Headline', icon: FileText },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidate Lookup</h1>
        <p className="text-gray-600">Search and view candidate profiles with consent</p>
      </div>

      {/* Search Box */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter candidate email address..."
              className="input pl-10"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="btn-primary flex items-center justify-center sm:w-32"
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Error */}
      {searchError && !searchResult && (
        <div className="card p-6 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{searchError}</p>
          </div>
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="card">
          {/* Consent Status Banner */}
          {searchResult.consentStatus !== 'granted' && (
            <div
              className={`p-4 border-b ${
                searchResult.consentStatus === 'pending'
                  ? 'bg-yellow-50 border-yellow-200'
                  : searchResult.consentStatus === 'denied'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {searchResult.consentStatus === 'pending' ? (
                    <>
                      <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                      <span className="text-yellow-800">
                        Consent request pending - waiting for candidate approval
                      </span>
                    </>
                  ) : searchResult.consentStatus === 'denied' ? (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span className="text-red-800">
                        Candidate denied access to their profile
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800">
                        You need consent to view this candidate&apos;s full profile
                      </span>
                    </>
                  )}
                </div>
                {searchResult.consentStatus === 'none' && (
                  <button
                    onClick={() => setShowConsentModal(true)}
                    className="btn-primary text-sm flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Request Consent
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            {searchResult.consentStatus === 'granted' ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {searchResult.fullName}
                    </h2>
                    {searchResult.headline && (
                      <p className="text-gray-600">{searchResult.headline}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {searchResult.email}
                      </span>
                      {searchResult.phone && (
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {searchResult.phone}
                        </span>
                      )}
                      {searchResult.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {searchResult.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* About */}
                {searchResult.about && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600">{searchResult.about}</p>
                  </div>
                )}

                {/* Experience */}
                {searchResult.experience && searchResult.experience.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Experience
                    </h3>
                    <div className="space-y-4">
                      {searchResult.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary-200 pl-4">
                          <h4 className="font-medium text-gray-900">{exp.role}</h4>
                          <p className="text-gray-600">{exp.companyName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {searchResult.education && searchResult.education.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      {searchResult.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary-200 pl-4">
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {searchResult.skills && searchResult.skills.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-16 h-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Profile Locked
                </h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  {searchResult.consentStatus === 'pending'
                    ? 'The candidate has been notified. You\'ll be able to view their profile once they approve your request.'
                    : searchResult.consentStatus === 'denied'
                    ? 'The candidate has denied your request to view their profile.'
                    : 'Request consent from the candidate to view their complete profile.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!searchResult && !searchError && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Enter the candidate&apos;s email address to search for their profile</li>
            <li>If they have an ApplyO account, you can request access to their data</li>
            <li>The candidate will receive a notification to approve or deny your request</li>
            <li>Once approved, you&apos;ll be able to view the fields they consented to share</li>
          </ol>
        </div>
      )}

      {/* Consent Request Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Candidate Consent
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select which profile fields you would like to request access to:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFields([...selectedFields, field.id]);
                      } else {
                        setSelectedFields(selectedFields.filter((f) => f !== field.id));
                      }
                    }}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300"
                  />
                  <field.icon className="w-4 h-4 ml-3 mr-2 text-gray-400" />
                  <span className="text-gray-900">{field.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestConsent}
                disabled={requestingConsent || selectedFields.length === 0}
                className="btn-primary flex items-center"
              >
                {requestingConsent ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
