import axios from 'axios';

export const BASE_URL = 'https://digi-attest.demo.dhiway.net/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

export * from './auth';
export * from './credential';
export * from './schema';
export * from './profile';
