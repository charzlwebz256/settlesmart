import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { extractContacts } from '@/lib/nexaLinks';
import { Building2, Check, Copy, Globe, Loader2, Mail, MapPin, Phone } from 'lucide-react';

// The organisations Nexa named, with their contact details, ready to be sent.
export default function NexaContactCard({ messages = [] }) {
  const { isAuthenticated, user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const contacts = extractContacts(messages);

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
    const text = contacts
      .map((contact) =>
        [contact.name, contact.phone?.label, contact.website?.href, contact.address?.label]
          .filter(Boolean)
          .join(' · ')
      )
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      setError('Your browser would not let Nexa copy that. Select the details and copy them yourself.');
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

      <div className="max-h-72 space-y-2.5 overflow-y-auto p-3">
        {contacts.length === 0 ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            When Nexa gives you an organisation&apos;s phone number, address or website, it appears here so she can
            send it to you.
          </p>
        ) : (
          contacts.map((contact) => (
            <div key={`${contact.name}-${contact.website?.href || contact.phone?.href}`} className="space-y-1">
              <p className="text-xs font-semibold leading-snug text-foreground">{contact.name}</p>
              {contact.phone && (
                <a
                  href={contact.phone.href}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-primary"
                >
                  <Phone className="h-3 w-3" /> {contact.phone.label}
                </a>
              )}
              {contact.address && (
                <a
                  href={contact.address.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 text-[11px] text-foreground"
                >
                  <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" /> {contact.address.label}
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 text-[11px] text-primary underline"
                >
                  <Globe className="mt-0.5 h-3 w-3 flex-shrink-0" /> {contact.website.label}
                </a>
              )}
            </div>
          ))
        )}
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