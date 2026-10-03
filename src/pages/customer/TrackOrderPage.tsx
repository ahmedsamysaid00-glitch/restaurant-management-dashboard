import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Utensils, ShoppingBag, Clock, CheckCircle2, ChefHat, Coffee, PackageCheck, XCircle, Receipt } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { PageContainer, EmptyState, ImageWithFallback } from '@/components/ui/Misc';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatDateTime, formatTime, getUnitPrice } from '@/lib/calculations';
import type { OrderStatus } from '@/types';

const statusIcons: Record<OrderStatus, typeof Clock> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Preparing: ChefHat,
  Ready: Coffee,
  Completed: PackageCheck,
  Cancelled: XCircle,
};

export function TrackOrderPage() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>();
  const { getOrderByNumber } = useOrders();
  const [searchInput, setSearchInput] = useState(paramOrderNumber ?? '');
  const [searchedNumber, setSearchedNumber] = useState(paramOrderNumber ?? '');

  const order = searchedNumber ? getOrderByNumber(searchedNumber) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedNumber(searchInput.trim());
  };

  return (
    <div className="py-8">
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-espresso transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-espresso mb-2">Track Your Order</h1>
          <p className="text-muted mb-6">Enter your order number to check its status. No login required.</p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="e.g., BH-1234"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button type="submit" className="btn-primary flex-shrink-0">
              Track Order
            </button>
          </form>

          {/* Results */}
          {searchedNumber && !order && (
            <div className="card">
              <EmptyState
                icon={<Search className="h-7 w-7" />}
                title="Order not found"
                message={`No order found with number "${searchedNumber}". Please check and try again.`}
                action={<Link to="/menu" className="btn-outline btn-sm">Browse Menu</Link>}
              />
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-fade-in">
              {/* Order header */}
              <div className="card p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-espresso">{order.orderNumber}</h2>
                    <p className="text-sm text-muted mt-1">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                {!order.isSeeded && (
                  <span className="inline-block mt-3 badge-base bg-green-50 text-green-700 border border-green-200 text-[11px]">
                    Created during this demo session
                  </span>
                )}
              </div>

              {/* Status timeline */}
              <div className="card p-6">
                <h3 className="font-serif text-lg font-bold text-espresso mb-4">Order Status</h3>
                <div className="space-y-4">
                  {order.statusHistory.map((entry, idx) => {
                    const Icon = statusIcons[entry.status] ?? Clock;
                    const isLast = idx === order.statusHistory.length - 1;
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                            entry.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                            entry.status === 'Completed' ? 'bg-green-50 text-green-600' :
                            'bg-caramel/10 text-caramel'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {!isLast && <div className="w-0.5 h-6 bg-espresso/10 mt-1"></div>}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-medium text-espresso">{entry.status}</p>
                          <p className="text-xs text-muted">{formatTime(entry.timestamp)}</p>
                          {entry.note && <p className="text-xs text-muted italic mt-0.5">{entry.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order items */}
              <div className="card p-6">
                <h3 className="font-serif text-lg font-bold text-espresso mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <ImageWithFallback src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-espresso">{item.name}</p>
                        <p className="text-sm text-muted">
                          {item.size ? `${item.size} · ` : ''}{item.quantity} × {formatPrice(getUnitPrice(item))}
                        </p>
                      </div>
                      <span className="font-bold text-espresso flex-shrink-0">{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-espresso/10 flex justify-between items-baseline">
                  <span className="font-semibold text-espresso">Total</span>
                  <span className="text-xl font-bold text-espresso">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Order details */}
              <div className="card p-6">
                <h3 className="font-serif text-lg font-bold text-espresso mb-4">Order Details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted">Customer</dt>
                    <dd className="font-medium text-espresso mt-0.5">{order.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Phone</dt>
                    <dd className="font-medium text-espresso mt-0.5">{order.customerPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Fulfillment</dt>
                    <dd className="font-medium text-espresso flex items-center gap-2 mt-0.5">
                      {order.fulfillmentMethod === 'Dine-in' ? <Utensils className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                      {order.fulfillmentMethod}
                      {order.tableNumber ? ` · Table ${order.tableNumber}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Payment</dt>
                    <dd className="font-medium text-espresso mt-0.5 flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      {order.paymentMethod}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Payment Status</dt>
                    <dd className={`font-medium mt-0.5 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid — pay on delivery'}
                    </dd>
                  </div>
                  {order.notes && (
                    <div>
                      <dt className="text-muted">Notes</dt>
                      <dd className="font-medium text-espresso mt-0.5">{order.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="text-center">
                <Link to="/menu" className="btn-outline">
                  Browse Menu
                </Link>
              </div>
            </div>
          )}

          {!searchedNumber && (
            <div className="card">
              <EmptyState
                icon={<Search className="h-7 w-7" />}
                title="Enter your order number"
                message="Use the search box above to track your order. You'll find your order number on your confirmation page."
                action={<Link to="/menu" className="btn-outline btn-sm">Browse Menu</Link>}
              />
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
