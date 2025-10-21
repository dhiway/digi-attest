import { api } from '.';
import z from 'zod';

export const CreateCredentialRequestSchema = z.object({
  name: z.string().min(3),
  profileId: z.uuid(),
  orgId: z.uuid(),
  imageUrl: z.string().min(1),
  schemaId: z.uuid(),
  data: z.record(z.string(), z.any()),
});

export type Credential = z.infer<typeof CreateCredentialRequestSchema>;

interface params<T> {
  orgId: string;
  data: T;
}

export const createCredential = async (payload: params<Credential>) => {
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

export const fetchCredentialImage = async (payload: params<string>) => {
  const res = await api.get(
    `/storage/credential/${payload.orgId}/${payload.data}`
  );
  return res.data.url;
};
