import { Link } from 'react-router-dom';
import { Plus, Coffee } from 'lucide-react';
import type { Product, Category } from '@/types';
import { ImageWithFallback } from './ui/Misc';
import { formatPrice } from '@/lib/calculations';

interface ProductCardProps {
  product: Product;
  category?: Category;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, category, onAddToCart }: ProductCardProps) {
  return (
    <div className="group card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-espresso/50 flex items-center justify-center">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-espresso">
              Unavailable
            </span>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-espresso">
            {category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-espresso group-hover:text-caramel transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted line-clamp-2 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-espresso">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.available}
            className="btn-accent btn-sm"
            aria-label={`Add ${product.name} to cart`}
            title={product.available ? 'Add to cart' : 'Currently unavailable'}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  return <Coffee className={className} />;
}
