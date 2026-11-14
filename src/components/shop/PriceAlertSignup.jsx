import { useState } from 'react';
import { Bell, Loader2, CheckCircle, Mail, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem,
  MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue,
} from '@/components/ui/mobile-select';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const STORES = [
  'Walmart', 'Costco', 'Real Canadian Superstore', 'Amazon', 'Best Buy',
  'Shoppers Drug Mart', 'Canadian Tire', 'IKEA', 'Staples', 'No Frills', 'SHEIN',
];

const CATEGORIES = [
  'Groceries & Essentials', 'Electronics', 'Household & Cleaning', 'Clothing', 'Furniture & Home',
];

function PickerSection({ label, hint, placeholder, options, selected, onAdd, onRemove, tone }) {
  const chipTone = tone === 'accent'
    ? 'bg-accent/10 text-accent border-accent/30'
    : 'bg-primary/10 text-primary border-primary/30';

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-muted-foreground block mb-2">
        {label} {hint && <span className="text-muted-foreground/70">{hint}</span>}
      </label>
      <Select value="" onValueChange={onAdd}>
        <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((option) => !selected.includes(option))
            .map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${chipTone}`}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove ${item}`}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PriceAlertSignup() {
  const { isAuthenticated, user, requireAuth } = useAuth();
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const add = (setList) => (item) => setList((prev) => (prev.includes(item) ? prev : [...prev, item]));
  const remove = (setList) => (item) => setList((prev) => prev.filter((x) => x !== item));

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    if (selectedStores.length === 0) {
      setError('Please select at least one store.');
      return;
    }
    setError('');
    setSending(true);
    try {
      const { data } = await base44.functions.invoke('sendPriceAlert', {
        stores: selectedStores,
        categories: selectedCategories,
      });
      if (data?.error) throw new Error(data.error);
      setDone(true);
    } catch (e) {
      setError(e?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-8 flex items-center gap-4">
        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-heading font-bold text-sm text-green-800 dark:text-green-300">You're subscribed! 🎉</p>
          <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">We'll email <strong>{user?.email}</strong> when deals appear at your selected stores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-bold text-base">Price Drop Alerts</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Get emailed when deals drop for household essentials at your favourite stores.</p>

      {/* Recipient is always the signed-in account email */}
      <div className="mb-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Alerts go to <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
            <p className="text-xs text-muted-foreground mb-2">
              Sign in to set alerts. We email the address on your account, never a typed one.
            </p>
            <Button size="sm" onClick={requireAuth} className="rounded-lg gap-1.5 h-8 text-xs">
              <LogIn className="w-3.5 h-3.5" /> Sign in
            </Button>
          </div>
        )}
      </div>

      <PickerSection
        label="Watch these stores"
        hint="(pick at least one)"
        placeholder="Choose a store"
        options={STORES}
        selected={selectedStores}
        onAdd={add(setSelectedStores)}
        onRemove={remove(setSelectedStores)}
      />

      <PickerSection
        label="Categories"
        hint="(optional)"
        placeholder="Choose a category"
        options={CATEGORIES}
        selected={selectedCategories}
        onAdd={add(setSelectedCategories)}
        onRemove={remove(setSelectedCategories)}
        tone="accent"
      />

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <Button onClick={handleSubmit} disabled={sending} className="w-full rounded-xl gap-2">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
        {sending ? 'Subscribing...' : isAuthenticated ? 'Notify Me of Deals' : 'Sign in to get alerts'}
      </Button>
    </div>
  );
}