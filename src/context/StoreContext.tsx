import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, StoreSettings, ProductCategory } from '../types';
import { api } from '../services/api';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

export type NavigationPage = 'home' | 'shop' | 'about' | 'contact' | 'policies' | 'admin';
export type PolicyKey = 'privacy' | 'terms' | 'shipping' | 'returns' | 'cancellation';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface HistoryState {
  page: NavigationPage;
  productId: string | null;
  policyTab?: PolicyKey;
}

interface StoreContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage, replace?: boolean) => void;
  activePolicyTab: PolicyKey;
  setActivePolicyTab: (tab: PolicyKey) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  products: Product[];
  settings: StoreSettings;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  goBack: () => void;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;

  // Admin Auth
  isAdmin: boolean;
  adminToken: string | null;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // WhatsApp Helpers
  openWhatsAppChat: (type: 'general' | 'product' | 'order' | 'location', details?: any) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_STORAGE_TOKEN = 'sev7n_admin_jwt';

function parseHashLocation(): HistoryState {
  if (typeof window === 'undefined') return { page: 'home', productId: null };
  const rawHash = window.location.hash.replace(/^#\/?/, '');
  const [routePart, queryPart] = rawHash.split('?');

  let page: NavigationPage = 'home';
  if (['shop', 'about', 'contact', 'policies', 'admin'].includes(routePart)) {
    page = routePart as NavigationPage;
  }

  let productId: string | null = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    productId = params.get('product') || null;
  }

  return { page, productId };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = parseHashLocation();

  const [currentPage, setCurrentPageState] = useState<NavigationPage>(initialState.page);
  const [activePolicyTab, setActivePolicyTabState] = useState<PolicyKey>('shipping');
  const [selectedProductId, setSelectedProductIdState] = useState<string | null>(initialState.productId);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_STORAGE_TOKEN) || null;
  });
  const isAdmin = !!adminToken;

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const isPopStateNavRef = useRef(false);

  // Set up browser history listener for Back/Forward navigation
  useEffect(() => {
    // Sync initial state to history entry
    const current = parseHashLocation();
    const state: HistoryState = {
      page: current.page,
      productId: current.productId,
      policyTab: 'shipping'
    };
    window.history.replaceState(
      state,
      '',
      window.location.hash || `#/${current.page}${current.productId ? `?product=${encodeURIComponent(current.productId)}` : ''}`
    );

    const handlePopState = (event: PopStateEvent) => {
      isPopStateNavRef.current = true;
      if (event.state) {
        const state = event.state as HistoryState;
        if (state.page) setCurrentPageState(state.page);
        setSelectedProductIdState(state.productId || null);
        if (state.policyTab) setActivePolicyTabState(state.policyTab);
      } else {
        const fallback = parseHashLocation();
        setCurrentPageState(fallback.page);
        setSelectedProductIdState(fallback.productId);
      }
      setTimeout(() => {
        isPopStateNavRef.current = false;
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setCurrentPage = useCallback((page: NavigationPage, replace = false) => {
    setSelectedProductIdState(null);
    setCurrentPageState(page);

    const state: HistoryState = { page, productId: null, policyTab: activePolicyTab };
    const hash = `#/${page}`;

    if (!isPopStateNavRef.current) {
      if (replace) {
        window.history.replaceState(state, '', hash);
      } else {
        window.history.pushState(state, '', hash);
      }
    }
  }, [activePolicyTab]);

  const setActivePolicyTab = useCallback((tab: PolicyKey) => {
    setActivePolicyTabState(tab);
    const state: HistoryState = { page: currentPage, productId: null, policyTab: tab };
    if (!isPopStateNavRef.current) {
      window.history.replaceState(state, '', `#/${currentPage}`);
    }
  }, [currentPage]);

  const setSelectedProductId = useCallback((id: string | null) => {
    setSelectedProductIdState(id);

    if (isPopStateNavRef.current) return;

    if (id) {
      const state: HistoryState = { page: currentPage, productId: id, policyTab: activePolicyTab };
      window.history.pushState(state, '', `#/${currentPage}?product=${encodeURIComponent(id)}`);
    } else {
      // If modal was opened with a pushState, navigating back cleans it up cleanly
      if (window.history.state && window.history.state.productId) {
        window.history.back();
      } else {
        const state: HistoryState = { page: currentPage, productId: null, policyTab: activePolicyTab };
        window.history.replaceState(state, '', `#/${currentPage}`);
      }
    }
  }, [currentPage, activePolicyTab]);

  const goBack = useCallback(() => {
    if (selectedProductId) {
      setSelectedProductId(null);
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setCurrentPage('home');
    }
  }, [selectedProductId, setCurrentPage, setSelectedProductId]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.warn('Could not refresh products, staying with current data', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (e) {
      console.warn('Could not refresh settings', e);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshSettings();
  }, [refreshProducts, refreshSettings]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        setAdminToken(res.token);
        localStorage.setItem(ADMIN_STORAGE_TOKEN, res.token);
        showToast('Admin authenticated successfully', 'success');
        return true;
      }
      return false;
    } catch (e: any) {
      showToast(e.message || 'Authentication failed', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem(ADMIN_STORAGE_TOKEN);
    showToast('Admin logged out', 'info');
  };

  const openWhatsAppChat = (type: 'general' | 'product' | 'order' | 'location', details?: any) => {
    let message = '';
    const num = settings.whatsappNumber;

    switch (type) {
      case 'product':
        message = `Hello Sev7n! I have an inquiry about "${details?.name || 'this product'}" (Size: ${details?.size || 'any'}, Color: ${details?.color || 'any'}). Is it available at your Mansarovar store?`;
        break;
      case 'order':
        message = `Hello Sev7n! I would like to check the status of my order ${details?.orderNumber ? `#${details.orderNumber}` : ''}.`;
        break;
      case 'location':
        message = `Hello Sev7n! I would like to visit your store at 24/27 Swarn Path, Mansarovar, Jaipur today before 10 PM. Can you share landmark directions?`;
        break;
      case 'general':
      default:
        message = `Hello Sev7n (सेव7न)! I am contacting you from your official website regarding your contemporary fashion collection.`;
        break;
    }

    const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activePolicyTab,
        setActivePolicyTab,
        selectedProductId,
        setSelectedProductId,
        products,
        settings,
        isLoading,
        refreshProducts,
        refreshSettings,
        goBack,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isAdmin,
        adminToken,
        adminLogin,
        adminLogout,
        toasts,
        showToast,
        dismissToast,
        openWhatsAppChat
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
