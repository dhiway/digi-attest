import { api } from '.';

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
