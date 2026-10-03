import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Order, OrderStatus, FulfillmentMethod, OrderItem, PaymentStatus } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedOrders, seedCustomers } from '@/data/seed';
import { generateId, generateOrderNumber, calculateOrderTotal } from '@/lib/calculations';
import { validTransitions } from '@/components/ui/StatusBadge';

interface CreateOrderInput {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  fulfillmentMethod: FulfillmentMethod;
  tableNumber?: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  initialStatus?: OrderStatus;
}

interface OrderContextValue {
  orders: Order[];
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => { success: boolean; error?: string };
  getOrdersByCustomer: (customerId: string) => Order[];
  resetToSeed: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

const ORDERS_KEY = 'bh_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = loadFromStorage<Order[]>(ORDERS_KEY, []);
    if (stored.length === 0) {
      saveToStorage(ORDERS_KEY, seedOrders);
      return seedOrders;
    }
    return stored.map((o) => ({
      ...o,
      paymentStatus: o.paymentStatus ?? (o.status === 'Cancelled' ? 'unpaid' : 'paid'),
    }));
  });

  const persist = useCallback((updated: Order[]) => {
    setOrders(updated);
    saveToStorage(ORDERS_KEY, updated);
  }, []);

  const getOrderByNumber = useCallback(
    (orderNumber: string) => orders.find((o) => o.orderNumber === orderNumber),
    [orders],
  );

  const createOrder = useCallback(
    (input: CreateOrderInput): Order => {
      const now = new Date().toISOString();
      const total = calculateOrderTotal(input.items);
      const initialStatus = input.initialStatus ?? 'Pending';
      const newOrder: Order = {
        id: generateId('order'),
        orderNumber: generateOrderNumber(),
        customerId: input.customerId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        items: input.items,
        subtotal: total,
        total,
        fulfillmentMethod: input.fulfillmentMethod,
        tableNumber: input.tableNumber,
        notes: input.notes,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        status: initialStatus,
        statusHistory: [{ status: initialStatus, timestamp: now }],
        createdAt: now,
        isSeeded: false,
      };
      persist([newOrder, ...orders]);
      return newOrder;
    },
    [orders, persist],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus): { success: boolean; error?: string } => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found.' };
      if (!validTransitions[order.status].includes(status)) {
        return {
          success: false,
          error: `Cannot change status from "${order.status}" to "${status}".`,
        };
      }
      const updated = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              statusHistory: [...o.statusHistory, { status, timestamp: new Date().toISOString() }],
            }
          : o,
      );
      persist(updated);
      return { success: true };
    },
    [orders, persist],
  );

  const getOrdersByCustomer = useCallback(
    (customerId: string) =>
      orders
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  );

  const resetToSeed = useCallback(() => {
    persist(seedOrders);
  }, [persist]);

  return (
    <OrderContext.Provider
      value={{ orders, getOrderByNumber, createOrder, updateOrderStatus, getOrdersByCustomer, resetToSeed }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

export { seedCustomers };
