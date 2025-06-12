import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define type interfaces
interface PersonalInfo {
  age: string;
  gender: string;
  aadhaar: string;
  state: string;
  district: string;
  city: string;
  address: string;
}

interface ProfessionalInfo {
  expertise: string;
  experience: string;
  occupation: string;
  institute: string;
  designation: string;
  duration: string;
  portfolio: string;
  social: string;
}

export interface FormState {
  token: string | null;
  phone: string | null;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  userToken: string | null;
  mentorData: unknown | null;  // Replace 'any' with specific MentorData type if available
  
  // Action methods
  setSignupData: (data: { token: string; phone: string }) => void;
  setPersonalInfo: (data: PersonalInfo) => void;
  setProfessionalInfo: (data: ProfessionalInfo) => void;
  setMentorData: (data: unknown) => void;  // Replace 'any' with specific type
  setUserToken: (token: string) => void;
  reset: () => void;
  logout: () => void;
}

// Create store with TypeScript types
export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      // Initial state with proper typing
      token: null,
      phone: null,
      userToken: null,
      mentorData: null,

      personalInfo: {
        age: '',
        gender: '',
        aadhaar: '',
        state: '',
        district: '',
        city: '',
        address: '',
      },

      professionalInfo: {
        expertise: '',
        experience: '',
        occupation: '',
        institute: '',
        designation: '',
        duration: '',
        portfolio: '',
        social: '',
      },

      // Typed actions
      setSignupData: (data) => set({ token: data.token, phone: data.phone }),
      setPersonalInfo: (data) => set({ personalInfo: data }),
      setProfessionalInfo: (data) => set({ professionalInfo: data }),
      setMentorData: (data) => set({ mentorData: data }),
      setUserToken: (token) => set({ userToken: token }),

      reset: () => 
        set({
          token: null,
          phone: null,
          personalInfo: {
            age: '',
            gender: '',
            aadhaar: '',
            state: '',
            district: '',
            city: '',
            address: '',
          },
          professionalInfo: {
            expertise: '',
            experience: '',
            occupation: '',
            institute: '',
            designation: '',
            duration: '',
            portfolio: '',
            social: '',
          },
        }),

      logout: () => 
        set({
          userToken: null,
          mentorData: null,
        }),
    }),
    {
      name: 'form-storage',
      storage: createJSONStorage(() => localStorage), // Explicit storage type
      partialize: (state) => ({
        token: state.token,
        userToken: state.userToken,
        mentorData: state.mentorData
      }),
    }
  )
);

// Helper function to get token outside of components
export const getToken = () => useFormStore.getState().userToken;