import { create } from 'zustand';
import { z } from 'zod/v3';

// Zod schema for credentialPhoto
const credentialPhotoSchema = z.object({
  url: z.string().url().nullable(),
});

// Zod schema for credentialSchema
export const credentialSchemaSchema = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  body: z.any(), // JSON type can be any JS object
  new: z.boolean().default(false).optional(),
});

// Zustand store type definitions
type CredentialPhoto = z.infer<typeof credentialPhotoSchema>;
type CredentialSchema = z.infer<typeof credentialSchemaSchema>;

// Zustand stores

export const useCredentialPhotoStore = create<
  CredentialPhoto & {
    setUrl: (state: Partial<CredentialPhoto>) => void;
  }
>((set) => ({
  url: null,
  setUrl: (state) => {
    /* const validation = credentialPhotoSchema.safeParse(state);
    if (validation.success) { */
    set(state);
    /* } else {
      console.error('Invalid URL for credentialPhoto:', validation.error);
    } */
  },
}));

export const useCredentialSchemaStore = create<
  CredentialSchema & {
    setCredentialSchema: (state: Partial<CredentialSchema>) => void;
  }
>((set) => ({
  name: '',
  url: undefined,
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
