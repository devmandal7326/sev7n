import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HeroSection } from './HeroSection';
import { FeaturedCategories } from './FeaturedCategories';
import { ProductGrid } from './ProductGrid';
import { VerifiedReviewsSection } from './VerifiedReviewsSection';
import { StoreLocationSection } from './StoreLocationSection';
import { ArrowRight, Send, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, isLoading, setCurrentPage, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter curated products for homepage
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 3);
  const trendingPieces = products.filter(p => p.trending).slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email address', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('Subscribed to Sev7n drop alerts', 'success');
  };

  return (
    <div className="bg-[#0d0d0f]">
      {/* 1. Hero Campaign */}
      <HeroSection />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. New Arrivals Showcase */}
      <section className="py-14 md:py-20 border-b border-neutral-800 bg-[#0d0d0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Fresh From Jaipur Workshop
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Explore All {products.length} Garments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ProductGrid products={newArrivals} isLoading={isLoading} />
        </div>
      </section>

      {/* 4. Brand Introduction & Craftsmanship Callout */}
      <section className="py-16 md:py-24 border-b border-neutral-800 bg-[#121216]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                Contemporary Philosophy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Streetwear Built on Weight, Drape & Integrity
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Sev7n (सेव7न) is reimagining casual fashion from our Mansarovar, Jaipur studio. 
                We move away from flimsy fast fashion by engineering clothing with substantial fabric weight — drop-shoulder tees that maintain their architectural shape and utility cargo trousers with articulated knee comfort.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-neutral-200">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Authentic Fabric Specifications</h4>
                    <p className="text-neutral-400">Combed 260 GSM single jersey cotton & 450 GSM loopback French terry.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-neutral-200">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Physical Showroom & Fitting Lounge</h4>
                    <p className="text-neutral-400">Located at 24/27 Swarn Path, Sector II, Mansarovar, Jaipur.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-neutral-200">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Direct Local Care & Fast Support</h4>
                    <p className="text-neutral-400">Instant customer support directly on WhatsApp with our store team.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Read About Sev7n
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <img
                  src="/src/assets/images/store_interior_sev7n_1792911394516.jpg"
                  alt="Sev7n Jaipur contemporary showroom clothing racks"
                  className="w-full h-[400px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Trending Streetwear Pieces */}
      <section className="py-14 md:py-20 border-b border-neutral-800 bg-[#0d0d0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Most Desired Silhouettes
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Trending in Jaipur
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Lookbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ProductGrid products={trendingPieces} isLoading={isLoading} />
        </div>
      </section>

      {/* 6. Verified Google Reviews */}
      <VerifiedReviewsSection />

      {/* 7. Store Location & Contact Desk */}
      <StoreLocationSection />

      {/* 8. Working Newsletter / Drop Alerts */}
      <section className="py-16 bg-[#101014] border-b border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
            Exclusive Releases
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Stay Ahead of the Next Drop
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Subscribe for notifications regarding limited-run oversized collections, store exclusive events, and seasonal lookbooks from Mansarovar, Jaipur.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-neutral-900 border border-emerald-800 rounded-md max-w-md mx-auto text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>You're on the list. We'll alert you on the next drop.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Notify Me</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-neutral-400">
            No spam. We respect your privacy according to our store policy.
          </p>
        </div>
      </section>

    </div>
  );
};
