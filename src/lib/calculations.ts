import type { CartItem, Order, OrderItem } from '@/types';

const SIZE_ADJUSTMENTS: Record<string, number> = {
  Small: -10,
  Medium: 0,
  Large: 10,
};

export function getSizeAdjustment(size?: string): number {
  if (!size) return 0;
  return SIZE_ADJUSTMENTS[size] ?? 0;
}

export function getUnitPrice(item: { price: number; sizePriceAdjustment?: number }): number {
  return item.price + (item.sizePriceAdjustment ?? 0);
}

export function getLineTotal(item: { price: number; sizePriceAdjustment?: number; quantity: number }): number {
  return getUnitPrice(item) * item.quantity;
}

export function cartToOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    size: item.size,
    sizePriceAdjustment: item.sizePriceAdjustment ?? 0,
    lineTotal: getLineTotal(item),
  }));
}

export function calculateSubtotal(items: { lineTotal: number }[]): number {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function calculateCartSubtotal(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + getLineTotal(item), 0);
}

export function isRevenueOrder(order: Order): boolean {
  return order.status !== 'Cancelled' && order.paymentStatus !== 'unpaid';
}

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function formatPrice(amount: number, currency = 'EGP'): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currency}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function generateOrderNumber(): string {
  const prefix = 'BH';
  const num = Math.floor(2000 + Math.random() * 8000);
  return `${prefix}-${num}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
