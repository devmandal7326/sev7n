import { Product, StoreSettings, Order, ContactMessage, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

export const api = {
  // Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch (e) {
      console.warn('API fallback for settings:', e);
      return INITIAL_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<StoreSettings>, token: string): Promise<StoreSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    inStock?: boolean;
  }): Promise<Product[]> {
    try {
      const url = new URL('/api/products', window.location.origin);
      if (params?.category) url.searchParams.set('category', params.category);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.minPrice) url.searchParams.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice) url.searchParams.set('maxPrice', params.maxPrice.toString());
      if (params?.sort) url.searchParams.set('sort', params.sort);
      if (params?.inStock) url.searchParams.set('inStock', 'true');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (e) {
      console.warn('API fallback for products:', e);
      return INITIAL_PRODUCTS;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      const found = INITIAL_PRODUCTS.find(p => p.id === id);
      return found || null;
    }
  },

  async createProduct(product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return await res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    return await res.json();
  },

  async deleteProduct(id: string, token: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.ok;
  },

  // Orders
  async createOrder(payload: {
    customer: any;
    items: any[];
    paymentMethod: string;
  }): Promise<{ success: boolean; order: Order; whatsappUrl: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create order');
    }
    return await res.json();
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized or failed to fetch orders');
    return await res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, token: string, paymentStatus?: string): Promise<boolean> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, paymentStatus })
    });
    return res.ok;
  },

  // Contact
  async sendContactMessage(payload: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send message');
    }
    return await res.json();
  },

  async getContactMessages(token: string): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact-messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch contact messages');
    return await res.json();
  },

  // Admin Auth
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      throw new Error('Invalid credentials');
    }
    return await res.json();
  },

  // Razorpay helpers
  async createRazorpayOrder(amount: number, receipt?: string) {
    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt })
    });
    return await res.json();
  },

  async verifyRazorpayPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature?: string }) {
    const res = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
};
