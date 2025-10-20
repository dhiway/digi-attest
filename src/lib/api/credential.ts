import { api } from '.';

interface credential {
  orgId: string;
  data: any;
}

export const createCredential = async (payload: credential) => {
  const res = await api.post('/credential/create', payload.data);
  return res.data.data.credential;
};

export const uploadCredentialImage = async (
  payload: credential
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

export const fetchCredentialImage = async (payload: credential) => {
  const res = await api.get(
    `/storage/credential/${payload.orgId}/${payload.data}`
  );
  return res.data.url;
};
