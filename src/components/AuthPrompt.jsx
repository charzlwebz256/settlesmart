import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { playBeep } from '@/lib/beep';

export default function AuthPrompt() {
  const { authPromptOpen, dismissAuthPrompt, navigateToLogin } = useAuth();

  // Play a short beep the moment a sign-in is requested
  useEffect(() => {
    if (authPromptOpen) playBeep();
  }, [authPromptOpen]);

  return (
    <Dialog open={authPromptOpen} onOpenChange={(open) => { if (!open) dismissAuthPrompt(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-primary" />
            Sign in to continue
          </DialogTitle>
          <DialogDescription>
            You can browse SettleSmart freely, but saving opportunities, applying,
            and tracking your progress require a free account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button variant="outline" onClick={dismissAuthPrompt}>
            Keep browsing
          </Button>
          <Button
            onClick={() => { dismissAuthPrompt(); navigateToLogin(); }}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}