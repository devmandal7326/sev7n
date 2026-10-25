import React, { useState, useEffect } from 'react';
import { useStore, PolicyKey } from '../context/StoreContext';
import { api } from '../services/api';
import { Product, Order, OrderStatus, StoreSettings, ContactMessage, ProductCategory } from '../types';
import { 
  Lock, 
  ArrowLeft,
  Package, 
  ShoppingBag, 
  Settings, 
  FileText, 
  MessageSquare, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  AlertCircle, 
  LogOut, 
  Copy, 
  Download,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, 
    adminToken, 
    adminLogin, 
    adminLogout, 
    products, 
    settings, 
    refreshProducts, 
    refreshSettings, 
    showToast,
    goBack,
    setCurrentPage
  } = useStore();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'policies' | 'messages' | 'supabase'>('products');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState<string>('all');

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // Policy Form
  const [selectedPolicyKey, setSelectedPolicyKey] = useState<PolicyKey>('shipping');
  const [policyContent, setPolicyContent] = useState('');
  const [policyTitle, setPolicyTitle] = useState('');

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Oversized Tees',
    price: 1499,
    salePrice: undefined,
    description: '',
    fabricCare: '',
    images: ['/src/assets/images/product_oversized_tee_1792911393250.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Charcoal'],
    variants: [
      { size: 'S', color: 'Vintage Charcoal', stock: 10, sku: 'SV7-NEW-S' },
      { size: 'M', color: 'Vintage Charcoal', stock: 15, sku: 'SV7-NEW-M' },
      { size: 'L', color: 'Vintage Charcoal', stock: 15, sku: 'SV7-NEW-L' },
      { size: 'XL', color: 'Vintage Charcoal', stock: 10, sku: 'SV7-NEW-XL' }
    ],
    totalStock: 50,
    featured: true,
    trending: true,
    isNewArrival: true,
    details: ['100% Combed Cotton', 'Boxy Streetwear Fit', 'Pre-shrunk fabric']
  });

  // Supabase SQL content
  const [supabaseSql, setSupabaseSql] = useState<string>('');

  useEffect(() => {
    setSettingsForm(settings);
    if (settings.policies[selectedPolicyKey]) {
      setPolicyTitle(settings.policies[selectedPolicyKey].title);
      setPolicyContent(settings.policies[selectedPolicyKey].content);
    }
  }, [settings, selectedPolicyKey]);

  useEffect(() => {
    if (isAdmin && adminToken) {
      loadOrders();
      loadMessages();
      loadSupabaseSql();
    }
  }, [isAdmin, adminToken]);

  const loadOrders = async () => {
    if (!adminToken) return;
    setOrdersLoading(true);
    try {
      const data = await api.getOrders(adminToken);
      setOrders(data);
    } catch (e: any) {
      showToast('Failed to load orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!adminToken) return;
    setMessagesLoading(true);
    try {
      const data = await api.getContactMessages(adminToken);
      setMessages(data);
    } catch (e) {
      console.warn('Could not load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadSupabaseSql = async () => {
    try {
      const res = await fetch('/api/supabase-schema.sql');
      if (res.ok) {
        const text = await res.text();
        setSupabaseSql(text);
      }
    } catch (e) {
      console.warn('Could not load SQL blueprint');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = await adminLogin(password);
    if (!success) {
      setAuthError('Incorrect admin password. Default is sev7n@admin2026');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (!adminToken) return;
    try {
      const ok = await api.updateOrderStatus(orderId, newStatus, adminToken);
      if (ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order status updated to ${newStatus}`, 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Status update failed', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      await api.updateSettings(settingsForm, adminToken);
      await refreshSettings();
      showToast('Store settings saved successfully', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to save settings', 'error');
    }
  };

  const handleSavePolicy = async () => {
    if (!adminToken) return;
    try {
      const updatedPolicies = {
        ...settings.policies,
        [selectedPolicyKey]: {
          title: policyTitle,
          lastUpdated: 'Updated ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          content: policyContent
        }
      };
      await api.updateSettings({ policies: updatedPolicies }, adminToken);
      await refreshSettings();
      showToast(`${policyTitle} policy updated`, 'success');
    } catch (e: any) {
      showToast('Failed to update policy', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!adminToken) return;
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const ok = await api.deleteProduct(id, adminToken);
      if (ok) {
        await refreshProducts();
        showToast('Product removed from catalog', 'success');
      }
    } catch (e: any) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Oversized Tees',
      price: 1299,
      salePrice: undefined,
      description: '',
      fabricCare: 'Machine wash cold with like colors.',
      images: ['/src/assets/images/product_oversized_tee_1792911393250.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Washed Black'],
      variants: [
        { size: 'S', color: 'Washed Black', stock: 10, sku: `SV7-${Date.now()}-S` },
        { size: 'M', color: 'Washed Black', stock: 15, sku: `SV7-${Date.now()}-M` },
        { size: 'L', color: 'Washed Black', stock: 15, sku: `SV7-${Date.now()}-L` },
        { size: 'XL', color: 'Washed Black', stock: 10, sku: `SV7-${Date.now()}-XL` }
      ],
      totalStock: 50,
      featured: true,
      trending: true,
      isNewArrival: true,
      details: ['100% Combed Cotton', 'Pre-shrunk fabric', 'Reinforced collar']
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      const totalStock = productForm.variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0;
      const productPayload = {
        ...productForm,
        totalStock
      };

      if (editingProductId) {
        await api.updateProduct(editingProductId, productPayload, adminToken);
        showToast('Product updated successfully', 'success');
      } else {
        await api.createProduct(productPayload, adminToken);
        showToast('New product added to catalog', 'success');
      }

      setIsProductModalOpen(false);
      await refreshProducts();
    } catch (e: any) {
      showToast(e.message || 'Failed to save product', 'error');
    }
  };

  // If NOT Logged In, show Login Screen
  if (!isAdmin) {
    return (
      <div className="bg-[#0d0d0f] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#121216] border border-neutral-800 rounded-lg p-8 space-y-6 shadow-2xl">
          <div className="flex justify-start">
            <button
              onClick={() => goBack()}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Sev7n Admin Portal
            </h1>
            <p className="text-xs text-neutral-400">
              Authorized store managers only. Manage Mansarovar inventory, incoming orders, and store settings.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Admin Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: sev7n@admin2026)"
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-white transition-colors"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                *Default demo key: <code className="text-neutral-400">sev7n@admin2026</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
            Sev7n (सेव7न) Store Operating System · Mansarovar, Jaipur
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = selectedOrderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === selectedOrderStatusFilter);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const outOfStockCount = products.filter(p => p.totalStock <= 0).length;

  return (
    <div className="bg-[#0d0d0f] min-h-screen py-10 md:py-16 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Store Management Console
              </h1>
              <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">
                Admin
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Sev7n (सेव7न) · 24/27 Swarn Path, Sector II, Mansarovar, Jaipur
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => goBack()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <button
              onClick={adminLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Real Metrics KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-1">Catalog Garments</span>
            <span className="text-2xl font-bold text-white tabular-nums">{products.length}</span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              {outOfStockCount > 0 ? `${outOfStockCount} items sold out` : 'All items in stock'}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-1">Total Store Orders</span>
            <span className="text-2xl font-bold text-white tabular-nums">{orders.length}</span>
            <span className="text-[11px] text-amber-400 block mt-1">
              {pendingCount} pending verification
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-1">Gross Sales Volume</span>
            <span className="text-2xl font-bold text-white tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              Direct & WhatsApp orders
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 block mb-1">Cash on Delivery</span>
            <span className="text-lg font-bold text-white">
              {settings.cashOnDeliveryEnabled ? (
                <span className="text-emerald-400">Enabled</span>
              ) : (
                <span className="text-neutral-400">Disabled (Safe)</span>
              )}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              Configurable below
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'policies'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Policy Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'messages'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Inquiries ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'supabase'
                ? 'bg-white text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Schema & Setup</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Live Inventory & Garments</h2>
                <p className="text-xs text-neutral-400">All updates persist immediately across browsers.</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950/60">
                    <th className="p-3">Garment</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Sizes</th>
                    <th className="p-3">Total Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-neutral-850/50">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded bg-neutral-800"
                        />
                        <div>
                          <span className="font-semibold text-white block">{prod.name}</span>
                          <span className="text-[11px] text-neutral-400 font-mono">ID: {prod.id}</span>
                        </div>
                      </td>
                      <td className="p-3 text-neutral-300">{prod.category}</td>
                      <td className="p-3 tabular-nums">
                        <span className="font-semibold text-white">₹{(prod.salePrice || prod.price).toLocaleString('en-IN')}</span>
                        {prod.salePrice && (
                          <span className="text-[11px] text-neutral-400 line-through block">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-neutral-300">{prod.sizes.join(', ')}</td>
                      <td className="p-3 tabular-nums">
                        <span className={`font-semibold ${prod.totalStock <= 5 ? 'text-amber-400' : 'text-neutral-200'}`}>
                          {prod.totalStock} units
                        </span>
                      </td>
                      <td className="p-3">
                        {prod.totalStock <= 0 ? (
                          <span className="text-rose-400">Sold Out</span>
                        ) : prod.featured ? (
                          <span className="text-emerald-400">Featured</span>
                        ) : (
                          <span className="text-neutral-400">Active</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-800 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Customer Orders & Dispatches</h2>
                <p className="text-xs text-neutral-400">Verify inventory and dispatch from Mansarovar Jaipur store.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Filter:</span>
                <select
                  value={selectedOrderStatusFilter}
                  onChange={(e) => setSelectedOrderStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {ordersLoading ? (
              <div className="p-8 text-center text-xs text-neutral-400">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-10 rounded-lg bg-neutral-900 border border-neutral-800 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-sm font-semibold text-white">No orders in this category</p>
                <p className="text-xs text-neutral-400">New customer orders placed on the storefront will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white text-sm">#{order.orderNumber}</span>
                        <span className="text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400">Payment: <strong className="text-neutral-200 capitalize">{order.paymentMethod.replace('_', ' ')}</strong></span>
                        <div className="flex items-center gap-1.5">
                          <label className="text-neutral-400">Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="bg-neutral-950 border border-neutral-700 text-xs text-white rounded px-2 py-1 font-medium focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-neutral-400 block font-medium mb-1">Customer Delivery Details:</span>
                        <p className="text-white font-semibold">{order.customer.fullName}</p>
                        <p className="text-neutral-300 font-mono">Mobile: {order.customer.phone}</p>
                        <p className="text-neutral-400 mt-1">
                          {order.customer.addressLine}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                        </p>
                      </div>

                      <div>
                        <span className="text-neutral-400 block font-medium mb-1">Ordered Items ({order.items.length}):</span>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-neutral-950 p-2 rounded border border-neutral-800/80">
                              <span className="text-white font-medium">
                                {item.name} ({item.size}/{item.color}) x{item.quantity}
                              </span>
                              <span className="tabular-nums font-semibold text-neutral-300">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 flex justify-between font-bold text-white border-t border-neutral-800 mt-2">
                          <span>Total Amount:</span>
                          <span className="tabular-nums">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6 text-xs">
            <div>
              <h2 className="text-base font-semibold text-white">Store Operating Details</h2>
              <p className="text-xs text-neutral-400">Configure verified phone, address, closing hours, and announcements.</p>
            </div>

            {/* Announcement Bar Settings */}
            <div className="p-4 rounded bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Top Announcement Bar</span>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcement.enabled}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, enabled: e.target.checked }
                    })}
                    className="accent-white"
                  />
                  <span>Show Announcement Bar</span>
                </label>
              </div>
              <input
                type="text"
                value={settingsForm.announcement.text}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  announcement: { ...settingsForm.announcement, text: e.target.value }
                })}
                placeholder="Announcement banner message..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white"
              />
            </div>

            {/* Business Contact & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Hindi Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.hindiBrandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hindiBrandName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-300 mb-1">WhatsApp International Number (digits only)</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-300 mb-1">Full Store Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Google Plus Code</label>
                <input
                  type="text"
                  value={settingsForm.plusCode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, plusCode: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Closing Time</label>
                <input
                  type="text"
                  value={settingsForm.closingTime}
                  onChange={(e) => setSettingsForm({ ...settingsForm, closingTime: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>
            </div>

            {/* Payments & Fulfillment Rules */}
            <div className="p-4 rounded bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-semibold text-white text-xs block">Payment & Shipping Policies</span>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="font-medium text-white block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-neutral-400">
                    Per instructions: Must be explicitly approved by store owner before activation.
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={settingsForm.cashOnDeliveryEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, cashOnDeliveryEnabled: e.target.checked })}
                    className="accent-white"
                  />
                  <span>Enable COD</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-850">
                <div>
                  <label className="block text-neutral-400 mb-1">Free Shipping Order Threshold (INR)</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Standard Shipping Fee (INR)</label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-white text-neutral-950 font-semibold rounded hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Store Configuration</span>
            </button>
          </form>
        )}

        {/* TAB 4: POLICY EDITOR */}
        {activeTab === 'policies' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6 text-xs">
            <div>
              <h2 className="text-base font-semibold text-white">Store Policies Editor</h2>
              <p className="text-xs text-neutral-400">Edit real policies displayed to customers on the storefront.</p>
            </div>

            {/* Selector */}
            <div className="flex gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
              {(['shipping', 'returns', 'cancellation', 'privacy', 'terms'] as PolicyKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedPolicyKey(key)}
                  className={`px-3 py-1.5 rounded uppercase tracking-wider text-[11px] font-semibold cursor-pointer ${
                    selectedPolicyKey === key
                      ? 'bg-white text-neutral-950'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={policyTitle}
                  onChange={(e) => setPolicyTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Policy Content (Markdown / Plain Text)</label>
                <textarea
                  rows={14}
                  value={policyContent}
                  onChange={(e) => setPolicyContent(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white font-mono text-xs leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleSavePolicy}
                className="py-2 px-4 bg-white text-neutral-950 font-semibold rounded hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Policy Document</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white">Customer Inquiries</h2>
            {messages.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-xs">
                No customer inquiries logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{msg.name}</h4>
                        <span className="text-neutral-400 font-mono">Mobile: {msg.phone}</span>
                        {msg.email && <span className="text-neutral-400"> · {msg.email}</span>}
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-2.5 bg-neutral-950 rounded border border-neutral-850 text-neutral-200">
                      <span className="font-medium text-neutral-400 block mb-0.5">{msg.subject}:</span>
                      {msg.message}
                    </div>
                    <div>
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px]"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Reply to customer on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SUPABASE SCHEMA & SQL SETUP */}
        {activeTab === 'supabase' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Production Supabase PostgreSQL Integration</h2>
              </div>
              <p className="text-xs text-neutral-400">
                Complete database schema with Row Level Security (RLS) policies for Sev7n (सेव7न).
              </p>
            </div>

            <div className="p-4 rounded bg-neutral-950 border border-neutral-800 text-xs space-y-3">
              <h3 className="font-semibold text-white">Setup Instructions for Store Owner:</h3>
              <ol className="list-decimal pl-4 space-y-1.5 text-neutral-300 text-[11px] leading-relaxed">
                <li>Create a project on <strong>supabase.com</strong> named <code>sev7n-store</code>.</li>
                <li>Go to the <strong>SQL Editor</strong> in your Supabase project dashboard.</li>
                <li>Copy the SQL script below and click <strong>RUN</strong>. This creates all tables (products, variants, orders, settings, messages) and activates Row Level Security.</li>
                <li>Create your first admin user in Supabase Authentication, and set their role to <code>'admin'</code> in <code>public.profiles</code>.</li>
                <li>Add your <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> to <code>.env</code>.</li>
              </ol>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-neutral-300">Generated SQL Blueprint</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(supabaseSql);
                      showToast('SQL blueprint copied to clipboard', 'success');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-neutral-800 text-neutral-200 hover:text-white rounded border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy SQL</span>
                  </button>
                  <a
                    href="/api/supabase-schema.sql"
                    download="sev7n-schema.sql"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-neutral-800 text-neutral-200 hover:text-white rounded border border-neutral-700"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .sql</span>
                  </a>
                </div>
              </div>

              <textarea
                readOnly
                rows={16}
                value={supabaseSql}
                className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] text-neutral-300 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#121216] border border-neutral-800 rounded-lg p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                <h3 className="font-display text-base font-bold text-white">
                  {editingProductId ? 'Edit Garment Details' : 'Add New Streetwear Garment'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white">
                  <Trash2 className="w-4 h-4 hidden" />
                  <span>✕</span>
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Acid Washed Boxy Tee"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                    >
                      <option value="Oversized Tees">Oversized Tees</option>
                      <option value="Cargos & Trousers">Cargos & Trousers</option>
                      <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
                      <option value="Contemporary Jackets">Contemporary Jackets</option>
                      <option value="Street Shirts">Street Shirts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Sale Price (Optional)</label>
                    <input
                      type="number"
                      value={productForm.salePrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Leave blank if no discount"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe the fabric weight, drape, and cut..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Product Image Path / URL *</label>
                  <input
                    type="text"
                    required
                    value={productForm.images?.[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white font-mono text-[11px]"
                  />
                </div>

                {/* Sizes and Stock management */}
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Size Inventory Stock</span>
                    <span className="text-[11px] text-neutral-400">Total: {productForm.variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} units</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {productForm.variants?.map((v, i) => (
                      <div key={i} className="p-2 bg-neutral-900 rounded border border-neutral-800">
                        <span className="font-semibold text-white block mb-1">Size {v.size} ({v.color})</span>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => {
                            const newVariants = [...(productForm.variants || [])];
                            newVariants[i].stock = Number(e.target.value);
                            setProductForm({ ...productForm, variants: newVariants });
                          }}
                          className="w-full px-2 py-1 bg-neutral-950 border border-neutral-700 rounded text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-neutral-900 text-neutral-300 hover:text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-neutral-950 font-semibold rounded hover:bg-neutral-200"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
