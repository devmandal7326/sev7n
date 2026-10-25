import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ArrowRight } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, setCurrentPage } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!settings.announcement.enabled || !settings.announcement.text || isDismissed) {
    return null;
  }

  const handleAction = () => {
    if (settings.announcement.linkUrl === '#store-location') {
      setCurrentPage('contact');
    } else {
      setCurrentPage('shop');
    }
  };

  return (
    <aside 
      aria-label="Store announcement"
      className="bg-neutral-900 border-b border-neutral-800 text-neutral-300 text-xs px-4 py-2 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center flex items-center justify-center gap-2 truncate">
          <span className="truncate">{settings.announcement.text}</span>
          {settings.announcement.linkText && (
            <button
              onClick={handleAction}
              className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-neutral-200 shrink-0 cursor-pointer ml-1"
            >
              <span>{settings.announcement.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-neutral-400 hover:text-white p-1 shrink-0 rounded transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
