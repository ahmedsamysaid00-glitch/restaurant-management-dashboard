import { createContext, useContext, useState, useCallback, type ReactNode, useMemo } from 'react';
import type { Customer } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedCustomers, seedOrders } from '@/data/seed';
import { isRevenueOrder } from '@/lib/calculations';

interface CustomerContextValue {
  customers: Customer[];
  getCustomer: (id: string) => Customer | undefined;
  upsertCustomer: (id: string, name: string, email: string, phone: string, orderTotal: number) => void;
  resetToSeed: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

const CUSTOMERS_KEY = 'bh_customers';

function computeStats(baseCustomers: Customer[], orders: typeof seedOrders) {
  return baseCustomers.map((c) => {
    const custOrders = orders.filter((o) => o.customerId === c.id && isRevenueOrder(o));
    return {
      ...c,
      totalOrders: custOrders.length,
      totalSpending: custOrders.reduce((sum, o) => sum + o.total, 0),
    };
  });
}

export function CustomerProvider({ children, allOrders }: { children: ReactNode; allOrders: typeof seedOrders }) {
  const [baseCustomers, setBaseCustomers] = useState<Customer[]>(() => {
    const stored = loadFromStorage<Customer[]>(CUSTOMERS_KEY, []);
    if (stored.length === 0) {
      const computed = computeStats(seedCustomers, seedOrders);
      saveToStorage(CUSTOMERS_KEY, computed);
      return computed;
    }
    return stored;
  });

  const customers = useMemo(() => computeStats(baseCustomers, allOrders), [baseCustomers, allOrders]);

  const persistBase = useCallback((updated: Customer[]) => {
    setBaseCustomers(updated);
    saveToStorage(CUSTOMERS_KEY, updated);
  }, []);

  const getCustomer = useCallback((id: string) => customers.find((c) => c.id === id), [customers]);

  const upsertCustomer = useCallback(
    (id: string, name: string, email: string, phone: string, orderTotal: number) => {
      const existing = baseCustomers.find((c) => c.id === id);
      if (existing) {
        persistBase(
          baseCustomers.map((c) =>
            c.id === id
              ? {
                  ...c,
                  name,
                  email,
                  phone,
                  totalOrders: c.totalOrders + 1,
                  totalSpending: c.totalSpending + orderTotal,
                }
              : c,
          ),
        );
      } else {
        const newCustomer: Customer = {
          id,
          name,
          email,
          phone,
          totalOrders: 1,
          totalSpending: orderTotal,
          createdAt: new Date().toISOString(),
        };
        persistBase([...baseCustomers, newCustomer]);
      }
    },
    [baseCustomers, persistBase],
  );

  const resetToSeed = useCallback(() => {
    const computed = computeStats(seedCustomers, seedOrders);
    persistBase(computed);
  }, [persistBase]);

  return (
    <CustomerContext.Provider value={{ customers, getCustomer, upsertCustomer, resetToSeed }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider');
  return ctx;
}
