import { api } from '.';

import z from 'zod/v4';

export const getProfiles = async ({ orgId = '', page = 1, limit = 20 }) => {
  const res = await api.get(`/profile/${orgId}?page=${page}&limit=${limit}`);
  const data: z.infer<typeof FetchUserProfilesResponseSchema> = res.data;
  return data.data; // array of profiles
};

export const createProfile = async (
  profile: z.infer<typeof CreateUserProfileSchema>,
  orgId: string
) => {
  const res = await api.post(`/profile/${orgId}`, profile);
  const data: z.infer<typeof CreateUserProfileResponseSchema> = res.data;
  return data.data;
};

// Zod Schemas

export const profileTypeEnum = z.enum([
  'personal',
  'client',
  'holder',
  'attestor',
]);

export const GpsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const CreateUserProfileSchema = z.object({
  type: profileTypeEnum,
  orgId: z.uuid().optional(),
  holderId: z.uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  name: z.string().min(2, 'Name must be at least 2 characters long'),

  // Contact Info
  email: z.email().optional().nullable(),
  phoneNumber: z.string().array().optional().nullable().default(['']),
  website: z.url().array().optional().nullable().default(null),

  // Location Info
  address: z.string().min(5).max(200).optional().nullable(),
  city: z.string().min(2).max(100).optional().nullable(),
  state: z.string().min(2).max(100).optional().nullable(),
  country: z.string().min(2).max(100).optional().nullable(),
  pincode: z.string().optional().nullable(),
  gps: GpsSchema.optional().nullable(),
});

export type CreateUserProfileInput = z.infer<typeof CreateUserProfileSchema>;

export const UpdateProfileSchema = z.object({
  profileId: z.uuid(),
  type: profileTypeEnum.optional(),
  name: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),

  email: z.email().optional(),
  phoneNumber: z.string().array().optional(),
  website: z.string().array().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  gps: GpsSchema.optional(),
});

export const DeleteProfileSchema = z.object({
  profileId: z.uuid(),
});

// Pagination & Response Schemas
export const ProfilePaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: profileTypeEnum.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListProfileQuery = z.infer<typeof ProfilePaginationQuerySchema>;

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
});

export const profileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: profileTypeEnum,
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  userId: z.string(),
  orgId: z.string().nullable().optional(),
  holderUserId: z.string().nullable().optional(),

  email: z.email().optional().nullable(),
  phoneNumber: z.string().array().optional().nullable().default(['']),
  website: z.url().array().optional().nullable().default(null),

  address: z.string().min(5).max(200).optional().nullable(),
  city: z.string().min(2).max(100).optional().nullable(),
  state: z.string().min(2).max(100).optional().nullable(),
  country: z.string().min(2).max(100).optional().nullable(),
  pincode: z.string().optional().nullable(),
  gps: GpsSchema.optional().nullable(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UserProfile = z.infer<typeof profileSchema>;

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
  }),
});

export const UpdateUserProfileResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string(),
  data: z.object({
    profile: profileSchema,
  }),
});
