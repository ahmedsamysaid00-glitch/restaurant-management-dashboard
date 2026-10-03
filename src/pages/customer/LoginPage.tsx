import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, LogIn, User, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('Welcome back!', 'success');
      navigate(from ?? '/');
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      loginAsDemo('admin');
      showToast('Welcome, Admin!', 'success');
      navigate('/admin');
    } else {
      loginAsDemo('customer');
      showToast('Welcome back!', 'success');
      navigate(from ?? '/');
    }
  };

  return (
    <PageContainer>
      <div className="py-12 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-espresso text-cream mb-4">
            <Coffee className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-espresso">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to your Brew House account</p>
        </div>

        {/* Demo quick-fill */}
        <div className="card p-4 mb-6 bg-caramel/5 border-caramel/20">
          <p className="text-sm font-medium text-espresso mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-caramel" />
            Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="btn-outline btn-sm flex-col py-3"
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs">Customer Demo</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn-outline btn-sm flex-col py-3"
            >
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-xs">Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@brewhouse.demo"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-caramel font-medium hover:underline">
              Register here
            </Link>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link to="/admin/login" className="text-sm text-muted hover:text-espresso transition-colors">
            Admin login →
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
