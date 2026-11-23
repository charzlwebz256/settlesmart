import { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { extractContacts } from '@/lib/nexaLinks';
import { Building2, Check, Copy, Loader2, Mail } from 'lucide-react';

function formatEntry(contact) {
  return [
    contact.name,
    contact.website && `Website: ${contact.website.href}`,
    contact.phone && `Phone: ${contact.phone.label}`,
    contact.address && `Address: ${contact.address.label}`,
    contact.hours && `Hours: ${contact.hours}`,
  ]
    .filter(Boolean)
    .join('\n');
}

// A blank space Nexa fills with the contact details she gives, ready to be sent.
export default function NexaContactCard({ messages = [] }) {
  const { isAuthenticated, user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const contacts = useMemo(() => extractContacts(messages), [messages]);
  const text = contacts.map(formatEntry).join('\n\n');

  const send = async () => {
    setSending(true);
    setError(null);
    setSentTo('');
    try {
      const res = await base44.functions.invoke('emailNexaContacts', { contacts });
      if (!res?.data?.sent) throw new Error('Not sent');
      setSentTo(res.data.to || 'your email');
    } catch (_err) {
      setError('Nexa could not send that just now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      setError('Your browser would not let Nexa copy that. Select the text and copy it yourself.');
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center gap-1.5 border-b border-border/50 px-3 py-2">
        <Building2 className="h-3.5 w-3.5 text-primary" />
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Contacts Nexa found
        </p>
      </div>

      <div className="p-3">
        <textarea
          readOnly
          value={text}
          aria-label="Contacts Nexa found"
          placeholder="This space stays empty until Nexa gives you an organisation's website, phone number, address, location or opening hours. She writes them here as she answers."
          className="h-44 w-full resize-none rounded-xl border border-border/50 bg-secondary/40 p-2.5 text-[11px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-1.5 border-t border-border/50 p-3">
        {sentTo ? (
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <Check className="h-3.5 w-3.5" /> Sent to {sentTo}
          </p>
        ) : (
          <Button
            size="sm"
            onClick={send}
            disabled={sending || contacts.length === 0 || !isAuthenticated}
            className="h-8 w-full gap-1.5 rounded-lg px-2.5 text-xs"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
            Send to my email
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={copy}
          disabled={contacts.length === 0}
          className="h-8 w-full gap-1.5 rounded-lg px-2.5 text-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy the details'}
        </Button>
        {!isAuthenticated ? (
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Sign in and Nexa can email these details to you.
          </p>
        ) : (
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Nexa sends them to {user?.email || 'your account email'}.
          </p>
        )}
        {error && <p className="text-[10px] leading-relaxed text-destructive">{error}</p>}
      </div>
    </div>
  );
}