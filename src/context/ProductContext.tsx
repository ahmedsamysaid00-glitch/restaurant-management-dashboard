import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedProducts } from '@/data/seed';
import { generateId } from '@/lib/calculations';

interface ProductContextValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
  resetToSeed: () => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const PRODUCTS_KEY = 'bh_products';

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadFromStorage<Product[]>(PRODUCTS_KEY, []);
    if (stored.length === 0) {
      saveToStorage(PRODUCTS_KEY, seedProducts);
      return seedProducts;
    }
    return stored;
  });

  const persist = useCallback((updated: Product[]) => {
    setProducts(updated);
    saveToStorage(PRODUCTS_KEY, updated);
  }, []);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      const newProduct: Product = { ...product, id: generateId('prod') };
      persist([...products, newProduct]);
    },
    [products, persist],
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      persist(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    },
    [products, persist],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persist(products.filter((p) => p.id !== id));
    },
    [products, persist],
  );

  const toggleAvailability = useCallback(
    (id: string) => {
      persist(products.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
    },
    [products, persist],
  );

  const resetToSeed = useCallback(() => {
    persist(seedProducts);
  }, [persist]);

  return (
    <ProductContext.Provider
      value={{ products, getProduct, addProduct, updateProduct, deleteProduct, toggleAvailability, resetToSeed }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
