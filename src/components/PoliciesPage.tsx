import React from 'react';
import { useStore, PolicyKey } from '../context/StoreContext';
import { ShieldCheck, FileText, Truck, RefreshCw, XCircle, ArrowLeft } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { settings, activePolicyTab, setActivePolicyTab, goBack } = useStore();

  const tabs: { key: PolicyKey; label: string; icon: React.ReactNode }[] = [
    { key: 'shipping', label: 'Shipping & Delivery', icon: <Truck className="w-4 h-4" /> },
    { key: 'returns', label: 'Returns & Exchange', icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'cancellation', label: 'Cancellation Policy', icon: <XCircle className="w-4 h-4" /> },
    { key: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'terms', label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> }
  ];

  const currentPolicy = settings.policies[activePolicyTab] || {
    title: 'Store Policy',
    lastUpdated: 'October 2026',
    content: 'Policy details are currently being updated by store management.'
  };

  return (
    <div className="bg-[#0d0d0f] min-h-screen py-10 md:py-16 text-neutral-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => goBack()}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Go back to previous step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
        
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
            Store Transparency & Legal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Store Policies
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Clear guidelines for orders, shipments, exchanges, and data protection for Sev7n (सेव7न) Mansarovar, Jaipur.
          </p>
        </div>

        {/* Policy Tab Switcher */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-neutral-800">
          {tabs.map(tab => {
            const isActive = activePolicyTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePolicyTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Card */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-2">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {currentPolicy.title}
            </h2>
            <span className="text-xs text-neutral-400">
              Last updated: {currentPolicy.lastUpdated}
            </span>
          </div>

          <div className="text-sm leading-relaxed text-neutral-300 whitespace-pre-line space-y-4 font-normal">
            {currentPolicy.content}
          </div>

          <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>
              Store Address: 24/27 Swarn Path, Sector II, Shukalpura, Mansarovar, Jaipur, RJ 302020
            </span>
            <span className="text-neutral-300 font-mono">
              Care Desk: +91 86198 90774
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
