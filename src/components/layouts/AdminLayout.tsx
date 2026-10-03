import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Coffee,
  Menu as MenuIcon,
  X,
  Bell,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentPageLabel = navItems.find((item) =>
    item.to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.to),
  )?.label ?? 'Dashboard';

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: i === 0 ? 'Admin' : seg.charAt(0).toUpperCase() + seg.slice(1),
      isLast: i === arr.length - 1,
    }));

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-espresso text-cream fixed inset-y-0 left-0 z-40">
        <AdminSidebarContent
          settings={settings}
          userName={user?.name ?? ''}
          navItems={navItems}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-espresso/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 bg-espresso text-cream animate-slide-in-right">
            <AdminSidebarContent
              settings={settings}
              userName={user?.name ?? ''}
              navItems={navItems}
              onLogout={handleLogout}
              onNavigate={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b border-espresso/8">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-espresso/5"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1 min-w-0">
                    {i > 0 && <ChevronRight className="h-3 w-3 text-muted flex-shrink-0" />}
                    <span
                      className={
                        crumb.isLast
                          ? 'text-espresso font-medium truncate'
                          : 'text-muted truncate'
                      }
                    >
                      {crumb.label}
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-espresso hover:bg-espresso/5 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden md:inline">View Store</span>
              </Link>
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-espresso/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-caramel"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-cream-dark px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-caramel text-white text-xs font-bold">
                  {user?.name?.charAt(0) ?? 'A'}
                </div>
                <span className="text-sm font-medium text-espresso max-w-[100px] truncate">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-espresso">{currentPageLabel}</h1>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminSidebarContent({
  settings,
  userName,
  navItems,
  onLogout,
  onNavigate,
}: {
  settings: { cafeName: string };
  userName: string;
  navItems: NavItem[];
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-cream/10 flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10">
          <Coffee className="h-4 w-4" />
        </div>
        <span className="font-serif text-lg font-bold">{settings.cafeName}</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cream/10 text-cream'
                  : 'text-cream/60 hover:bg-cream/5 hover:text-cream'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-cream/10 space-y-1">
        <div className="px-4 py-2">
          <p className="text-xs text-cream/40 mb-0.5">Signed in as</p>
          <p className="text-sm font-medium truncate">{userName}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cream/60 hover:bg-cream/5 hover:text-cream transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
