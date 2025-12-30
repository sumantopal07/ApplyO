import { create } from 'zustand';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  headline?: string;
  location?: string;
  about?: string;
  preferredRoles?: string[];
  education: any[];
  experience: any[];
  skills: string[];
  documents: any[];
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  setProfile: (profile) => set({ profile, error: null }),
  
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
    
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({ profile: null, isLoading: false, error: null }),
}));
