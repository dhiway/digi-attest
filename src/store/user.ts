import type { UserProfile } from '@/lib/api';
import type { Organization } from '@/lib/api/organization/types';
import { create } from 'zustand';

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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organization: null,
  setActiveOrganization: (organization) => set({ organization }),
  clearOrganization: () => set({ organization: null }),
}));

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setActiveProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
