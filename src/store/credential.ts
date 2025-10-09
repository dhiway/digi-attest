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

export const useCredentialPhotoStore = create<CredentialPhoto>((set) => ({
  url: null,
  setUrl: (url: string | null) => {
    const validation = credentialPhotoSchema.safeParse({ url });
    if (validation.success) {
      set({ url });
    } else {
      console.error('Invalid URL for credentialPhoto:', validation.error);
    }
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
