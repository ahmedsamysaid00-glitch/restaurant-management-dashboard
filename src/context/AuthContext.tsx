import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedUsers } from '@/data/seed';
import { generateId } from '@/lib/calculations';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  loginAsDemo: (role: UserRole) => void;
  register: (name: string, email: string, password: string, phone?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: { name?: string; phone?: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = 'bh_users';
const SESSION_KEY = 'bh_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = loadFromStorage<User[]>(USERS_KEY, []);
    if (stored.length === 0) {
      saveToStorage(USERS_KEY, seedUsers);
      return seedUsers;
    }
    // Ensure seed demo accounts always exist
    const hasAdmin = stored.some((u) => u.email === 'admin@brewhouse.demo');
    const hasCustomer = stored.some((u) => u.email === 'customer@brewhouse.demo');
    let result = stored;
    if (!hasAdmin) result = [...result, seedUsers[0]];
    if (!hasCustomer) result = [...result, seedUsers[1]];
    if (result !== stored) saveToStorage(USERS_KEY, result);
    return result;
  });

  const [user, setUser] = useState<User | null>(() => {
    const session = loadFromStorage<{ userId: string } | null>(SESSION_KEY, null);
    if (!session) return null;
    const stored = loadFromStorage<User[]>(USERS_KEY, seedUsers);
    return stored.find((u) => u.id === session.userId) ?? null;
  });

  const persistUsers = useCallback((updated: User[]) => {
    setUsers(updated);
    saveToStorage(USERS_KEY, updated);
  }, []);

  const persistSession = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      saveToStorage(SESSION_KEY, { userId: u.id });
    } else {
      saveToStorage(SESSION_KEY, null);
    }
  }, []);

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const normalized = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === normalized && u.password === password);
      if (!found) {
        return { success: false, error: 'Invalid email or password. Please try again.' };
      }
      persistSession(found);
      return { success: true };
    },
    [users, persistSession],
  );

  const loginAsDemo = useCallback(
    (role: UserRole) => {
      const demoUser = users.find((u) => u.role === role && u.email.endsWith('@brewhouse.demo'));
      if (demoUser) persistSession(demoUser);
    },
    [users, persistSession],
  );

  const register = useCallback(
    (name: string, email: string, password: string, phone?: string): { success: boolean; error?: string } => {
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      const newUser: User = {
        id: generateId('user'),
        name: name.trim(),
        email: normalized,
        password,
        role: 'customer',
        phone: phone?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      persistUsers([...users, newUser]);
      persistSession(newUser);
      return { success: true };
    },
    [users, persistUsers, persistSession],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const updateProfile = useCallback(
    (updates: { name?: string; phone?: string }) => {
      if (!user) return;
      const updated = { ...user, ...updates };
      persistSession(updated);
      persistUsers(users.map((u) => (u.id === user.id ? updated : u)));
    },
    [user, users, persistSession, persistUsers],
  );

  const value: AuthContextValue = {
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    loginAsDemo,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
