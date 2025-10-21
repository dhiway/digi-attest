import { api } from '..';
import type { Organization } from './types';

export const listOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get('/auth/organization/list');
  return res.data;
};

export const createOrganization = async (payload: {
  name: string;
  slug: string;
}): Promise<Organization> => {
  const res = await api.post('/auth/organization/create', payload);
  return res.data;
};
