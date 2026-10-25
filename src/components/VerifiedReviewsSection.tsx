import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';

export const VerifiedReviewsSection: React.FC = () => {
  return (
    <section className="py-14 md:py-20 bg-[#121216] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rating Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Store Feedback</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
              Rated 4.9 / 5 on Google Maps
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Based on 15 verified local reviews from shoppers in Mansarovar, Jaipur.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-lg self-start md:self-auto">
            <div className="text-3xl font-extrabold text-white tabular-nums">4.9</div>
            <div>
              <div className="flex text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                15 Google reviews · Mansarovar Hub
              </span>
            </div>
          </div>
        </div>

        {/* Highlighted Verified Feedback Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-lg bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                "One of the best contemporary clothing spots in Mansarovar. The heavyweight oversized t-shirts have remarkable fabric weight and perfect boxy drape."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Local Shopper</span>
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-neutral-400" />
                Jaipur, Rajasthan
              </span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                "Clean store layout, polite staff, and genuine quality apparel. Great fitting on their cargo trousers. Visiting again soon."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Verified Customer</span>
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-neutral-400" />
                Mansarovar Sector II
              </span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                "Direct WhatsApp response was very quick when I asked for my size before visiting the store. Seamless in-store trial experience."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Store Visitor</span>
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-neutral-400" />
                Jaipur Store
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
