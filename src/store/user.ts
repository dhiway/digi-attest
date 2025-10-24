import type { UserProfile } from '@/lib/api';
import type { Organization } from '@/lib/api/organization/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface OrganizationState {
  organization: Organization | null;
  setActiveOrganization: (organization: Organization) => void;
  clearOrganization: () => void;
}

interface ProfileState {
  profile: UserProfile | null;
  setActiveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState, [['zustand/persist', unknown]]>(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useOrganizationStore = create<
  OrganizationState,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      organization: null,
      setActiveOrganization: (organization) => set({ organization }),
      clearOrganization: () => set({ organization: null }),
    }),
    {
      name: 'organization-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useProfileStore = create<
  ProfileState,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      profile: null,
      setActiveProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
