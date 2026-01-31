export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;

  internal_notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateClientData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
