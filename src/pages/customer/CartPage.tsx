import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer, EmptyState, ImageWithFallback } from '@/components/ui/Misc';
import { formatPrice, getUnitPrice, getLineTotal } from '@/lib/calculations';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <PageContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-espresso mb-8">Your Cart</h1>
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="Your cart is empty"
            message="Looks like you haven't added any items yet. Browse our menu and find something you'll love."
            action={
              <Link to="/menu" className="btn-primary">
                Explore Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="py-8">
      <PageContainer>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-espresso">Your Cart</h1>
          <button
            onClick={() => {
              clearCart();
              showToast('Cart cleared', 'info');
            }}
            className="text-sm text-muted hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size ?? 'none'}`} className="card p-4 flex gap-4">
                <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-espresso hover:text-caramel transition-colors">{item.name}</h3>
                      </Link>
                      {item.size && (
                        <p className="text-xs text-muted mt-0.5">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-muted mt-1">{formatPrice(getUnitPrice(item))} each</p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.productId, item.size);
                        showToast(`${item.name} removed from cart`, 'info');
                      }}
                      className="text-muted hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-espresso/10 text-espresso hover:bg-espresso/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-espresso/10 text-espresso hover:bg-espresso/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-bold text-espresso">{formatPrice(getLineTotal(item))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Service charge</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="my-4 border-t border-espresso/10"></div>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-espresso">Total</span>
                <span className="text-2xl font-bold text-espresso">{formatPrice(subtotal)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-6"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/menu" className="btn-ghost w-full mt-3 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
