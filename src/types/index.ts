export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export type ProductSize = 'Small' | 'Medium' | 'Large';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  categoryId: string;
  image: string;
  available: boolean;
  popularity: number;
  hasSizes: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: ProductSize;
  sizePriceAdjustment?: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type FulfillmentMethod = 'Dine-in' | 'Takeaway';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: ProductSize;
  sizePriceAdjustment?: number;
  lineTotal: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export type PaymentStatus = 'paid' | 'unpaid';
export type PaymentMethodType = 'pay_now' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  fulfillmentMethod: FulfillmentMethod;
  tableNumber?: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  isSeeded: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpending: number;
  createdAt: string;
}

export interface CafeSettings {
  cafeName: string;
  contactPhone: string;
  address: string;
  openingHours: string;
  currencyDisplay: string;
  orderNotifications: boolean;
  newOrderSound: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
