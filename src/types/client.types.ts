export type ClientSegment = 'vip' | 'frequent' | 'new';

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  totalOrders: number;
  totalSpent: number;
  segment: ClientSegment;
  joinedAt: string; // ISO date string
  isActive: boolean;
};

export type ClientMetricItem = {
  label: string;
  value: string;
  subValue?: string;
  trendUp?: boolean;
  icon: 'trend' | 'star' | 'ticket' | 'smile';
};

export type ClientSegmentSummary = {
  segment: ClientSegment;
  label: string;
  criteria: string;
  count: number;
};

export type EditClientFormFields = {
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
};

export type UpdateClientPayload = {
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
};

// Shape returned by PATCH /users/:id
export type UpdateClientResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
};
