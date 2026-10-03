import { useState, useMemo } from 'react';
import { Search, X, Eye, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { useCustomers } from '@/context/CustomerContext';
import { useOrders } from '@/context/OrderContext';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/Misc';
import { formatPrice, formatDate, formatDateTime } from '@/lib/calculations';
import type { Customer } from '@/types';

export function AdminCustomersPage() {
  const { customers } = useCustomers();
  const { orders } = useOrders();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    let result = [...customers].sort((a, b) => b.totalSpending - a.totalSpending);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    return result;
  }, [customers, search]);

  const customerOrders = useMemo(() => {
    if (!selected) return [];
    return orders
      .filter((o) => o.customerId === selected.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selected, orders]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-espresso">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-muted">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark">
                <tr className="text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Phone</th>
                  <th className="px-4 py-3 font-medium text-center">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Total Spending</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-t border-espresso/5 hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-caramel text-white text-sm font-bold flex-shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-espresso">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">{customer.email}</td>
                    <td className="px-4 py-3 text-muted hidden lg:table-cell">{customer.phone}</td>
                    <td className="px-4 py-3 text-center font-medium text-espresso">{customer.totalOrders}</td>
                    <td className="px-4 py-3 text-right font-bold text-espresso">{formatPrice(customer.totalSpending)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(customer)} className="inline-flex items-center gap-1 text-caramel hover:underline text-xs font-medium">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="No customers found"
            message="Try adjusting your search to find customers."
          />
        </div>
      )}

      {/* Customer detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Customer Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-caramel text-white text-xl font-bold">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-espresso">{selected.name}</h2>
                <p className="text-sm text-muted">Customer since {formatDate(selected.createdAt)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-cream-dark p-4">
                <p className="text-xs text-muted flex items-center gap-1.5 mb-1"><Mail className="h-3.5 w-3.5" /> Email</p>
                <p className="text-sm font-medium text-espresso">{selected.email}</p>
              </div>
              <div className="rounded-xl bg-cream-dark p-4">
                <p className="text-xs text-muted flex items-center gap-1.5 mb-1"><Phone className="h-3.5 w-3.5" /> Phone</p>
                <p className="text-sm font-medium text-espresso">{selected.phone}</p>
              </div>
              <div className="rounded-xl bg-cream-dark p-4">
                <p className="text-xs text-muted flex items-center gap-1.5 mb-1"><ShoppingBag className="h-3.5 w-3.5" /> Total Orders</p>
                <p className="text-sm font-bold text-espresso">{selected.totalOrders}</p>
              </div>
              <div className="rounded-xl bg-cream-dark p-4">
                <p className="text-xs text-muted flex items-center gap-1.5 mb-1"><Calendar className="h-3.5 w-3.5" /> Total Spending</p>
                <p className="text-sm font-bold text-espresso">{formatPrice(selected.totalSpending)}</p>
              </div>
            </div>

            <div className="border-t border-espresso/10 pt-4">
              <h3 className="font-semibold text-espresso mb-3">Order History</h3>
              {customerOrders.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-4 rounded-xl border border-espresso/8 p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-espresso">{order.orderNumber}</p>
                        <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge status={order.status} size="sm" />
                        <span className="text-sm font-bold text-espresso">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted text-center py-6">No orders yet</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
