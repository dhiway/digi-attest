import { api } from '.';

export const getSession = async () => {
  const res = await api.get('/auth/get-session');
  return res.data;
};

export const signOut = async () => {
  const res = await api.post('/auth/sign-out');
  return res.data;
};

export const requestOtp = async (email: string) => {
  const res = await api.post('/auth/unified-otp/request', { email });
  return res.data;
};

export const verifyOtp = async (payload: {
  name?: string;
  email: string;
  otp: string;
  rememberMe?: boolean;
  createAdmin?: boolean;
}) => {
  const res = await api.post('/auth/unified-otp/verify', payload);
  return res.data;
};
