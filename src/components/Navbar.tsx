import React, { useState } from 'react';
import { useStore, NavigationPage } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, ShieldCheck, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, isAdmin } = useStore();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: NavigationPage }[] = [
    { label: 'Shop', page: 'shop' },
    { label: 'About', page: 'about' },
    { label: 'Store Location', page: 'contact' },
    { label: 'Policies', page: 'policies' }
  ];

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0f]/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-baseline gap-1.5 text-left group cursor-pointer"
          >
            <span className="font-display text-2xl font-extrabold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              SEV7N
            </span>
            <span className="text-xs font-medium text-neutral-400 tracking-wider">
              (सेव7न)
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Shopping Bag) + Admin Quick Entry */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentPage('shop');
            }}
            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer md:block hidden"
            aria-label="Search catalog"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentPage('admin')}
            className={`p-2 transition-colors cursor-pointer rounded ${
              currentPage === 'admin'
                ? 'text-white bg-neutral-800'
                : 'text-neutral-400 hover:text-white'
            }`}
            title={isAdmin ? 'Admin Dashboard (Active)' : 'Store Admin Access'}
            aria-label="Admin portal"
          >
            <ShieldCheck className={`w-5 h-5 ${isAdmin ? 'text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-white rounded-md hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-98"
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">Cart ({totalItems})</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121216] border-b border-neutral-800 px-6 py-5 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left text-base font-medium py-1 ${
                currentPage === 'home' ? 'text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              Home
            </button>
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-left text-base font-medium py-1 ${
                  currentPage === link.page ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => handleNavClick('admin')}
                className="text-sm text-neutral-400 hover:text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Store Admin Portal</span>
              </button>
              <span className="text-xs text-neutral-400">Jaipur, RJ</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
