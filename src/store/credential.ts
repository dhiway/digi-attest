import { create } from 'zustand';
import { z } from 'zod/v3';

// Zod schema for credentialPhoto
const credentialPhotoSchema = z.object({
  key: z.string().nullable().describe('key provided by s3 bucket'),
});

// Zod schema for credentialSchema
export const credentialSchemaSchema = z.object({
  name: z.string().min(3),
  url: z.string().url().or(z.string()).default('').optional(),
  body: z.any().optional(),
  new: z.boolean().default(false).optional(),
});

// Zustand store type definitions
type CredentialPhoto = z.infer<typeof credentialPhotoSchema>;
type CredentialSchema = z.infer<typeof credentialSchemaSchema>;

// Zustand stores

export const useCredentialPhotoStore = create<
  CredentialPhoto & {
    setKey: (state: Partial<CredentialPhoto>) => void;
  }
>((set) => ({
  key: null,
  setKey: (state) => {
    set(state);
  },
}));

export const useCredentialSchemaStore = create<
  CredentialSchema & {
    setCredentialSchema: (state: Partial<CredentialSchema>) => void;
  }
>((set) => ({
  name: '',
  url: '',
  body: {},
  new: false,
  setCredentialSchema: (state) => {
    const validation = credentialSchemaSchema.safeParse(state);
    if (validation.success) {
      set(state);
    } else {
      console.error('Invalid state for credentialSchema:', validation.error);
    }
  },
}));

export interface Credential {
  id: string;
  name: string;
  userId: string;
  profileId: string | null;
  orgId: string | null;
  imageUrl: string;
  schemaId: string;
  data: Record<string, any>;
  imageHash: string;
  dataHash: string;
  createdAt: string;
  updatedAt: string;
}

interface CredentialState {
  credential: Credential | null;
  setCredential: (credential: Credential) => void;
  clearCredential: () => void;
}

export const useCredentialStore = create<CredentialState>((set) => ({
  credential: null,
  setCredential: (credential) => set({ credential }),
  clearCredential: () => set({ credential: null }),
}));
