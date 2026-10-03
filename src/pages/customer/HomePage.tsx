import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Phone, MapPin, Coffee, Award, Heart } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, ImageWithFallback } from '@/components/ui/Misc';
import { heroImage, storyImage } from '@/data/seed';
import type { Product } from '@/types';

export function HomePage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const featured = [...products].filter((p) => p.available).sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  const handleAddToCart = (product: Product) => {
    if (!product.available) return;
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroImage}
            alt="Brew House coffee shop interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/60 to-espresso/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-caramel text-sm font-medium tracking-widest uppercase mb-4 animate-slide-up">
              Premium Specialty Coffee
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight animate-slide-up">
              Every Cup Tells a Story
            </h1>
            <p className="mt-5 text-lg text-cream/80 max-w-xl leading-relaxed animate-slide-up">
              From single-origin beans to hand-crafted espresso drinks, Brew House brings you the
              finest coffee experience in the heart of Cairo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-slide-up">
              <Link to="/menu" className="btn-accent">
                Explore Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/my-orders" className="btn-outline text-cream border-cream/30 hover:bg-cream hover:text-espresso">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-espresso">Featured Favorites</h2>
              <p className="mt-2 text-muted">Our most loved drinks, loved by our customers</p>
            </div>
            <Link to="/menu" className="hidden sm:inline-flex btn-ghost text-caramel hover:bg-caramel/5">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((c) => c.id === product.categoryId)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Category Shortcuts */}
      <section className="py-12 bg-cream-dark">
        <PageContainer>
          <h2 className="text-2xl font-bold text-espresso text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/menu?category=${cat.id}`}
                className="group card p-6 text-center hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-caramel/10 text-caramel group-hover:bg-caramel group-hover:text-white transition-colors">
                  <Coffee className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-semibold text-espresso group-hover:text-caramel transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Promotional Banner */}
      <section className="py-12">
        <PageContainer>
          <div className="relative overflow-hidden rounded-3xl bg-espresso">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-caramel" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-caramel" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 sm:p-12">
              <div>
                <p className="text-caramel text-sm font-medium tracking-wide uppercase mb-2">Limited Time</p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                  Buy 2 Drinks, Get a Free Croissant
                </h2>
                <p className="mt-2 text-cream/70 text-sm max-w-md">
                  Every morning from 7 AM to 11 AM. Freshly baked daily.
                </p>
              </div>
              <Link to="/menu" className="btn-accent flex-shrink-0">
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <ImageWithFallback
                  src={storyImage}
                  alt="Brew House cafe ambiance"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-caramel text-sm font-medium tracking-wide uppercase mb-3">Our Story</p>
              <h2 className="font-serif text-3xl font-bold text-espresso">Crafted with Passion</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Brew House was born from a simple idea: that great coffee should be an experience,
                not just a drink. We source the finest beans from around the world, roast them in
                small batches, and serve them with care.
              </p>
              <p className="mt-3 text-muted leading-relaxed">
                Every cup is a testament to our commitment to quality, from the farmers who grow
                our beans to the baristas who craft your drink.
              </p>
              <div className="mt-6 flex gap-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-caramel" />
                  <span className="text-sm text-espresso font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-caramel" />
                  <span className="text-sm text-espresso font-medium">Made with Love</span>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Opening Hours & Contact */}
      <section className="py-12 bg-cream-dark">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-caramel/10 text-caramel mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-espresso">Opening Hours</h3>
              <p className="mt-1.5 text-sm text-muted">Mon–Fri: 7:00 AM – 11:00 PM</p>
              <p className="text-sm text-muted">Sat–Sun: 8:00 AM – 12:00 AM</p>
            </div>
            <div className="card p-6 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-caramel/10 text-caramel mb-3">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-espresso">Contact Us</h3>
              <p className="mt-1.5 text-sm text-muted">+20 2 1234 5678</p>
              <p className="text-sm text-muted">hello@brewhouse.demo</p>
            </div>
            <div className="card p-6 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-caramel/10 text-caramel mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-espresso">Find Us</h3>
              <p className="mt-1.5 text-sm text-muted">14 Tahrir Street, Downtown</p>
              <p className="text-sm text-muted">Cairo, Egypt</p>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
