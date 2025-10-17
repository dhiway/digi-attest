import { api } from '.';

export const createCredential = async (payload: any) => {
  const res = await api.post('/credential/create', payload);
  return res.data.data.credential;
};
