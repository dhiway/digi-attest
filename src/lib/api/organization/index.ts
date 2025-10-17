import { api } from '..';
import type { Organization } from './types';

export const listOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get('/auth/organization/list', { timeout: 3000 });
  return res.data;
};
