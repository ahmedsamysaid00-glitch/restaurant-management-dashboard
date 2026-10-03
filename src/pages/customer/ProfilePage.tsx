import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LogOut, ShoppingBag, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer, EmptyState } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatDateTime } from '@/lib/calculations';

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { getOrdersByCustomer } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;
  const orders = getOrdersByCustomer(user.id);

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    updateProfile({ name: name.trim(), phone: phone.trim() });
    showToast('Profile updated successfully', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="py-8">
      <PageContainer>
        <h1 className="text-3xl font-bold text-espresso mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile info */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-caramel text-white text-2xl font-bold mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="font-serif text-xl font-bold text-espresso">{user.name}</h2>
              <p className="text-sm text-muted mt-1">{user.email}</p>
              <button onClick={handleLogout} className="btn-outline btn-sm w-full mt-5 text-red-600 border-red-200 hover:bg-red-600 hover:text-white">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Edit form + orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-espresso mb-1.5">
                    <Mail className="h-4 w-4 text-muted" />
                    Email (not editable)
                  </label>
                  <input className="input-field bg-cream-dark cursor-not-allowed" value={user.email} disabled />
                </div>
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 1XX XXX XXXX" />
                <button onClick={handleSave} className="btn-primary">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Order history */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Recent Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      to={`/my-orders/${order.orderNumber}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-espresso/8 p-4 hover:border-caramel/30 hover:bg-caramel/5 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-espresso text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-muted mt-0.5">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge status={order.status} size="sm" />
                        <span className="font-bold text-espresso text-sm">{formatPrice(order.total)}</span>
                      </div>
                    </Link>
                  ))}
                  {orders.length > 5 && (
                    <Link to="/my-orders" className="block text-center text-sm text-caramel hover:underline mt-3">
                      View all orders
                    </Link>
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBag className="h-6 w-6" />}
                  title="No orders yet"
                  message="Your order history will appear here."
                />
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
