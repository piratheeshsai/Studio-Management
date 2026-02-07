
export const ShootStatus = {
  BOOKED: 'BOOKED',
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
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
  // Event details
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
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
  shootCode: string; // e.g., "W-01", "CM-42", "BS-15"
  clientId: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  category: string;
  packageName: string;
  finalPrice: number;
  description?: string;
  eventDate?: string;
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
  eventDate?: string;
  items?: Partial<ShootItem>[];
}

