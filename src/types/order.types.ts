// ─────────────────────────────────────────────
//  ENUMS  (espejo de Prisma)
// ─────────────────────────────────────────────

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'PICKED_UP'
  | 'CANCELLED'
  | 'COMPLETED';

// ─────────────────────────────────────────────
//  ADDRESS  (snapshot embebido en la orden)
// ─────────────────────────────────────────────

export interface OrderAddress {
  id: string;
  label: string;
  direction: string;
  departament: string;
  reference: string | null;
  contact: string | null;
  latitude: string;   // Decimal viene como string desde JSON
  longitude: string;
}

// ─────────────────────────────────────────────
//  ORDER ITEM  (detalle de la orden)
// ─────────────────────────────────────────────

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: string;  // Decimal viene como string desde JSON
  subtotal: string;
}

// ─────────────────────────────────────────────
//  ORDER  (cabecera completa)
// ─────────────────────────────────────────────

export interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string | null;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: string;
  deliveryFee: string;
  total: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // Relaciones opcionales (dependiendo del endpoint)
  user?: OrderUser;
  address?: OrderAddress | null;
  items?: OrderItem[];
}

// ─────────────────────────────────────────────
//  DTOs  (lo que se envía al backend)
// ─────────────────────────────────────────────

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export type PaymentMethod = 'QR' | 'CASH' | 'CARD';

export interface CreateOrderDto {
  orderType: OrderType;
  addressId?: string;
  notes?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// ─────────────────────────────────────────────
//  UI PROPS
// ─────────────────────────────────────────────

export interface OrderStatusCardProps {
  value: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}
