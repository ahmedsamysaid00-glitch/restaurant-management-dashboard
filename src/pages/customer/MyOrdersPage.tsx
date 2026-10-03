import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { PageContainer, EmptyState } from '@/components/ui/Misc';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatDateTime } from '@/lib/calculations';

export function MyOrdersPage() {
  const { user } = useAuth();
  const { getOrdersByCustomer } = useOrders();

  if (!user) return null;
  const orders = getOrdersByCustomer(user.id);

  if (orders.length === 0) {
    return (
      <PageContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-espresso mb-8">My Orders</h1>
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="No orders yet"
            message="When you place your first order, it will appear here with all the details."
            action={<Link to="/menu" className="btn-primary">Browse Menu</Link>}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="py-8">
      <PageContainer>
        <h1 className="text-3xl font-bold text-espresso mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/my-orders/${order.orderNumber}`}
              className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-soft-lg transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-espresso">{order.orderNumber}</span>
                  <StatusBadge status={order.status} size="sm" />
                  {!order.isSeeded && (
                    <span className="badge-base bg-green-50 text-green-700 border border-green-200 text-[11px] px-2 py-0.5">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-1.5">{formatDateTime(order.createdAt)}</p>
                <p className="text-sm text-muted mt-0.5">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.length !== 1 ? 's' : ''} · {order.fulfillmentMethod}
                  {order.tableNumber ? ` · Table ${order.tableNumber}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:flex-shrink-0">
                <span className="text-lg font-bold text-espresso">{formatPrice(order.total)}</span>
                <ArrowRight className="h-5 w-5 text-muted group-hover:text-caramel group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
