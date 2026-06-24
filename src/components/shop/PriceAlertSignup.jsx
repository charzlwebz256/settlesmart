import { useState } from 'react';
import { Bell, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const STORES = [
  'Walmart', 'Costco', 'Real Canadian Superstore', 'Amazon', 'Best Buy',
  'Shoppers Drug Mart', 'Canadian Tire', 'IKEA', 'Staples', 'No Frills',
];

const CATEGORIES = [
  'Groceries & Essentials', 'Electronics', 'Household & Cleaning', 'Clothing', 'Furniture & Home',
];

export default function PriceAlertSignup() {
  const [email, setEmail] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const toggle = (list, setList, item) =>
    setList(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const handleSubmit = async () => {
    if (!email || selectedStores.length === 0) {
      setError('Please enter your email and select at least one store.');
      return;
    }
    setError('');
    setSending(true);
    try {
      const storeList = selectedStores.join(', ');
      const catList = selectedCategories.length > 0 ? selectedCategories.join(', ') : 'All categories';
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: '🛒 SettleSmart Price Drop Alerts — You\'re Subscribed!',
        body: `Hi there,\n\nYou've signed up for price drop alerts on SettleSmart Canada!\n\n📦 Stores you're watching:\n${storeList}\n\n🏷️ Categories:\n${catList}\n\nWe'll notify you at this address whenever we spot significant deals or price drops at these stores for household essentials.\n\n💡 Tip: Check the ShopSmart Price Comparison Guide in the app regularly to compare current price ranges across stores.\n\nHappy saving!\n— The SettleSmart Team`,
      });
      setDone(true);
    } catch (e) {
      setError('Failed to subscribe. Please try again.');
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
          <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">We'll email <strong>{email}</strong> when deals appear at your selected stores.</p>
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

      {/* Email */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground block mb-1">Your email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>

      {/* Stores */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground block mb-2">Watch these stores (select at least one)</label>
        <div className="flex flex-wrap gap-2">
          {STORES.map(store => (
            <button
              key={store}
              onClick={() => toggle(selectedStores, setSelectedStores, store)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                selectedStores.includes(store)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/40 text-muted-foreground border-border/50 hover:border-primary/30'
              }`}
            >
              {store}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground block mb-2">Categories (optional)</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggle(selectedCategories, setSelectedCategories, cat)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                selectedCategories.includes(cat)
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-muted/40 text-muted-foreground border-border/50 hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <Button onClick={handleSubmit} disabled={sending} className="w-full rounded-xl gap-2">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
        {sending ? 'Subscribing...' : 'Notify Me of Deals'}
      </Button>
    </div>
  );
}