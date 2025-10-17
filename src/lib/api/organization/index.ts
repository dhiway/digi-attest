import { api } from '..';
import type { organization } from './types';

export const listOrganizations = async (): Promise<organization[]> => {
  const res = await api.get('/auth/organization/list', { timeout: 3000 });
  return res.data;
};
