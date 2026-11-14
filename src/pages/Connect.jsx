import { Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import ServerUrlCard from '@/components/connect/ServerUrlCard';
import ClientInstructions from '@/components/connect/ClientInstructions';

export default function Connect() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <div className="mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1.5">Connect your AI assistant</h1>
        <p className="text-muted-foreground text-sm">
          Point Claude, ChatGPT or Cursor at SettleSmart and it can look up your saved information and
          take actions in the app for you, inside your normal chat.
        </p>
      </div>

      <div className="space-y-4">
        <ServerUrlCard />
        <ClientInstructions />

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
          <div className="flex gap-3">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-semibold text-sm mb-1">You approve the access</h3>
              <p className="text-sm text-muted-foreground">
                The first time an assistant connects, it opens a page here where you sign in to your own
                SettleSmart account and approve. The assistant only ever acts as you, with your
                permissions — deny it and nothing is shared.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-semibold text-sm mb-1">After the app changes</h3>
              <p className="text-sm text-muted-foreground">
                Assistants remember the list of tools they were given. When SettleSmart ships changes,
                refresh or reconnect the connector in your assistant so it picks up the new tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}