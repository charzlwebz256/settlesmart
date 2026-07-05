import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft, Lock } from 'lucide-react';

export default function ProtectedSignInPrompt() {
  const navigate = useNavigate();
  const { navigateToLogin } = useAuth();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h2 className="font-heading font-bold text-2xl mb-2">Sign in required</h2>
      <p className="text-muted-foreground text-sm mb-7 max-w-sm mx-auto leading-relaxed">
        You can browse SettleSmart freely, but this section needs a free account
        so we can save your personal progress and saved items.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button variant="outline" onClick={goBack} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <Button onClick={navigateToLogin} className="gap-2 rounded-xl">
          <LogIn className="w-4 h-4" /> Sign In
        </Button>
      </div>
    </div>
  );
}