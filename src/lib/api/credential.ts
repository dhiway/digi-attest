import { api } from '.';
import z from 'zod';
import { type Credential } from '@/store/credential';

export const CreateCredentialRequestSchema = z.object({
  name: z.string().min(3),
  profileId: z.uuid(),
  orgId: z.uuid(),
  imageUrl: z.string().min(1),
  schemaId: z.uuid(),
  data: z.record(z.string(), z.any()),
});

export type CredentialRequest = z.infer<typeof CreateCredentialRequestSchema>;

interface params<T> {
  orgId: string;
  data: T;
}

export const createCredential = async (payload: params<CredentialRequest>) => {
  const res = await api.post('/credential/create', payload.data);
  return res.data.data.credential;
};

export const uploadCredentialImage = async (
  payload: params<File>
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', payload.data);

  const res = await api.post(`storage/credential/${payload.orgId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data.key;
};

export const fetchCredentialImage = async (payload: {
  orgId: string;
  data: string;
}) => {
  const res = await api.get(`/storage/credential/${payload.orgId}`, {
    params: { key: payload.data },
  });
  console.log('url: ', res.data.data.url);
  return res.data.data.url;
};

interface ListCredentialsPayload {
  orgId: string;
  page: number;
  limit: number;
  profileId: string;
}

export const listCredentials = async (
  payload: ListCredentialsPayload
): Promise<Credential[]> => {
  const res = await api.get(
    `/credential/${payload.orgId}?page=${payload.page}&limit=${payload.limit}&profileId=${payload.profileId}`
  );
  return res.data.data;
};
