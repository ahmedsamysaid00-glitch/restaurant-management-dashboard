import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingBag, User, LogOut, Menu as MenuIcon, X, Home, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

export function CustomerLayout() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/menu', label: 'Menu', icon: Coffee },
    { to: '/track-order', label: 'Track Order', icon: Search },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Demo Environment Banner */}
      <div className="bg-caramel text-white text-center text-xs py-1.5 px-4 font-medium">
        Demo Environment — Authentication and payments are simulated for portfolio demonstration
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-espresso/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-cream">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-espresso hidden sm:inline">
                {settings.cafeName}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-espresso text-cream'
                        : 'text-espresso hover:bg-espresso/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-espresso/5 transition-colors"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel text-white text-[10px] font-bold px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth controls */}
              {isAuthenticated && !isAdmin ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-espresso hover:bg-espresso/5 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-espresso/5 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <Link to="/login" className="hidden md:inline-flex btn-primary btn-sm">
                  Sign In
                </Link>
              ) : null}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-espresso/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-espresso/8 bg-cream animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-espresso text-cream' : 'text-espresso hover:bg-espresso/5'
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-espresso/8 my-2"></div>
              {isAuthenticated && !isAdmin ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-espresso hover:bg-espresso/5"
                  >
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-espresso hover:bg-espresso/5"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-espresso text-cream"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              ) : null}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10">
                <Coffee className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold">{settings.cafeName}</span>
            </div>
            <p className="text-sm text-cream/60 max-w-xs">
              Premium specialty coffee, crafted with passion. From bean to cup, every detail matters.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-cream/80">Quick Links</h3>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><Link to="/" className="hover:text-cream transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-cream transition-colors">Menu</Link></li>
              <li><Link to="/track-order" className="hover:text-cream transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-cream/80">Visit Us</h3>
            <ul className="space-y-2 text-sm text-cream/60">
              <li>{settings.address}</li>
              <li>{settings.contactPhone}</li>
              <li className="text-xs">{settings.openingHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/10 text-center text-xs text-cream/40">
          © {new Date().getFullYear()} {settings.cafeName}. Demo project for portfolio purposes.
        </div>
      </div>
    </footer>
  );
}
