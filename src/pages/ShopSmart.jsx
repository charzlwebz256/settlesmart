import { ExternalLink, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  {
    label: '🛒 General Marketplaces',
    stores: [
      { name: 'Amazon Canada', url: 'https://www.amazon.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', logoFit: 'contain', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
      { name: 'Walmart Canada', url: 'https://www.walmart.ca', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXqR1i07MgglXVrv-cWoR9TEEG2mOWJY8vJElGH0vVH5THOELNydaZ6r4j&s=10', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'eBay Canada', url: 'https://www.ebay.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg', logoFit: 'contain', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Kijiji Canada', url: 'https://www.kijiji.ca', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShYoLy5s-mhjg_m8y5mJRdYEOEI2DTRTTixTxnSIFqPQ&s=10', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'Temu Canada', url: 'https://www.temu.com/ca', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOVFv40vabVYeuM_RFVa2-MJDeQeDDEyckGeTGv_u7K-fOVrB_KVK0rQGh&s=10', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '💻 Electronics',
    stores: [
      { name: 'Best Buy Canada', url: 'https://www.bestbuy.ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Best_Buy_logo_2018.svg', logoFit: 'contain', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'Canada Computers', url: 'https://www.canadacomputers.com', logo: 'https://miro.medium.com/v2/resize:fit:1400/1*DK3IZ2JtErlA6_EnGvmSrw.png', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'The Source', url: 'https://www.thesource.ca', logo: 'https://discovergrandforks.ca/wp-content/uploads/348s.jpg', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300' },
      { name: 'Newegg Canada', url: 'https://www.newegg.ca', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL0TqXswBhWTvmN3FhRuVUIlnNVSdokhGn3gdSpSZXpk3pUKCaUxia-P8&s=10', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '🏠 Home Improvement & Furniture',
    stores: [
      { name: 'Home Depot Canada', url: 'https://www.homedepot.ca', logo: 'https://blog.logomyway.com/wp-content/uploads/2022/01/home-depot-logo.png', logoFit: 'contain', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
      { name: 'RONA', url: 'https://www.rona.ca', logo: 'https://www.vmcdn.ca/f/files/elorafergustoday/images/business-listings/_logo_rona_elorafergus_1500x600_clp.jpg', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'IKEA Canada', url: 'https://www.ikea.com/ca/en', logo: 'https://mma.prnewswire.com/media/2058195/IKEA_Canada_IKEA_named_one_of_Canada_s_Greenest_Employers_for_it.jpg?p=facebook', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' },
      { name: "Leon's", url: 'https://www.leons.ca', logo: 'https://images.squarespace-cdn.com/content/v1/5e9901ef8a3476717a295443/1587086075484-6040XGCSYPG6PH3WXY41/Leon_s_Logo_ellipse.png', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Wayfair Canada', url: 'https://www.wayfair.ca', logo: 'https://assets.wfcdn.com/im/52964026/resize-h360-w672%5Ecompr-r85/3143/314310074/default_name.jpg', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
    ],
  },
  {
    label: '👗 Fashion & Apparel',
    stores: [
      { name: 'Lululemon', url: 'https://shop.lululemon.com/en-ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lululemon_Athletica_logo.svg/1280px-Lululemon_Athletica_logo.svg.png', logoFit: 'contain', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Aritzia', url: 'https://www.aritzia.com/en/home', logo: 'https://download.logo.wine/logo/Aritzia/Aritzia-Logo.wine.png', bg: 'bg-zinc-50 dark:bg-zinc-800/40', border: 'border-zinc-200 dark:border-zinc-700', text: 'text-zinc-700 dark:text-zinc-300' },
      { name: 'Simons', url: 'https://www.simons.ca', logo: 'https://www.wem.ca/media/2906/simons-weblogo-color.png?mode=pad&width=600&height=600&rnd=134175280507730000', bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
      { name: "Hudson's Bay", url: 'https://www.thebay.com', logo: 'https://mms.businesswire.com/media/20210322005442/en/866099/5/HB_Stripes_EN_%284%29_highres.jpg?download=1', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
      { name: 'Old Navy Canada', url: 'https://oldnavy.gapcanada.ca', logo: 'https://mallmaverick.imgix.net/web/property_managers/27/properties/244/all/20220214213158/Old-Navy.png', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
    ],
  },
  {
    label: '🛍️ Groceries & Everyday Essentials',
    stores: [
      { name: 'Costco Canada', url: 'https://www.costco.ca', logo: 'https://media.licdn.com/dms/image/v2/D560BAQGQmFDCGS_Xaw/company-logo_200_200/B56ZTiHrjyGsAI-/0/1738960452152/costco_wholesale_canada_logo?e=2147483647&v=beta&t=o1JunB7g7GQBaOmHYEc0HEnRkmNF3oQdYcc5eUf3C5I', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
      { name: 'Real Canadian Superstore', url: 'https://www.realcanadiansuperstore.ca', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Real_Canadian_Superstore_logo.svg/3840px-Real_Canadian_Superstore_logo.svg.png', logoFit: 'contain', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Instacart Canada', url: 'https://www.instacart.ca', logo: 'https://logos-world.net/wp-content/uploads/2022/02/Instacart-Logo.png', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
      { name: 'Voila by Sobeys', url: 'https://www.voila.ca', logo: 'https://finofinefoods.com/wp-content/uploads/2025/09/voila-scaled.png', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
    ],
  },
  {
    label: '📚 Books, Office & Gifts',
    stores: [
      { name: 'Indigo Books & Music', url: 'https://www.indigo.ca', logo: 'https://yt3.googleusercontent.com/4n3UKCp8vWiZNUySTQ4OkUqf40gcAxW6Yi3kRFQX9GPTPtTaL82ckw7vSjs79vfW3oI9hj2c2g=s900-c-k-c0x00ffffff-no-rj', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
      { name: 'Staples Canada', url: 'https://www.staples.ca', logo: 'https://1000logos.net/wp-content/uploads/2022/03/Staples-Logo.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Etsy Canada', url: 'https://www.etsy.com/ca', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/1280px-Etsy_logo.svg.png', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
    ],
  },
  {
    label: '🚗 Automotive',
    stores: [
      { name: 'Canadian Tire', url: 'https://www.canadiantire.ca', logo: 'https://corp.canadiantire.ca/files/images/brands-overview/2022/06/CT-Brandmark-Standard-Secondary-RGW-POS-RGB.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'PartSource', url: 'https://www.partsource.ca', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZU3gZqv_-njqJnp3B7He3_QJ0KbMX_yuP7YOkGXWPQKWmBu8fPX7AjaU&s=10', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'NAPA Auto Parts', url: 'https://www.napacanada.com', logo: 'https://s19538.pcdn.co/wp-content/uploads/2022/02/NAPA-2022-logo.jpg', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
    ],
  },
  {
    label: '💄 Beauty & Health',
    stores: [
      { name: 'Sephora Canada', url: 'https://www.sephora.com/ca/en', logo: 'https://www.wem.ca/media/2900/sephora-web-logo.png?mode=pad&width=600&height=600&rnd=134175274434670000', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300' },
      { name: 'Shoppers Drug Mart', url: 'https://www.shoppersdrugmart.ca', logo: 'https://www.piccadillymall.com/media/v1/462/2023/02/shoppers-logo-1.png', logoFit: 'contain', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
      { name: 'Well.ca', url: 'https://well.ca', logo: 'https://media.licdn.com/dms/image/v2/C510BAQHTjHdWum1cbA/company-logo_200_200/company-logo_200_200/0/1631392013530?e=2147483647&v=beta&t=0j3vQCDGcqPUZocOZKV-oCJk3L2rZJPy4Lmv8SFWmHc', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300' },
    ],
  },
  {
    label: '🍁 Canadian-Made Products',
    stores: [
      { name: 'Made in CA Directory', url: 'https://madeinca.ca', logo: 'https://madeinca.ca/wp-content/uploads/2025/02/Featured-Made-in-CA-300x300.png', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
    ],
  },
];

function StoreCard({ store, index }) {
  const imgFit = store.logoFit === 'contain' ? 'object-contain p-2' : 'object-cover';
  return (
    <a
      href={store.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 50}ms` }}
      className={`flex flex-col items-center justify-between gap-2 p-2 rounded-2xl border ${store.bg} ${store.border} hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-200 group animate-fade-in`}
    >
      {/* Logo area — landscape fill */}
      <div className="w-full aspect-[16/7] flex items-center justify-center overflow-hidden rounded-xl bg-white/60 dark:bg-white/10">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
            className={`w-full h-full ${imgFit}`}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <span
          className={`font-heading font-bold text-sm text-center leading-tight px-2 ${store.text} ${store.logo ? 'hidden' : 'flex items-center justify-center w-full h-full'}`}
        >
          {store.name}
        </span>
      </div>
      {/* Label */}
      <div className={`flex items-center gap-1 text-xs font-semibold ${store.text} w-full justify-center pb-1`}>
        <span className="text-center leading-tight truncate">{store.name}</span>
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
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
              {cat.stores.map((store, i) => (
                <StoreCard key={store.name} store={store} index={i} />
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