import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface SignupData {
  username: string;
  email: string;
  phone: string;
}

interface ApiPayload {
  age: number;
  gender: string;
  aadhaar_no: string | null;
  phone: string;
  address: string;
  city: string;
  district: string;
  state: string;
  field: string;
  current_occupation: string;
  designation: string;
  experience: string;
  workplace: string;
  duration: string;
  portfolio_link: string | null;
  social_media_link: string | null;
}

interface MentorData {
  id: number;
  user_id: number;
  age: number;
  gender: string;
  aadhaar_no: string | null;
  address: string;
  city: string;
  district: string;
  state: string;
  field: string;
  experience: string;
  current_occupation: string;
  designation: string;
  workplace: string;
  duration: string;
  portfolio_link: string | null;
  social_media_link: string | null;
  status: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

interface UserData {
  id: number;
  name: string;
  status: string;
  type: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  signupData: SignupData | null;
  apiPayload: Partial<ApiPayload> | null;
  mentorData: MentorData | null;
  userData: UserData | null;
  userToken: string | null;
  hydrated: boolean;
  setSignupData: (data: SignupData) => void;
  setApiPayload: (data: Partial<ApiPayload>) => void;
  setMentorData: (data: MentorData) => void;
  setUserData: (data: UserData) => void;
  setUserToken: (token: string | null) => void;
  reset: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      signupData: null,
      apiPayload: null,
      mentorData: null,
      userData: null,
      userToken: null,
      hydrated: false,
      setSignupData: (data: SignupData) => set({ signupData: data }),
      setApiPayload: (data: Partial<ApiPayload>) =>
        set((state) => ({
          apiPayload: {
            ...(state.apiPayload ?? {}),
            ...data,
          },
        })),
      setMentorData: (data: MentorData) => set({ mentorData: data }),
      setUserData: (data: UserData) => set({ userData: data }),
      setUserToken: (token: string | null) => {
        set({ userToken: token });

        // Sync with cookies for middleware access
        if (token) {
          setCookie("userToken", token, 10); // Expire in 10 days
        } else {
          deleteCookie("userToken");
        }
      },

      reset: () => {
        set({
          signupData: null,
          apiPayload: null,
          mentorData: null,
          userToken: null,
        });
        // Also clear the cookie
        deleteCookie("userToken");
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.userToken) {
          setCookie("userToken", state.userToken, 7);
        }
        state?.setHydrated();
      },
    }
  )
);
