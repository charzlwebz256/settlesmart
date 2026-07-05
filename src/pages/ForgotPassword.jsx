import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // ignore — show generic success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-3">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <h1 className="font-heading font-bold text-2xl">Reset your password</h1>
          <p className="text-muted-foreground text-sm mt-1">We'll send you a link to set a new password</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-6">
                If an account exists for <span className="text-foreground font-medium">{email}</span>, you'll receive a password reset email shortly.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" disabled={loading} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
              </Button>
              <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}