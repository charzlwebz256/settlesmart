import { useState } from 'react';
import { Copy, Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// The server address is resolved from the page's own origin so it is always
// correct for the domain the app is served on.
export default function ServerUrlCard() {
  const [copied, setCopied] = useState(false);
  const serverUrl = new URL('/api/mcp', window.location.origin).toString();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serverUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the address stays selectable with the mouse.
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-primary" />
        <h2 className="font-heading font-semibold text-sm">Your server address</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          readOnly
          value={serverUrl}
          onFocus={(e) => e.target.select()}
          aria-label="MCP server address"
          className="flex-1 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/40 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button onClick={copy} variant="outline" className="rounded-xl gap-2 h-11">
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Paste this into your AI assistant as a streamable HTTP MCP server.
      </p>
    </div>
  );
}