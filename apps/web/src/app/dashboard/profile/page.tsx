'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useProfileStore } from '@/store/profile';
import { candidateApi } from '@/lib/api';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Plus,
  Trash2,
  Loader2,
  X,
  Save,
} from 'lucide-react';
import { calculateProfileCompletion, formatDate } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  headline: z.string().max(500).optional(),
  location: z.string().optional(),
  about: z.string().max(5000).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { profile, setProfile, updateProfile } = useProfileStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      headline: profile?.headline || '',
      location: profile?.location || '',
      about: profile?.about || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      await candidateApi.updateProfile(data);
      updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await candidateApi.deleteEducation(id);
      updateProfile({
        education: profile?.education?.filter((e: any) => e.id !== id) || [],
      });
      toast.success('Education entry deleted');
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await candidateApi.deleteExperience(id);
      updateProfile({
        experience: profile?.experience?.filter((e: any) => e.id !== id) || [],
      });
      toast.success('Experience entry deleted');
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await candidateApi.deleteSkill(id);
      updateProfile({
        skills: profile?.skills?.filter((s: any) => s.id !== id) || [],
      });
      toast.success('Skill deleted');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const profileCompletion = profile ? calculateProfileCompletion(profile) : 0;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Completion */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
          <span className="text-2xl font-bold text-primary-600">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="label">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    id="fullName"
                    className="input mt-1"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="label">
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="input mt-1"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="headline" className="label">
                    Headline
                  </label>
                  <input
                    {...register('headline')}
                    type="text"
                    id="headline"
                    className="input mt-1"
                    placeholder="e.g., Senior Product Manager | Ex-Google"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="label">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    id="location"
                    className="input mt-1"
                    placeholder="e.g., Bangalore, India"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="about" className="label">
                    About
                  </label>
                  <textarea
                    {...register('about')}
                    id="about"
                    rows={4}
                    className="input mt-1"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isDirty || saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-4 fade-in-up">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Education History</h3>
                <button
                  onClick={() => setShowEducationModal(true)}
                  className="btn-primary flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </button>
              </div>

              {profile?.education?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No education entries yet. Add your educational background.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile?.education?.map((edu: any) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-4 fade-in-up">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Work Experience</h3>
                <button
                  onClick={() => setShowExperienceModal(true)}
                  className="btn-primary flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Experience
                </button>
              </div>

              {profile?.experience?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No experience entries yet. Add your work history.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile?.experience?.map((exp: any) => (
                    <div key={exp.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{exp.role}</h4>
                          <p className="text-gray-600">{exp.companyName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4 fade-in-up">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Skills</h3>
                <button
                  onClick={() => setShowSkillModal(true)}
                  className="btn-primary flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skills
                </button>
              </div>

              {profile?.skills?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No skills added yet. Add your key skills.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill: any, index: number) => (
                    <span
                      key={skill.id || index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700"
                    >
                      {typeof skill === 'string' ? skill : skill.skill}
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Education Modal */}
      {showEducationModal && (
        <EducationModal
          onClose={() => setShowEducationModal(false)}
          onAdd={(edu) => {
            updateProfile({
              education: [...(profile?.education || []), edu],
            });
          }}
        />
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <ExperienceModal
          onClose={() => setShowExperienceModal(false)}
          onAdd={(exp) => {
            updateProfile({
              experience: [...(profile?.experience || []), exp],
            });
          }}
        />
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <SkillModal
          onClose={() => setShowSkillModal(false)}
          onAdd={(skills) => {
            // skills is the full updated skills array from the API response
            updateProfile({ skills });
          }}
        />
      )}
    </div>
  );
}

// Education Modal Component
function EducationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (edu: any) => void;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const response = await candidateApi.addEducation({
        degree: data.degree,
        institution: data.institution,
        startYear: parseInt(data.startYear),
        endYear: data.endYear ? parseInt(data.endYear) : undefined,
      });
      onAdd(response.data.data);
      toast.success('Education added');
      onClose();
    } catch (error) {
      toast.error('Failed to add education');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Education</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Degree *</label>
            <input {...register('degree', { required: true })} className="input mt-1" />
          </div>
          <div>
            <label className="label">Institution *</label>
            <input {...register('institution', { required: true })} className="input mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Year *</label>
              <input {...register('startYear', { required: true })} type="number" className="input mt-1" />
            </div>
            <div>
              <label className="label">End Year</label>
              <input {...register('endYear')} type="number" className="input mt-1" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Education'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Experience Modal Component
function ExperienceModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (exp: any) => void;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const response = await candidateApi.addExperience({
        companyName: data.companyName,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        description: data.description,
      });
      onAdd(response.data.data);
      toast.success('Experience added');
      onClose();
    } catch (error) {
      toast.error('Failed to add experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Experience</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Company Name *</label>
            <input {...register('companyName', { required: true })} className="input mt-1" />
          </div>
          <div>
            <label className="label">Role *</label>
            <input {...register('role', { required: true })} className="input mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date *</label>
              <input {...register('startDate', { required: true })} type="date" className="input mt-1" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input {...register('endDate')} type="date" className="input mt-1" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea {...register('description')} rows={3} className="input mt-1" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Skill Modal Component
function SkillModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (skills: any[]) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleAdd = async () => {
    const skills = skillInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skills.length === 0) {
      toast.error('Please enter at least one skill');
      return;
    }

    setSaving(true);
    try {
      const response = await candidateApi.addSkills(skills);
      // response.data.data is the full profile, extract skills array
      onAdd(response.data.data.skills || []);
      toast.success('Skills added');
      onClose();
    } catch (error) {
      toast.error('Failed to add skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Skills</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Skills (comma separated)</label>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="input mt-1"
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter multiple skills separated by commas
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Skills'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
