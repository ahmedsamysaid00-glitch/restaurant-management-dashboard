import { useState } from 'react';
import { Save, RotateCcw, Bell, Volume2, Store } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/components/ui/Toast';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useOrders } from '@/context/OrderContext';
import { useCustomers } from '@/context/CustomerContext';

export function AdminSettingsPage() {
  const { settings, updateSettings, resetToSeed: resetSettings } = useSettings();
  const { showToast } = useToast();
  const { resetToSeed: resetProducts } = useProducts();
  const { resetToSeed: resetCategories } = useCategories();
  const { resetToSeed: resetOrders } = useOrders();
  const { resetToSeed: resetCustomers } = useCustomers();

  const [form, setForm] = useState(settings);
  const [resetOpen, setResetOpen] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    showToast('Settings saved successfully', 'success');
  };

  const handleReset = () => {
    resetProducts();
    resetCategories();
    resetOrders();
    resetCustomers();
    resetSettings();
    setForm({
      cafeName: 'Brew House',
      contactPhone: '+20 2 1234 5678',
      address: '14 Tahrir Street, Downtown, Cairo, Egypt',
      openingHours: 'Mon–Fri: 7:00 AM – 11:00 PM | Sat–Sun: 8:00 AM – 12:00 AM',
      currencyDisplay: 'EGP',
      orderNotifications: true,
      newOrderSound: false,
    });
    showToast('Demo data has been reset to defaults', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Store className="h-5 w-5 text-caramel" />
          <h2 className="font-serif text-lg font-bold text-espresso">Café Information</h2>
        </div>
        <div className="space-y-4">
          <Input label="Café Name" value={form.cafeName} onChange={(e) => setForm({ ...form, cafeName: e.target.value })} />
          <Input label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          <Textarea label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
          <Textarea label="Opening Hours" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} rows={2} />
          <Select label="Currency Display" value={form.currencyDisplay} onChange={(e) => setForm({ ...form, currencyDisplay: e.target.value })}>
            <option value="EGP">EGP (Egyptian Pounds)</option>
            <option value="USD">USD (US Dollars)</option>
            <option value="EUR">EUR (Euros)</option>
          </Select>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-5 w-5 text-caramel" />
          <h2 className="font-serif text-lg font-bold text-espresso">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-cream-dark cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted" />
              <div>
                <p className="text-sm font-medium text-espresso">Order Notifications</p>
                <p className="text-xs text-muted mt-0.5">Show in-app notifications for new orders (demo only)</p>
              </div>
            </div>
            <input type="checkbox" checked={form.orderNotifications} onChange={(e) => setForm({ ...form, orderNotifications: e.target.checked })} className="h-5 w-5 rounded accent-caramel flex-shrink-0" />
          </label>
          <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-cream-dark cursor-pointer">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted" />
              <div>
                <p className="text-sm font-medium text-espresso">New Order Sound</p>
                <p className="text-xs text-muted mt-0.5">Play a sound when a new order arrives (demo only)</p>
              </div>
            </div>
            <input type="checkbox" checked={form.newOrderSound} onChange={(e) => setForm({ ...form, newOrderSound: e.target.checked })} className="h-5 w-5 rounded accent-caramel flex-shrink-0" />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setResetOpen(true)} className="btn-outline text-red-600 border-red-200 hover:bg-red-600 hover:text-white">
          <RotateCcw className="h-4 w-4" />
          Reset Demo Data
        </button>
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset all demo data?"
        message="This will restore all products, categories, orders, customers, and settings to their original seeded values. All demo modifications will be lost."
        confirmLabel="Yes, Reset Everything"
      />
    </div>
  );
}
