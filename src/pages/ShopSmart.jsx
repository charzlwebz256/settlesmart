import { ExternalLink, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  {
    label: '🛒 General Marketplaces',
    stores: [
      { name: 'Amazon Canada', url: 'https://www.amazon.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
      { name: 'Walmart Canada', url: 'https://www.walmart.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'eBay Canada', url: 'https://www.ebay.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Kijiji Canada', url: 'https://www.kijiji.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kijiji_logo.svg/320px-Kijiji_logo.svg.png', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'Temu Canada', url: 'https://www.temu.com/ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Temu_logo.svg/320px-Temu_logo.svg.png', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '💻 Electronics',
    stores: [
      { name: 'Best Buy Canada', url: 'https://www.bestbuy.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/320px-Best_Buy_Logo.svg.png', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'Canada Computers', url: 'https://www.canadacomputers.com', logo: null, bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'The Source', url: 'https://www.thesource.ca', logo: null, bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300' },
      { name: 'Newegg Canada', url: 'https://www.newegg.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/NewEgg_logo.svg/320px-NewEgg_logo.svg.png', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '🏠 Home Improvement & Furniture',
    stores: [
      { name: 'Home Depot Canada', url: 'https://www.homedepot.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TheHomeDepot.svg/320px-TheHomeDepot.svg.png', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
      { name: 'RONA', url: 'https://www.rona.ca', logo: null, bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'IKEA Canada', url: 'https://www.ikea.com/ca/en', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/320px-Ikea_logo.svg.png', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' },
      { name: "Leon's", url: 'https://www.leons.ca', logo: null, bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Wayfair Canada', url: 'https://www.wayfair.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wayfair_Logo.svg/320px-Wayfair_Logo.svg.png', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
    ],
  },
  {
    label: '👗 Fashion & Apparel',
    stores: [
      { name: 'Lululemon', url: 'https://shop.lululemon.com/en-ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Lululemon_Athletica_logo.svg/320px-Lululemon_Athletica_logo.svg.png', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Aritzia', url: 'https://www.aritzia.com/en/home', logo: null, bg: 'bg-zinc-50 dark:bg-zinc-800/40', border: 'border-zinc-200 dark:border-zinc-700', text: 'text-zinc-700 dark:text-zinc-300' },
      { name: 'Simons', url: 'https://www.simons.ca', logo: null, bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
      { name: "Hudson's Bay", url: 'https://www.thebay.com', logo: null, bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
      { name: 'Old Navy Canada', url: 'https://oldnavy.gapcanada.ca', logo: null, bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
    ],
  },
  {
    label: '🛍️ Groceries & Everyday Essentials',
    stores: [
      { name: 'Costco Canada', url: 'https://www.costco.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/320px-Costco_Wholesale_logo_2010-10-26.svg.png', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'Real Canadian Superstore', url: 'https://www.realcanadiansuperstore.ca', logo: null, bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Instacart Canada', url: 'https://www.instacart.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Instacart_logo_and_wordmark.svg/320px-Instacart_logo_and_wordmark.svg.png', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'Voila by Sobeys', url: 'https://www.voila.ca', logo: null, bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
    ],
  },
  {
    label: '📚 Books, Office & Gifts',
    stores: [
      { name: 'Indigo Books & Music', url: 'https://www.indigo.ca', logo: null, bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
      { name: 'Staples Canada', url: 'https://www.staples.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Staples_logo.svg/320px-Staples_logo.svg.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Etsy Canada', url: 'https://www.etsy.com/ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/320px-Etsy_logo.svg.png', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '🚗 Automotive',
    stores: [
      { name: 'Canadian Tire', url: 'https://www.canadiantire.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Canadian_Tire_logo.svg/320px-Canadian_Tire_logo.svg.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'PartSource', url: 'https://www.partsource.ca', logo: null, bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'NAPA Auto Parts', url: 'https://www.napacanada.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Napa_logo.svg/320px-Napa_logo.svg.png', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
    ],
  },
  {
    label: '💄 Beauty & Health',
    stores: [
      { name: 'Sephora Canada', url: 'https://www.sephora.com/ca/en', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sephora_logo.svg/320px-Sephora_logo.svg.png', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Shoppers Drug Mart', url: 'https://www.shoppersdrugmart.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Shoppers_Drug_Mart_logo.svg/320px-Shoppers_Drug_Mart_logo.svg.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Well.ca', url: 'https://well.ca', logo: null, bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
    ],
  },
  {
    label: '🍁 Canadian-Made Products',
    stores: [
      { name: 'Made in CA Directory', url: 'https://madeinca.ca', logo: null, bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Shop Made in Canada', url: 'https://shopmadein.ca', logo: null, bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
    ],
  },
];

function StoreCard({ store }) {
  return (
    <a
      href={store.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center justify-between gap-3 p-4 rounded-2xl border ${store.bg} ${store.border} hover:shadow-md transition-all group`}
    >
      <div className="h-10 w-full flex items-center justify-center">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
            className="max-h-8 max-w-[120px] object-contain"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
        ) : null}
        <span
          className={`font-heading font-bold text-sm text-center ${store.text} ${store.logo ? 'hidden' : ''}`}
        >
          {store.name}
        </span>
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${store.text}`}>
        {store.logo && <span className="text-center leading-tight">{store.name}</span>}
        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 flex-shrink-0" />
      </div>
    </a>
  );
}

export default function ShopSmart() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          ShopSmart Canada
        </h1>
        <p className="text-muted-foreground text-sm">Popular Canadian online shopping platforms across every category — all in one place.</p>
      </div>

      <div className="space-y-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <h2 className="font-heading font-bold text-base mb-3 text-foreground">{cat.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.stores.map(store => (
                <StoreCard key={store.name} store={store} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-card rounded-2xl border border-border/50 p-5">
        <h3 className="font-heading font-bold text-base mb-3">🛡️ Shopping Tips for Newcomers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Verify sellers</strong> — Check ratings and reviews before purchasing on marketplace sites.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Compare prices</strong> — Factor in shipping fees and delivery times across platforms.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Check return policies</strong> — Most stores have 30-day return windows; read before buying.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Shop Canadian-made</strong> — Support local businesses for quality goods and faster shipping.</span></div>
        </div>
      </div>
    </div>
  );
}