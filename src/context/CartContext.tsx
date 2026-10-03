import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, ProductSize } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { getSizeAdjustment } from '@/lib/calculations';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity: number, size?: ProductSize) => void;
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void;
  removeItem: (productId: string, size: string | undefined) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = 'bh_cart';

function itemKey(productId: string, size?: string) {
  return `${productId}__${size ?? 'none'}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>(CART_KEY, []));

  const persist = useCallback((updated: CartItem[]) => {
    setItems(updated);
    saveToStorage(CART_KEY, updated);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity: number, size?: ProductSize) => {
      const sizeAdj = getSizeAdjustment(size);
      const key = itemKey(product.id, size);
      setItems((prev) => {
        const existing = prev.find((i) => itemKey(i.productId, i.size) === key);
        let updated: CartItem[];
        if (existing) {
          updated = prev.map((i) =>
            itemKey(i.productId, i.size) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        } else {
          updated = [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
              size,
              sizePriceAdjustment: sizeAdj,
            },
          ];
        }
        saveToStorage(CART_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        persist(items.filter((i) => itemKey(i.productId, i.size) !== itemKey(productId, size)));
        return;
      }
      persist(
        items.map((i) =>
          itemKey(i.productId, i.size) === itemKey(productId, size) ? { ...i, quantity } : i,
        ),
      );
    },
    [items, persist],
  );

  const removeItem = useCallback(
    (productId: string, size: string | undefined) => {
      persist(items.filter((i) => itemKey(i.productId, i.size) !== itemKey(productId, size)));
    },
    [items, persist],
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price + (i.sizePriceAdjustment ?? 0)) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
