export type ClientSegment = 'vip' | 'frequent' | 'new';

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  segment: ClientSegment;
  joinedAt: string; // ISO date string
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
