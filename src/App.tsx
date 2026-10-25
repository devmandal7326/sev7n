import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { AboutPage } from './components/AboutPage';
import { PoliciesPage } from './components/PoliciesPage';
import { AdminDashboard } from './components/AdminDashboard';
import { StoreLocationSection } from './components/StoreLocationSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentPage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0f] text-neutral-100">
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Top Bar Contract Navbar */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && (
          <div className="pt-6">
            <StoreLocationSection />
          </div>
        )}
        {currentPage === 'policies' && <PoliciesPage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Drawers & Modals */}
      <ProductDetailsModal />
      <CartDrawer />
      <WhatsAppFloatingButton />
      <ToastContainer />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </StoreProvider>
  );
}
