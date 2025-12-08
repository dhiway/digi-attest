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

export const DraftCredentialRequestSchema = z.object({
  name: z.string().min(3),
  profileId: z.uuid(),
  orgId: z.uuid(),
  imageUrl: z.string().min(1),
  schemaId: z.uuid(),
  data: z.record(z.string(), z.any()),
});

export type DraftRequest = z.infer<typeof DraftCredentialRequestSchema>

interface params<T> {
  orgId: string;
  data: T;
}

export const createCredential = async (payload: params<CredentialRequest>) => {
  console.log("The sedning data is : ",payload.data)
  const res = await api.post(`/credential/${'active'}`, payload.data);
  return res.data.data.credential;
};

export const draftCredential = async (payload: params<DraftRequest>) => {
  console.log("sending req to draft")
  console.log(payload)
  const res = await api.post(`/credential/${'draft'}`, payload.data)
  console.log("The response is ", res.data)
  return res.data.data.credential;
}

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
  console.log("The response data of uploadCredentialImage is :", res.data)
  return res.data.data.key;
};

export const fetchCredentialImage = async (payload: {
  orgId: string;
  data: string;
}) => {
  const res = await api.get(`/storage/credential/${payload.orgId}`, {
    params: { key: payload.data },
  });
  console.log("credential image response:  ", res.data)
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
 console.log("the credential list",res.data)
  return res.data.data;
};
