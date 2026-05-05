import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'support@settlesmart.ca',
      subject: `Contact Form: Message from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Contact SettleSmart Canada
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Have a question, feedback, or want to suggest a resource? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Methods */}
          <div className="space-y-4">
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <h2 className="font-heading font-bold text-base mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Us
              </h2>
              <a
                href="mailto:support@settlesmart.ca"
                className="text-primary font-medium hover:underline text-sm"
              >
                support@settlesmart.ca
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                We typically respond within 1–2 business days.
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <h2 className="font-heading font-bold text-base mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Based in Canada
              </h2>
              <p className="text-sm text-muted-foreground">
                Serving newcomers across all provinces and territories in Canada. 🍁
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <h2 className="font-heading font-bold text-base mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                Emergency Resources
              </h2>
              <p className="text-xs text-muted-foreground mb-2">
                For urgent settlement needs, please contact:
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li><span className="font-semibold text-foreground">911</span> — Police, Fire, Ambulance</li>
                <li><span className="font-semibold text-foreground">211</span> — Social Services Helpline</li>
                <li><span className="font-semibold text-foreground">1-800-O-Canada</span> — Government Info</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Send a Message
            </h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="font-semibold text-base">Message Sent!</p>
                <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl mt-2"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Name</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ahmed Al-Hassan"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}