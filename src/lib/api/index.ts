import axios from 'axios';

export const BASE_URL = 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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

export const getSchemas = async () => {
  const res = await api.get('/schema/list');
  return res.data.data; // array of schemas
};

export const createSchema = async (schema: {
  name: string;
  description: string;
  version: string;
  body?: object;
  url?: string;
}) => {
  const res = await api.post('/schema/create', { schema });
  return res.data.data.schema;
};
