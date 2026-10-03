import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Utensils, ShoppingBag as TakeawayIcon, CheckCircle2, ArrowLeft,
  CreditCard, Wallet, Lock, XCircle, AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer, EmptyState, ImageWithFallback, Modal } from '@/components/ui/Misc';
import { Input, Textarea } from '@/components/ui/Input';
import { formatPrice, getUnitPrice, getLineTotal, cartToOrderItems } from '@/lib/calculations';
import type { FulfillmentMethod, Order, PaymentMethodType } from '@/types';

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('Dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash_on_delivery');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <PageContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-espresso mb-8">Checkout</h1>
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="Your cart is empty"
            message="Add some items to your cart before checking out."
            action={<Link to="/menu" className="btn-primary">Browse Menu</Link>}
          />
        </div>
      </PageContainer>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[+\d\s()-]{8,}$/.test(phone.trim())) e.phone = 'Please enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildOrderInput = () => ({
    customerId: `guest-${Date.now()}`,
    customerName: name.trim(),
    customerEmail: '',
    customerPhone: phone.trim(),
    items: cartToOrderItems(items),
    fulfillmentMethod: fulfillment,
    tableNumber: fulfillment === 'Dine-in' ? tableNumber.trim() : undefined,
    notes: notes.trim() || undefined,
  });

  const handleConfirm = () => {
    if (!validate()) return;
    if (paymentMethod === 'pay_now') {
      setShowPaymentModal(true);
    } else {
      const order = createOrder({
        ...buildOrderInput(),
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'unpaid',
        initialStatus: 'Pending',
      });
      clearCart();
      setConfirmedOrder(order);
      showToast('Order placed successfully!', 'success');
    }
  };

  const handleCompletePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        ...buildOrderInput(),
        paymentMethod: 'Pay Now (Demo)',
        paymentStatus: 'paid',
        initialStatus: 'Confirmed',
      });
      clearCart();
      setShowPaymentModal(false);
      setPaymentProcessing(false);
      setConfirmedOrder(order);
      showToast('Demo payment completed — order confirmed!', 'success');
    }, 1200);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    showToast('Payment cancelled. Your cart is preserved.', 'info');
  };

  if (confirmedOrder) {
    return (
      <PageContainer>
        <div className="py-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-50 text-green-600 mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-espresso mb-2">Order Confirmed!</h1>
            <p className="text-muted mb-1">Your order number is</p>
            <p className="text-2xl font-bold text-caramel mb-6">{confirmedOrder.orderNumber}</p>
            <div className="card p-6 text-left mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted">Total</span>
                <span className="font-bold text-espresso">{formatPrice(confirmedOrder.total)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted">Fulfillment</span>
                <span className="text-sm font-medium text-espresso">{confirmedOrder.fulfillmentMethod}</span>
              </div>
              {confirmedOrder.tableNumber && (
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted">Table</span>
                  <span className="text-sm font-medium text-espresso">{confirmedOrder.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted">Payment</span>
                <span className="text-sm font-medium text-espresso">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Payment Status</span>
                <span className={`text-sm font-medium ${confirmedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {confirmedOrder.paymentStatus === 'paid' ? 'Paid' : 'Unpaid — pay on delivery'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate(`/track-order/${confirmedOrder.orderNumber}`)} className="btn-primary">
                Track Your Order
              </button>
              <button onClick={() => navigate('/menu')} className="btn-outline">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="py-8">
      <PageContainer>
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted hover:text-espresso transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-espresso mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest notice */}
            <div className="rounded-xl bg-caramel/5 border border-caramel/20 px-4 py-3 text-sm text-espresso flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-caramel flex-shrink-0" />
              <span>Checking out as a guest — no account needed. Save your order number to track your order later.</span>
            </div>

            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Contact Information</h2>
              <div className="space-y-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="+20 1XX XXX XXXX" required />
                <Textarea label="Order Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any special instructions..." />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Fulfillment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFulfillment('Dine-in')}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all ${
                    fulfillment === 'Dine-in'
                      ? 'border-caramel bg-caramel/5'
                      : 'border-espresso/10 hover:border-espresso/20'
                  }`}
                >
                  <Utensils className={`h-6 w-6 ${fulfillment === 'Dine-in' ? 'text-caramel' : 'text-muted'}`} />
                  <span className="font-medium text-espresso">Dine-in</span>
                </button>
                <button
                  onClick={() => setFulfillment('Takeaway')}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all ${
                    fulfillment === 'Takeaway'
                      ? 'border-caramel bg-caramel/5'
                      : 'border-espresso/10 hover:border-espresso/20'
                  }`}
                >
                  <TakeawayIcon className={`h-6 w-6 ${fulfillment === 'Takeaway' ? 'text-caramel' : 'text-muted'}`} />
                  <span className="font-medium text-espresso">Takeaway</span>
                </button>
              </div>
              {fulfillment === 'Dine-in' && (
                <div className="mt-4">
                  <Input label="Table Number (Optional)" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} error={errors.tableNumber} placeholder="e.g., 5" />
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 transition-all text-left ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-caramel bg-caramel/5'
                      : 'border-espresso/10 hover:border-espresso/20'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${
                    paymentMethod === 'cash_on_delivery' ? 'bg-caramel/10 text-caramel' : 'bg-cream-dark text-muted'
                  }`}>
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-espresso">Cash on Delivery</p>
                    <p className="text-xs text-muted mt-0.5">Pay with cash when you receive your order</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                    paymentMethod === 'cash_on_delivery' ? 'border-caramel bg-caramel' : 'border-espresso/20'
                  }`}>
                    {paymentMethod === 'cash_on_delivery' && <div className="h-full w-full rounded-full bg-white scale-50" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('pay_now')}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 transition-all text-left ${
                    paymentMethod === 'pay_now'
                      ? 'border-caramel bg-caramel/5'
                      : 'border-espresso/10 hover:border-espresso/20'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${
                    paymentMethod === 'pay_now' ? 'bg-caramel/10 text-caramel' : 'bg-cream-dark text-muted'
                  }`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-espresso">Pay Now</p>
                    <p className="text-xs text-muted mt-0.5">Pay online with a simulated demo payment</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                    paymentMethod === 'pay_now' ? 'border-caramel bg-caramel' : 'border-espresso/20'
                  }`}>
                    {paymentMethod === 'pay_now' && <div className="h-full w-full rounded-full bg-white scale-50" />}
                  </div>
                </button>
              </div>
              <p className="text-xs text-muted mt-3 flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                Demo only — no real payment will be processed.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-espresso mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size ?? 'none'}`} className="flex gap-3">
                    <ImageWithFallback src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-espresso truncate">{item.name}</p>
                      <p className="text-xs text-muted">
                        {item.size ? `${item.size} · ` : ''}{item.quantity} × {formatPrice(getUnitPrice(item))}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-espresso flex-shrink-0">{formatPrice(getLineTotal(item))}</span>
                  </div>
                ))}
              </div>
              <div className="my-3 border-t border-espresso/10"></div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-muted">Payment</span>
                <span className="text-sm font-medium text-espresso">
                  {paymentMethod === 'pay_now' ? 'Pay Now' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-espresso">Total</span>
                <span className="text-2xl font-bold text-espresso">{formatPrice(subtotal)}</span>
              </div>
              <button onClick={handleConfirm} className="btn-primary w-full mt-6">
                {paymentMethod === 'pay_now' ? 'Proceed to Payment' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Demo Payment Modal */}
      <Modal
        open={showPaymentModal}
        onClose={paymentProcessing ? () => {} : handleCancelPayment}
        title="Demo Payment"
        size="sm"
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Demo Payment Only</p>
              <p className="text-xs text-amber-700 mt-0.5">No real money will be charged. No card details will be collected.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-cream-dark p-5 text-center">
            <p className="text-sm text-muted">Amount to pay</p>
            <p className="text-3xl font-bold text-espresso mt-1">{formatPrice(subtotal)}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <CreditCard className="h-4 w-4" />
            <span>Simulated card payment</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancelPayment}
              disabled={paymentProcessing}
              className="btn-outline flex-1"
            >
              <XCircle className="h-4 w-4" />
              Cancel Payment
            </button>
            <button
              onClick={handleCompletePayment}
              disabled={paymentProcessing}
              className="btn-primary flex-1"
            >
              {paymentProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Complete Demo Payment
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
