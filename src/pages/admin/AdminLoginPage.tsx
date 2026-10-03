import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Shield, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';

export function AdminLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      showToast('Welcome to the admin dashboard', 'success');
      navigate(from ?? '/admin');
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('admin');
    showToast('Welcome to the admin dashboard', 'success');
    navigate(from ?? '/admin');
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-cream/10 text-cream mb-4">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-cream">Brew House Admin</h1>
          <p className="text-cream/50 mt-2 text-sm">Sign in to manage your café</p>
        </div>

        {/* Demo banner */}
        <div className="rounded-xl bg-caramel/10 border border-caramel/20 px-4 py-3 mb-6 text-center">
          <p className="text-xs text-cream/70">
            Demo Environment — Authentication is simulated and not production-grade
          </p>
        </div>

        {/* Quick login */}
        <div className="rounded-2xl bg-cream/5 border border-cream/10 p-4 mb-6">
          <p className="text-sm font-medium text-cream/80 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-caramel" />
            Demo Admin Account
          </p>
          <div className="text-xs text-cream/50 mb-3 space-y-1">
            <p>Email: admin@brewhouse.demo</p>
            <p>Password: Admin123!</p>
          </div>
          <button onClick={handleDemoLogin} className="btn-accent w-full text-sm">
            <Shield className="h-4 w-4" />
            Login as Demo Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-cream p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@brewhouse.demo"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button type="submit" className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            Sign In to Dashboard
          </button>
          <p className="text-center text-sm text-muted">
            <Link to="/login" className="text-caramel font-medium hover:underline">
              ← Customer login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
