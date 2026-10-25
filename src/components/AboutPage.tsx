import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Phone } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, settings, openWhatsAppChat, goBack } = useStore();

  return (
    <div className="bg-[#0d0d0f] min-h-screen py-10 md:py-16 text-neutral-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => goBack()}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Go back to previous step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
            Brand Ethos
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Sev7n (सेव7न)
          </h1>
          <p className="text-lg text-neutral-300 font-medium">
            YOUR STYLE. YOUR RULES.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Located in Mansarovar, Jaipur, Sev7n is an independent contemporary fashion destination dedicated to refined streetwear silhouettes, heavy natural textiles, and effortless personal style.
          </p>
        </div>

        {/* Visual Showcase */}
        <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
          <img
            src="/src/assets/images/store_interior_sev7n_1792911394516.jpg"
            alt="Sev7n Jaipur flagship retail space interior"
            className="w-full h-80 sm:h-96 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Flagship Destination</span>
              <span className="font-bold text-white text-sm">24/27 Swarn Path, Sector II, Mansarovar, Jaipur</span>
            </div>
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-4 py-2 bg-white text-neutral-950 font-semibold rounded hover:bg-neutral-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Get Directions
            </button>
          </div>
        </div>

        {/* Narrative Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Intentional Silhouettes
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We design and curate garments with deliberate proportions — dropped shoulders, relaxed straight falls, and articulated tailoring that flatter natural movement without feeling oversized by accident.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Substantial Textiles
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              From 260 GSM acid-washed combed cotton tees to 450 GSM French terry loopback hoodies and rugged twill cargos, our focus remains on tactile hand-feel and long-lasting garment structure.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Rooted in Jaipur
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Operating our physical store in Mansarovar allows us to maintain direct relationships with our shoppers. Try garments in-store, consult on fits, or pick up online orders on the same day.
            </p>
          </div>

        </div>

        {/* Visit Call to Action Banner */}
        <div className="p-8 rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-display text-xl font-bold text-white">
              Visit our Mansarovar Outlet
            </h3>
            <p className="text-xs text-neutral-400 max-w-md">
              Open daily until 10:00 PM. Our team is available to assist with custom styling and size trials.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Store Address & Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openWhatsAppChat('general')}
              className="px-5 py-2.5 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800 rounded hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
