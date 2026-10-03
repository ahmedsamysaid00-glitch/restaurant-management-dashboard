import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Eye, ArrowRight, X } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/components/ui/Toast';
import { StatusBadge, allOrderStatuses, getNextStatuses } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Select } from '@/components/ui/Input';
import { EmptyState, ImageWithFallback } from '@/components/ui/Misc';
import { formatPrice, formatDateTime } from '@/lib/calculations';
import type { Order, OrderStatus } from '@/types';

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    let result = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((o) => o.status === statusFilter);
    if (fulfillmentFilter !== 'all') result = result.filter((o) => o.fulfillmentMethod === fulfillmentFilter);
    return result;
  }, [orders, search, statusFilter, fulfillmentFilter]);

  const hasFilters = search.trim() || statusFilter !== 'all' || fulfillmentFilter !== 'all';
  const resetFilters = () => { setSearch(''); setStatusFilter('all'); setFulfillmentFilter('all'); };

  const handleStatusChange = (order: Order, status: OrderStatus) => {
    const result = updateOrderStatus(order.id, status);
    if (result.success) {
      showToast(`Order ${order.orderNumber} updated to ${status}`, 'success');
      setSelectedOrder(null);
    } else {
      showToast(result.error ?? 'Failed to update order', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order number or customer..."
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
        <div className="sm:w-44">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {allOrderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="sm:w-44">
          <Select value={fulfillmentFilter} onChange={(e) => setFulfillmentFilter(e.target.value)}>
            <option value="all">All Methods</option>
            <option value="Dine-in">Dine-in</option>
            <option value="Takeaway">Takeaway</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
        {hasFilters && (
          <button onClick={resetFilters} className="text-sm text-caramel hover:underline flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark">
                <tr className="text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-t border-espresso/5 hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-espresso">
                      {order.orderNumber}
                      {!order.isSeeded && <span className="ml-2 text-[10px] text-green-600">●</span>}
                    </td>
                    <td className="px-4 py-3 text-muted">{order.customerName}</td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3 text-muted">{order.fulfillmentMethod}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted text-xs">{order.paymentMethod}</span>
                        <span className={`text-[11px] font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} size="sm" /></td>
                    <td className="px-4 py-3 text-right font-bold text-espresso">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 text-caramel hover:underline text-xs font-medium"
                      >
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
            title="No orders found"
            message="Try adjusting your filters to see more results."
            action={<button onClick={resetFilters} className="btn-outline btn-sm">Reset filters</button>}
          />
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : ''}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs">Customer</p>
                <p className="font-medium text-espresso">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Phone</p>
                <p className="font-medium text-espresso">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Date</p>
                <p className="font-medium text-espresso">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Fulfillment</p>
                <p className="font-medium text-espresso">
                  {selectedOrder.fulfillmentMethod}
                  {selectedOrder.tableNumber ? ` · Table ${selectedOrder.tableNumber}` : ''}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs">Payment Method</p>
                <p className="font-medium text-espresso">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Payment Status</p>
                <p className={`font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </p>
              </div>
              {selectedOrder.notes && (
                <div className="col-span-2">
                  <p className="text-muted text-xs">Notes</p>
                  <p className="font-medium text-espresso">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="border-t border-espresso/10 pt-4">
              <h3 className="font-semibold text-espresso mb-3">Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <ImageWithFallback src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-espresso">{item.name}</p>
                      <p className="text-xs text-muted">{item.size ? `${item.size} · ` : ''}{item.quantity} × {formatPrice(item.price + (item.sizePriceAdjustment ?? 0))}</p>
                    </div>
                    <span className="text-sm font-bold text-espresso">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-baseline border-t border-espresso/10 pt-3">
                <span className="font-semibold text-espresso">Total</span>
                <span className="text-xl font-bold text-espresso">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status management */}
            <div className="border-t border-espresso/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-espresso">Status Management</h3>
                <StatusBadge status={selectedOrder.status} size="sm" />
              </div>
              <div className="flex flex-wrap gap-2">
                {getNextStatuses(selectedOrder.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (status === 'Cancelled') {
                        setCancelTarget(selectedOrder);
                      } else {
                        handleStatusChange(selectedOrder, status);
                      }
                    }}
                    className={status === 'Cancelled' ? 'btn-danger btn-sm' : 'btn-accent btn-sm'}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Set to {status}
                  </button>
                ))}
                {getNextStatuses(selectedOrder.status).length === 0 && (
                  <p className="text-sm text-muted">No further status transitions available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => {
          if (cancelTarget) handleStatusChange(cancelTarget, 'Cancelled');
        }}
        title="Cancel this order?"
        message={`Are you sure you want to cancel order ${cancelTarget?.orderNumber}? This action cannot be undone.`}
        confirmLabel="Yes, Cancel Order"
      />
    </div>
  );
}
