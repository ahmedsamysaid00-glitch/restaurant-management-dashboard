import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CafeSettings } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { seedSettings } from '@/data/seed';

interface SettingsContextValue {
  settings: CafeSettings;
  updateSettings: (updates: Partial<CafeSettings>) => void;
  resetToSeed: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SETTINGS_KEY = 'bh_settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CafeSettings>(() => {
    const stored = loadFromStorage<CafeSettings>(SETTINGS_KEY, seedSettings);
    return { ...seedSettings, ...stored };
  });

  const updateSettings = useCallback((updates: Partial<CafeSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      saveToStorage(SETTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const resetToSeed = useCallback(() => {
    setSettings(seedSettings);
    saveToStorage(SETTINGS_KEY, seedSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetToSeed }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
