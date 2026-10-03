import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer, ImageWithFallback } from '@/components/ui/Misc';
import { formatPrice, getSizeAdjustment } from '@/lib/calculations';
import type { ProductSize } from '@/types';

const SIZES: ProductSize[] = ['Small', 'Medium', 'Large'];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { getCategoryName } = useCategories();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const product = id ? getProduct(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('Medium');

  if (!product) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-espresso mb-3">Product not found</h1>
          <p className="text-muted mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/menu" className="btn-primary">Back to Menu</Link>
        </div>
      </PageContainer>
    );
  }

  const sizeAdj = product.hasSizes ? getSizeAdjustment(selectedSize) : 0;
  const unitPrice = product.price + sizeAdj;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!product.available) return;
    addToCart(product, quantity, product.hasSizes ? selectedSize : undefined);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleBuyNow = () => {
    if (!product.available) return;
    addToCart(product, quantity, product.hasSizes ? selectedSize : undefined);
    showToast(`${product.name} added to cart`, 'success');
    navigate('/cart');
  };

  return (
    <div className="py-8">
      <PageContainer>
        <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-muted hover:text-espresso transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-soft-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            {!product.available && (
              <div className="absolute inset-0 rounded-3xl bg-espresso/50 flex items-center justify-center">
                <span className="rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-espresso">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="inline-block w-fit rounded-full bg-caramel/10 px-3 py-1 text-xs font-medium text-caramel mb-3">
              {getCategoryName(product.categoryId)}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">{product.name}</h1>
            <p className="mt-4 text-muted leading-relaxed">{product.longDescription}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-espresso">{formatPrice(unitPrice)}</span>
              {product.hasSizes && sizeAdj !== 0 && (
                <span className="text-sm text-muted">
                  ({selectedSize} size)
                </span>
              )}
            </div>

            {/* Size selector */}
            {product.hasSizes && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-espresso mb-2">Size</label>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.available}
                      className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-espresso text-cream shadow-soft'
                          : 'bg-white border border-espresso/10 text-espresso hover:border-espresso/20'
                      }`}
                    >
                      {size}
                      {size === 'Small' && <span className="block text-[10px] opacity-60">-10 EGP</span>}
                      {size === 'Large' && <span className="block text-[10px] opacity-60">+10 EGP</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-espresso mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.available || quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-espresso/10 text-espresso hover:bg-espresso/5 disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-espresso">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  disabled={!product.available || quantity >= 99}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-espresso/10 text-espresso hover:bg-espresso/5 disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total & Actions */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-cream-dark px-5 py-4">
                <span className="text-sm font-medium text-espresso">Total</span>
                <span className="text-xl font-bold text-espresso">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="btn-outline flex-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.available}
                  className="btn-primary flex-1"
                >
                  <Check className="h-4 w-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
