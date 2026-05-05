import { ExternalLink, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platforms = [
  {
    name: 'Amazon.ca',
    description: 'Canada\'s largest online shopping platform with millions of products, fast delivery options, and reliable customer service.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    url: 'https://www.amazon.ca/',
    features: ['Free & Prime shipping', 'Returns policy', 'Customer reviews', 'Canadian seller support'],
    color: 'bg-orange-500/10 text-orange-600 border-orange-200',
  },
  {
    name: 'eBay.ca',
    description: 'Marketplace for new and used items from trusted sellers across Canada and worldwide, with competitive pricing.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
    url: 'https://www.ebay.ca/',
    features: ['Auctions & fixed price', 'Seller ratings', 'Buyer protection', 'Free returns on many items'],
    color: 'bg-red-500/10 text-red-600 border-red-200',
  },
];

export default function ShopSmart() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-600" />
          Shop Smart Online
        </h1>
        <p className="text-muted-foreground text-sm">Access trusted Canadian shopping platforms with convenient home delivery, competitive prices, and buyer protection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform, i) => (
          <div key={i} className={`rounded-2xl border p-6 flex flex-col gap-4 ${platform.color}`}>
            {/* Logo */}
            <img
              src={platform.logo}
              alt={platform.name}
              className="h-8 object-contain"
              onError={e => e.target.style.display = 'none'}
            />

            {/* Title & Description */}
            <div>
              <h2 className="font-heading font-bold text-lg mb-2">{platform.name}</h2>
              <p className="text-sm leading-relaxed opacity-90">{platform.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Key Features:</p>
              <ul className="space-y-1.5">
                {platform.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <a href={platform.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
              <Button className="w-full rounded-xl gap-2" variant="default">
                Visit {platform.name}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-12 bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h3 className="font-heading font-bold text-lg">Shopping Tips for Newcomers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-primary">✓</span> Verify Seller Info
            </h4>
            <p className="text-sm text-muted-foreground">Always check seller ratings and reviews before making purchases, especially on eBay.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-primary">✓</span> Shipping Costs
            </h4>
            <p className="text-sm text-muted-foreground">Factor in shipping fees and delivery times when comparing prices across platforms.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-primary">✓</span> Check Return Policy
            </h4>
            <p className="text-sm text-muted-foreground">Read return policies carefully before purchasing — most items have 30-day return windows.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-primary">✓</span> Use Secure Payment
            </h4>
            <p className="text-sm text-muted-foreground">Both platforms use encrypted payment systems — your financial information is protected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}