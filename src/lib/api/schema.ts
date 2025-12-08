import { api } from '.';

export const getSchemas = async (): Promise<CreateSchemaResponse[]> => {
  const res = await api.get('/schema/list');
 // console.log("The schemas are ",res.data.data)
  return res.data.data; // array of schemas
};

export const createSchema = async (schema: UserSchema) => {
  const res = await api.post('/schema/create', { schema });
  console.log("the response of schema is :", res.data.data.isNew);
  return res.data;
};

export interface UserSchema {
  name: string;
  description: string;
  version: string;
  body?: object;
  url?: string;
}

export type CreateSchemaResponse = {
  id: string | null | undefined;
  name: string | undefined;
  url: string;
  body: any;
  statusCode: number;
  message: string;
  data: {
    schema: {
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

    };
    global: boolean;
    alreadyExists: boolean;
    isNew: boolean;
  };
};
