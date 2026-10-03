import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function RedirectIfAdminAuthed({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
