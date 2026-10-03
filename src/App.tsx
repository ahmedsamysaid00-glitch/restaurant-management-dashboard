import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { OrderProvider, useOrders } from '@/context/OrderContext';
import { CustomerProvider } from '@/context/CustomerContext';

import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { RequireAuth, RequireAdmin, RedirectIfAuthed, RedirectIfAdminAuthed } from '@/components/guards/RouteGuards';

import { HomePage } from '@/pages/customer/HomePage';
import { MenuPage } from '@/pages/customer/MenuPage';
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage';
import { CartPage } from '@/pages/customer/CartPage';
import { CheckoutPage } from '@/pages/customer/CheckoutPage';
import { MyOrdersPage } from '@/pages/customer/MyOrdersPage';
import { OrderDetailPage } from '@/pages/customer/OrderDetailPage';
import { ProfilePage } from '@/pages/customer/ProfilePage';
import { LoginPage } from '@/pages/customer/LoginPage';
import { RegisterPage } from '@/pages/customer/RegisterPage';
import { TrackOrderPage } from '@/pages/customer/TrackOrderPage';

import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <ProductProvider>
            <CategoryProvider>
              <CartProvider>
                <OrderProvider>
                  <CustomerProviderWithOrders>
                    {children}
                  </CustomerProviderWithOrders>
                </OrderProvider>
              </CartProvider>
            </CategoryProvider>
          </ProductProvider>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

function CustomerProviderWithOrders({ children }: { children: React.ReactNode }) {
  const { orders } = useOrders();
  return <CustomerProvider allOrders={orders}>{children}</CustomerProvider>;
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/track-order/:orderNumber" element={<TrackOrderPage />} />
            <Route
              path="/my-orders"
              element={
                <RequireAuth>
                  <MyOrdersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my-orders/:orderNumber"
              element={
                <RequireAuth>
                  <OrderDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <LoginPage />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfAuthed>
                  <RegisterPage />
                </RedirectIfAuthed>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={
              <RedirectIfAdminAuthed>
                <AdminLoginPage />
              </RedirectIfAdminAuthed>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
