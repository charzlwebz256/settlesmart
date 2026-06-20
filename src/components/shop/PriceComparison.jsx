import { useState } from 'react';
import { TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Price tiers: $ = budget, $$ = mid, $$$ = premium, ✗ = not available
const PRICE_ITEMS = [
  {
    category: '🛒 Everyday',
    items: [
      {
        name: 'Laundry Detergent (2L)',
        prices: {
          'Walmart': { tier: '$', range: '$4–$8' },
          'Costco': { tier: '$', range: '$12–$18 (bulk)' },
          'Real Canadian Superstore': { tier: '$', range: '$5–$10' },
          'Amazon': { tier: '$$', range: '$8–$14' },
          'Shoppers Drug Mart': { tier: '$$', range: '$9–$16' },
        },
      },
      {
        name: 'Paper Towels (6-pack)',
        prices: {
          'Walmart': { tier: '$', range: '$6–$10' },
          'Costco': { tier: '$', range: '$18–$24 (bulk)' },
          'Real Canadian Superstore': { tier: '$', range: '$7–$12' },
          'Amazon': { tier: '$$', range: '$10–$15' },
          'Shoppers Drug Mart': { tier: '$$', range: '$10–$16' },
        },
      },
    ],
  },
  {
    category: '💻 Electronics',
    items: [
      {
        name: 'USB-C Charging Cable',
        prices: {
          'Amazon': { tier: '$', range: '$8–$20' },
          'Walmart': { tier: '$', range: '$10–$18' },
          'Best Buy': { tier: '$$', range: '$20–$40' },
          'Canada Computers': { tier: '$$', range: '$15–$35' },
          'Temu': { tier: '$', range: '$2–$8' },
        },
      },
      {
        name: 'Bluetooth Earbuds',
        prices: {
          'Amazon': { tier: '$$', range: '$30–$120' },
          'Walmart': { tier: '$$', range: '$25–$80' },
          'Best Buy': { tier: '$$$', range: '$50–$250' },
          'Canada Computers': { tier: '$$', range: '$40–$150' },
          'Temu': { tier: '$', range: '$10–$30' },
        },
      },
    ],
  },
  {
    category: '🏠 Home & Furniture',
    items: [
      {
        name: 'Bookshelf (5-shelf)',
        prices: {
          'IKEA': { tier: '$', range: '$60–$150' },
          "Leon's": { tier: '$$', range: '$120–$300' },
          'Wayfair': { tier: '$$', range: '$80–$250' },
          'Amazon': { tier: '$$', range: '$70–$200' },
          'Walmart': { tier: '$', range: '$50–$120' },
        },
      },
      {
        name: 'Bath Towel Set (4-pack)',
        prices: {
          'Walmart': { tier: '$', range: '$20–$40' },
          'IKEA': { tier: '$', range: '$25–$50' },
          'Hudson\'s Bay': { tier: '$$$', range: '$60–$120' },
          'Wayfair': { tier: '$$', range: '$35–$80' },
          'Amazon': { tier: '$$', range: '$30–$70' },
        },
      },
    ],
  },
  {
    category: '👗 Clothing',
    items: [
      {
        name: 'Basic T-Shirt',
        prices: {
          'Walmart': { tier: '$', range: '$5–$15' },
          'Old Navy': { tier: '$', range: '$10–$25' },
          'Simons': { tier: '$$', range: '$20–$45' },
          'Aritzia': { tier: '$$$', range: '$50–$90' },
          'Lululemon': { tier: '$$$', range: '$48–$98' },
        },
      },
      {
        name: 'Winter Jacket',
        prices: {
          'Walmart': { tier: '$', range: '$40–$80' },
          'Old Navy': { tier: '$$', range: '$80–$150' },
          'Simons': { tier: '$$', range: '$100–$200' },
          'Hudson\'s Bay': { tier: '$$$', range: '$150–$400' },
          'Aritzia': { tier: '$$$', range: '$200–$500' },
        },
      },
    ],
  },
];

const TIER_STYLES = {
  '$':   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  '$$':  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  '$$$': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function PriceComparison() {
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <TrendingDown className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-bold text-base">Price Comparison Guide</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Typical price ranges for popular items across Canadian stores. Click a category to compare.</p>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {[['$', 'Budget'], ['$$', 'Mid-range'], ['$$$', 'Premium']].map(([tier, label]) => (
          <span key={tier} className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TIER_STYLES[tier])}>
            {tier} {label}
          </span>
        ))}
      </div>

      <div className="space-y-2">
        {PRICE_ITEMS.map((cat) => {
          const isOpen = openCategory === cat.category;
          return (
            <div key={cat.category} className="rounded-xl border border-border/40 overflow-hidden">
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.category)}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-sm">{cat.category}</span>
                <span className="text-xs text-muted-foreground">{isOpen ? 'Hide' : 'Show prices'}</span>
              </button>

              {isOpen && (
                <div className="divide-y divide-border/30">
                  {cat.items.map((item) => {
                    const stores = Object.entries(item.prices);
                    const cheapest = stores.reduce((a, b) => a[1].tier <= b[1].tier ? a : b);
                    return (
                      <div key={item.name} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-3.5 h-3.5 text-primary/60" />
                          <p className="text-sm font-semibold">{item.name}</p>
                          <span className="text-[10px] text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium ml-auto">
                            Best deal: {cheapest[0]}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {stores.map(([store, data]) => (
                            <div key={store} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-1.5">
                              <span className="text-xs text-muted-foreground truncate mr-2">{store}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', TIER_STYLES[data.tier])}>
                                  {data.tier}
                                </span>
                                <span className="text-xs text-foreground font-medium">{data.range}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3">
        * Prices are approximate ranges in CAD and may vary by season, sale events, and location. Always verify current prices on store websites.
      </p>
    </div>
  );
}