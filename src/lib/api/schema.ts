import { api } from '.';

export const getSchemas = async (): Promise<CreateSchemaResponse[]> => {
  const res = await api.get('/schema/list');
  return res.data.data; // array of schemas
};

export const createSchema = async (schema: UserSchema) => {
  const res = await api.post('/schema/create', { schema });
  return res.data.data.schema;
};

export interface UserSchema {
  name: string;
  description: string;
  version: string;
  body?: object;
  url?: string;
}

export type CreateSchemaResponse = {
  /* statusCode: number;
  message: string;
  data: { */
  /* schema: { */
  id: string;
  name: string;
  orgId: string | null;
  url: string | null;
  hash: string;
  body: any;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  /* }; */
  /* global: boolean; */
  /* }; */
};
