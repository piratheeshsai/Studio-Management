
export const ShootStatus = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ShootStatus = (typeof ShootStatus)[keyof typeof ShootStatus];

export const ShootItemStatus = {
  PENDING: 'PENDING',
  DESIGNING: 'DESIGNING',
  PRINTING: 'PRINTING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
} as const;

export type ShootItemStatus = (typeof ShootItemStatus)[keyof typeof ShootItemStatus];

export interface ShootItem {
  id: string;
  name: string;
  type: string;
  dimensions?: string;
  pages?: number;
  quantity: number;
  isIncluded: boolean;
  status: ShootItemStatus;
  description?: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string; // 'CASH' | 'BANK_TRANSFER' | 'UPI' etc
  note?: string;
}

export interface Shoot {
  id: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  category: string;
  packageName: string;
  finalPrice: number;
  description?: string;
  startDate?: string;
  status: ShootStatus;
  items: ShootItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
  // Computed on frontend sometimes, but good to have in type if used
  balance?: number; 
}

export interface CreateShootPayload {
  clientId: string;
  packageId: string;
  finalPrice: number;
  description?: string;
  startDate?: string;
}

