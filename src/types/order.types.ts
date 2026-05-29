// ─────────────────────────────────────────────
//  ENUMS  (espejo de Prisma)
// ─────────────────────────────────────────────

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'PICKED_UP'
  | 'PAYMENT_FAILED'
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

export interface OrderItemOption {
  id: string;
  optionId: string;
  optionName: string;
  extraPrice: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  selectedOptions: OrderItemOption[];
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

export interface CreateOrderItemOptionDto {
  optionId: string;
  optionName: string;
  extraPrice: number;
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  selectedOptions?: CreateOrderItemOptionDto[];
}

export type PaymentMethod = 'QR' | 'CASH' | 'NIUBIZ';

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
