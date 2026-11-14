import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ExternalLink, Loader2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Opens a shopping platform inside SettleSmart instead of a new window.
 * Many stores refuse to be framed, so a "blocked" state offers the direct link.
 */
export default function StoreViewer({ store, onClose }) {
  const [state, setState] = useState('loading');

  // A store that refuses framing never fires load, so give it a few seconds.
  useEffect(() => {
    if (!store) return undefined;
    setState('loading');
    const t = setTimeout(() => setState((s) => (s === 'loading' ? 'blocked' : s)), 5000);
    return () => clearTimeout(t);
  }, [store?.url]);

  // Keep the page behind from scrolling only while a store is open.
  useEffect(() => {
    if (!store) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [store]);

  if (!store) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      <div className="safe-top flex items-center gap-2 border-b border-border/60 bg-card px-3 py-2 shadow-sm">
        <Button onClick={onClose} className="rounded-xl gap-1.5 h-9 px-3 text-xs font-bold">
          <ArrowLeft className="h-4 w-4" />
          Back to ShopSmart
        </Button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-xs font-semibold text-foreground">{store.name}</p>
        </div>
        <a
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${store.name} in a new tab`}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="relative flex-1 overflow-hidden bg-muted/30">
        <iframe
          src={store.url}
          title={store.name}
          onLoad={() => setState('ready')}
          allow="payment; clipboard-write"
          className="h-full w-full border-0 bg-background"
        />

        {state === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Opening {store.name}…</p>
          </div>
        )}

        {state === 'blocked' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background p-6">
            <div className="max-w-sm rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </span>
              <p className="font-heading text-sm font-bold">{store.name} opens in its own window</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                This store does not allow being shown inside another site. Use the button below, then come
                back to ShopSmart with the back button.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="rounded-xl gap-1.5">
                  <a href={store.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Visit {store.name}
                  </a>
                </Button>
                <Button variant="outline" onClick={onClose} className="rounded-xl gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Back to ShopSmart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}