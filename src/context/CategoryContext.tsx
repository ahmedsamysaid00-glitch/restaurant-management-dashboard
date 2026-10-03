import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Category } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedCategories, seedProducts } from '@/data/seed';
import { generateId } from '@/lib/calculations';

interface CategoryContextValue {
  categories: Category[];
  addCategory: (name: string, description: string) => void;
  renameCategory: (id: string, name: string, description: string) => void;
  deleteCategory: (id: string) => { success: boolean; error?: string };
  getCategoryName: (id: string) => string;
  resetToSeed: () => void;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

const CATEGORIES_KEY = 'bh_categories';

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = loadFromStorage<Category[]>(CATEGORIES_KEY, []);
    if (stored.length === 0) {
      saveToStorage(CATEGORIES_KEY, seedCategories);
      return seedCategories;
    }
    return stored;
  });

  const persist = useCallback((updated: Category[]) => {
    setCategories(updated);
    saveToStorage(CATEGORIES_KEY, updated);
  }, []);

  const addCategory = useCallback(
    (name: string, description: string) => {
      const newCat: Category = {
        id: generateId('cat'),
        name: name.trim(),
        description: description.trim(),
      };
      persist([...categories, newCat]);
    },
    [categories, persist],
  );

  const renameCategory = useCallback(
    (id: string, name: string, description: string) => {
      persist(categories.map((c) => (c.id === id ? { ...c, name: name.trim(), description: description.trim() } : c)));
    },
    [categories, persist],
  );

  const deleteCategory = useCallback(
    (id: string): { success: boolean; error?: string } => {
      const productsInCategory = seedProducts.some((p) => p.categoryId === id);
      if (productsInCategory) {
        return {
          success: false,
          error: 'Cannot delete a category that still contains products. Please reassign products first.',
        };
      }
      persist(categories.filter((c) => c.id !== id));
      return { success: true };
    },
    [categories, persist],
  );

  const getCategoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? 'Uncategorized',
    [categories],
  );

  const resetToSeed = useCallback(() => {
    persist(seedCategories);
  }, [persist]);

  return (
    <CategoryContext.Provider value={{ categories, addCategory, renameCategory, deleteCategory, getCategoryName, resetToSeed }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
  return ctx;
}
