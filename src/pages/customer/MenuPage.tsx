import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, EmptyState } from '@/components/ui/Misc';
import { Select } from '@/components/ui/Input';
import type { Product } from '@/types';

type SortOption = 'popularity' | 'price-low' | 'price-high';

export function MenuPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    return result;
  }, [products, search, selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (!product.available) return;
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  const hasFilters = search.trim() || selectedCategory !== 'all';
  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSearchParams({});
  };

  return (
    <div className="py-8">
      <PageContainer>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-espresso">Our Menu</h1>
          <p className="mt-2 text-muted">Discover our full selection of coffee, tea, pastries, and desserts</p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
              aria-label="Search products"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-espresso"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="sm:w-56">
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} aria-label="Sort products">
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-espresso text-cream'
                : 'bg-white text-espresso border border-espresso/10 hover:border-espresso/20'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-espresso text-cream'
                  : 'bg-white text-espresso border border-espresso/10 hover:border-espresso/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
          {hasFilters && (
            <button onClick={resetFilters} className="text-sm text-caramel hover:underline flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((c) => c.id === product.categoryId)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="No products found"
            message="Try adjusting your search or filters to find what you're looking for."
            action={
              <button onClick={resetFilters} className="btn-outline btn-sm">
                Reset filters
              </button>
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
