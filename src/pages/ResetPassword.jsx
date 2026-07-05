import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword: password });
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Unable to reset password. The link may have expired.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-3">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <h1 className="font-heading font-bold text-2xl">Set a new password</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose a strong password for your account</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="pl-9" disabled={loading} />
              </div>
            </div>
            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="confirm" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="pl-9" disabled={loading} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}