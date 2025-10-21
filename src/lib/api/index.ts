import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

export * from './auth';
export * from './credential';
export * from './schema';
export * from './profile';
