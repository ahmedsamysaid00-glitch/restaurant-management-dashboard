import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { PageContainer } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = register(name, email, password, phone || undefined);
    setLoading(false);
    if (result.success) {
      showToast('Account created! Welcome to Brew House.', 'success');
      navigate('/');
    } else {
      setError(result.error ?? 'Registration failed.');
    }
  };

  return (
    <PageContainer>
      <div className="py-12 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-espresso text-cream mb-4">
            <Coffee className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-espresso">Create Account</h1>
          <p className="text-muted mt-2">Join Brew House and start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          <Input label="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 1XX XXX XXXX" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-caramel font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
