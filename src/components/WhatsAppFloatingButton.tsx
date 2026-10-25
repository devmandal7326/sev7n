import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, X, MapPin, ShoppingBag, HelpCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { openWhatsAppChat, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-[#121216] border border-neutral-800 rounded-lg p-3.5 shadow-2xl space-y-2 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div>
              <span className="font-semibold text-white block">Sev7n WhatsApp Care</span>
              <span className="text-[10px] text-neutral-400 font-mono">+91 86198 90774</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                openWhatsAppChat('general');
                setIsOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-neutral-850 text-neutral-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>General Store Inquiry</span>
            </button>

            <button
              onClick={() => {
                openWhatsAppChat('location');
                setIsOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-neutral-850 text-neutral-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Mansarovar Store Directions</span>
            </button>

            <button
              onClick={() => {
                openWhatsAppChat('order');
                setIsOpen(false);
              }}
              className="w-full text-left p-2 rounded hover:bg-neutral-850 text-neutral-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
              <span>Check Existing Order Status</span>
            </button>
          </div>

          <p className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/80 text-center">
            Store replies daily until 10:00 PM IST
          </p>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contact Sev7n store via WhatsApp"
        title="Chat with Sev7n Jaipur on WhatsApp"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
};
