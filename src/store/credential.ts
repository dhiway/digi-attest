import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod/v3';

// Zod schema for credentialPhoto
const credentialPhotoSchema = z.object({
  key: z.string().nullable().describe('key provided by s3 bucket'),
  photo: z
    .object({
      base64: z.string(),
      dataUrl: z.string(),
    })
    .nullable()
    .optional()
    .describe('dataurl photo captured'),
});

// Zod schema for credentialSchema
export const credentialSchemaSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  name: z.string().optional(),
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
    setKey: (state: Partial<Omit<CredentialPhoto, 'photo'>>) => void;
    setPhoto: (state: Partial<Omit<CredentialPhoto, 'key'>>) => void;
    clearCredentialPhoto: () => void;
  },
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      key: null,
      photo: null,
      setKey: (state) => set(state),
      setPhoto: (state) => set(state),
      clearCredentialPhoto: () => set({ key: null, photo: null }),
    }),
    {
      name: 'credential-photo-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCredentialSchemaStore = create<
  CredentialSchema & {
    setCredentialSchema: (state: Partial<CredentialSchema>) => void;
    clearCredentialSchema: () => void;
  },
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      id: null,
      name: '',
      url: '',
      body: {},
      new: false,
      setCredentialSchema: (state) => {
        const validation = credentialSchemaSchema.safeParse(state);
        if (validation.success) {
          set(state);
        } else {
          console.error(
            'Invalid state for credentialSchema:',
            validation.error
          );
        }
      },
      clearCredentialSchema: () =>
        set({
          id: null,
          name: '',
          url: '',
          body: {},
          new: false,
        }),
    }),
    {
      name: 'credential-schema-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

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

export const useCredentialStore = create<
  CredentialState,
  [['zustand/persist', unknown]]
>(
  persist(
    (set) => ({
      credential: null,
      setCredential: (credential) => set({ credential }),
      clearCredential: () => set({ credential: null }),
    }),
    {
      name: 'credential-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
