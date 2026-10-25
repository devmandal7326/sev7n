import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, MapPin, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#0d0d0f] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Location & Trust Marker - Clean unboxed text with typographic separators */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Mansarovar, Jaipur</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="tabular-nums font-semibold text-white">4.9 / 5</span>
                <span className="text-neutral-500">(15 Google Reviews)</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400">Open until 10 PM</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 max-w-2xl">
              YOUR STYLE.<br />
              <span className="text-neutral-400">YOUR RULES.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Sev7n (सेव7न) brings modern streetwear and contemporary cuts to Jaipur. 
              Heavyweight boxy cottons, articulated utility cargos, and curated drops built for genuine self-expression.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm active:scale-98"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-700/80 rounded-md hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>Visit Our Store</span>
              </button>
            </div>

            {/* Key Micro Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Heavyweight Fabrics</p>
                <p className="text-neutral-400">260–450 GSM structured drape</p>
              </div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Mansarovar Hub</p>
                <p className="text-neutral-400">Trial & same-day pickup</p>
              </div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Direct WhatsApp</p>
                <p className="text-neutral-400">Fast local customer care</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Campaign Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_streetwear_editorial_1792911392703.jpg"
                alt="Sev7n contemporary streetwear models in oversized jackets and relaxed silhouettes"
                className="w-full h-[420px] sm:h-[480px] lg:h-[540px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-neutral-950/70 backdrop-blur-md border border-neutral-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Flagship Drop</span>
                  <span className="font-medium text-white">Autumn/Winter Contemporary</span>
                </div>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-3 py-1.5 bg-white text-neutral-950 font-medium rounded text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  View Lookbook
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
