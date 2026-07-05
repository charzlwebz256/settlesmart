import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get('from') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('details'); // details | otp
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleDetails = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStage('otp');
      startCooldown();
    } catch (err) {
      setError(err.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode: otp });
      if (res?.access_token) base44.auth.setToken(res.access_token);
      window.location.href = fromUrl;
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      await base44.auth.resendOtp(email);
      startCooldown();
    } catch (err) {
      setError(err.message || 'Could not resend code.');
    }
  };

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => setResendCooldown(c => { if (c <= 1) clearInterval(t); return c - 1; }), 1000);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await base44.auth.loginWithProvider('google', fromUrl);
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
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
          <h1 className="font-heading font-bold text-2xl">{stage === 'otp' ? 'Verify your email' : 'Create your account'}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stage === 'otp' ? `We sent a code to ${email}` : 'Join SettleSmart to start your journey in Canada'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {stage === 'details' ? (
            <>
              <Button variant="outline" className="w-full mb-4" onClick={handleGoogle} disabled={loading}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
                Continue with Google
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
              </div>
              <form onSubmit={handleDetails} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" disabled={loading} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
              <p className="text-center text-sm mt-4 text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Verification code</Label>
                <Input id="otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="text-center tracking-widest text-lg" disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStage('details')} className="text-muted-foreground hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0} className="text-primary hover:underline disabled:opacity-50">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}