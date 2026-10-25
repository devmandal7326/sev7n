import React from 'react';
import { useStore, PolicyKey } from '../context/StoreContext';
import { MapPin, Phone, Clock, Star, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setActivePolicyTab, settings, openWhatsAppChat } = useStore();

  const handlePolicyNav = (tab: PolicyKey) => {
    setActivePolicyTab(tab);
    setCurrentPage('policies');
  };

  return (
    <footer className="bg-[#09090b] text-neutral-400 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info & Address (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-white">
                SEV7N
              </span>
              <span className="text-xs text-neutral-400 font-medium tracking-wider">
                (सेव7न)
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Contemporary streetwear brand in Mansarovar, Jaipur. Focused on heavyweight boxy tees, utility cargos, and curated drops.
            </p>

            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-mono text-neutral-300">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Open daily until {settings.closingTime} IST</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-neutral-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">4.9 / 5 Rating</span>
              <span>· 15 Verified Google Reviews</span>
            </div>
          </div>

          {/* Catalog Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Collection
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Oversized Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cargos & Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hoodies & Fleece
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contemporary Jackets
                </button>
              </li>
            </ul>
          </div>

          {/* Store Experience (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Store & Info
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Ethos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mansarovar Store
                </button>
              </li>
              <li>
                <a
                  href={settings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Google Directions</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => openWhatsAppChat('general')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  WhatsApp Care
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Customer Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handlePolicyNav('shipping')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyNav('returns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Returns & Size Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyNav('cancellation')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyNav('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyNav('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} Sev7n (सेव7न). All rights reserved. Registered clothing brand in Jaipur, Rajasthan.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('admin')}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
