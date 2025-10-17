import { api } from '.';

import z from 'zod/v4';

export const getProfiles = async ({ page = 1, limit = 20 }) => {
  const res = await api.get(`/profile?page=${page}&limit=${limit}`);
  const data: z.infer<typeof FetchUserProfilesResponseSchema> = res.data;
  return data.data; // array of profiles
};

export const createProfile = async (
  profile: z.infer<typeof CreateUserProfileSchema>
) => {
  const res = await api.post('/profile', profile);
  const data: z.infer<typeof CreateUserProfileResponseSchema> = res.data;
  return data.data;
};

export const profileTypeEnum = z.enum([
  'personal',
  'client',
  'holder',
  'attestor',
]);

// Zod Schemas

export const GpsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const LocationInputSchema = z.object({
  tag: z.string(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters')
    .optional(),
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State cannot exceed 100 characters')
    .optional(),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country cannot exceed 100 characters')
    .optional(),
  pincode: z.string().optional(),
  gps: GpsSchema.optional(),
});

export const ContactInputSchema = z.object({
  tag: z.string(),
  email: z.email().optional(),
  phoneNumber: z.string().array(),
  website: z.url().array().optional(),
});

// profile requests
export const CreateUserProfileSchema = z.object({
  type: profileTypeEnum,
  orgId: z.uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  holderId: z.uuid().optional(),
  location: LocationInputSchema.optional(),
  locationId: z.uuid().optional(),
  locationTag: z.string().optional(),
  contact: ContactInputSchema.optional(),
  contactId: z.uuid().optional(),
  contactTag: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  profileId: z.uuid(),
  type: profileTypeEnum.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const DeleteProfileSchema = z.object({
  profileId: z.uuid(),
});

// location requests
export const UpdateLocationSchema = LocationInputSchema.extend({
  id: z.uuid(),
});

export const DeleteLocationSchema = z.object({
  id: z.uuid(),
});

// contact requests
export const UpdateContactSchema = ContactInputSchema.extend({
  id: z.uuid(),
});

export const DeleteContactSchema = z.object({
  id: z.uuid(),
});

export const ProfilePaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  tag: z.string().optional(),
  type: profileTypeEnum.optional(), // only for profiles
  sortBy: z.enum(['createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
});

export const locationSchema = z.object({
  id: z.uuid(),
  tag: z.string(),
  userId: z.string(),
  address: z.string(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  gps: GpsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const contactSchema = z.object({
  id: z.uuid(),
  tag: z.string(),
  userId: z.string(),
  email: z.email().nullable().optional(),
  phoneNumber: z.string().array(),
  website: z.url().array().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const profileSchema = z.object({
  id: z.uuid(),
  type: profileTypeEnum,
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orgId: z.uuid().optional().nullable(),
  holderUserId: z.uuid().optional().nullable(),
});

export const FetchUserProfilesResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: profileSchema.array(),
});

export const CreateUserProfileResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: z.object({
    profile: profileSchema,
    locationId: z.uuid().optional().nullable(),
    contactId: z.uuid().optional().nullable(),
  }),
});

export const FetchUserContactsResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: contactSchema.array(),
});

export const CreateContactResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: z.object({
    id: z.uuid(),
  }),
});

export const FetchUserLocationsResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: locationSchema.array(),
});

export const CreateLocationResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: z.object({
    id: z.uuid(),
  }),
});
