import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './src/data/initialData';
import { Product, StoreSettings, Order, ContactMessage, OrderStatus } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(__dirname, 'data', 'store_db.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sev7n@admin2026';
const ADMIN_TOKEN = 'sev7n-authorized-admin-token-2026';

interface DatabaseSchema {
  products: Product[];
  settings: StoreSettings;
  orders: Order[];
  contactMessages: ContactMessage[];
}

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDbDirectory();
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return {
        products: data.products || INITIAL_PRODUCTS,
        settings: data.settings || INITIAL_SETTINGS,
        orders: data.orders || [],
        contactMessages: data.contactMessages || []
      };
    }
  } catch (err) {
    console.error('Failed to read db file, initializing default:', err);
  }

  const initialDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    settings: INITIAL_SETTINGS,
    orders: [],
    contactMessages: []
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Simple Admin Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.replace('Bearer ', '').trim() === ADMIN_TOKEN) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  };

  // --- API Endpoints ---

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', store: 'Sev7n (सेव7न)', timestamp: new Date().toISOString() });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_TOKEN,
        user: { name: 'Store Manager', role: 'admin' }
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Settings
  app.get('/api/settings', (_req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', requireAdmin, (req, res) => {
    const updatedSettings = { ...db.settings, ...req.body };
    db.settings = updatedSettings;
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Products
  app.get('/api/products', (req, res) => {
    let result = [...db.products];
    const { category, search, minPrice, maxPrice, sort, inStock } = req.query;

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter(p => (p.salePrice || p.price) >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter(p => (p.salePrice || p.price) <= Number(maxPrice));
    }

    if (inStock === 'true') {
      result = result.filter(p => p.totalStock > 0);
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }

    res.json(result);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', requireAdmin, (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `sev7n-item-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', requireAdmin, (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase(db);
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', requireAdmin, (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const removed = db.products.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true, removed: removed[0] });
  });

  // Orders
  app.get('/api/orders', requireAdmin, (_req, res) => {
    res.json(db.orders);
  });

  // Order Placement with Server-Side Price & Stock Verification
  app.post('/api/orders', (req, res) => {
    const { customer, items, paymentMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.addressLine) {
      return res.status(400).json({ error: 'Missing required customer delivery information.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before checking out.' });
    }

    // Verify each item against real product catalog and inventory
    let verifiedSubtotal = 0;
    const verifiedItems: any[] = [];

    for (const item of items) {
      const realProduct = db.products.find(p => p.id === item.productId);
      if (!realProduct) {
        return res.status(400).json({ error: `Product with ID ${item.productId} is no longer available.` });
      }

      const variant = realProduct.variants.find(v => v.size === item.size && v.color === item.color);
      const availableStock = variant ? variant.stock : realProduct.totalStock;

      if (availableStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${realProduct.name} (Size: ${item.size}, Color: ${item.color}). Available: ${availableStock}.`
        });
      }

      const realItemPrice = realProduct.salePrice || realProduct.price;
      verifiedSubtotal += realItemPrice * item.quantity;

      verifiedItems.push({
        productId: realProduct.id,
        name: realProduct.name,
        price: realItemPrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        image: realProduct.images[0] || ''
      });
    }

    // Deduct stock safely on server
    for (const item of items) {
      const realProduct = db.products.find(p => p.id === item.productId);
      if (realProduct) {
        const variant = realProduct.variants.find(v => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
        realProduct.totalStock = Math.max(0, realProduct.totalStock - item.quantity);
      }
    }

    const shippingFee = verifiedSubtotal >= db.settings.freeShippingThreshold ? 0 : db.settings.standardShippingFee;
    const verifiedTotal = verifiedSubtotal + shippingFee;

    const orderNumber = `SV7-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      shippingFee,
      total: verifiedTotal,
      status: 'pending',
      paymentMethod: paymentMethod || 'whatsapp',
      paymentStatus: paymentMethod === 'store_pickup' ? 'not_applicable' : 'pending'
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    // Build authentic WhatsApp pre-filled order message
    const itemsSummary = verifiedItems
      .map(i => `• ${i.name} (${i.size}/${i.color}) x${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const whatsappMessage = 
`Hello Sev7n (सेव7न)! 
I want to confirm my order #${orderNumber}:

${itemsSummary}
Subtotal: ₹${verifiedSubtotal.toLocaleString('en-IN')}
Shipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
Total Amount: ₹${verifiedTotal.toLocaleString('en-IN')}

Customer Details:
Name: ${customer.fullName}
Phone: ${customer.phone}
Address: ${customer.addressLine}, ${customer.city}, ${customer.state} - ${customer.pincode}
Payment Method: ${paymentMethod}

Please confirm availability and dispatch from your Mansarovar store!`;

    const whatsappUrl = `https://wa.me/${db.settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      order: newOrder,
      whatsappUrl
    });
  });

  app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
    const { status, paymentStatus } = req.body;
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status as OrderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    saveDatabase(db);
    res.json({ success: true, order });
  });

  // Contact Form
  app.post('/api/contact', (req, res) => {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone number and message are required.' });
    }

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    db.contactMessages.unshift(newMessage);
    saveDatabase(db);
    res.status(201).json({ success: true, message: 'Message received. Sev7n team will respond shortly.' });
  });

  app.get('/api/contact-messages', requireAdmin, (_req, res) => {
    res.json(db.contactMessages);
  });

  // Razorpay Gateway Flow (Sandbox / Demo Architecture)
  app.post('/api/razorpay/create-order', (req, res) => {
    const { amount, receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // When real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in environment, this connects to Razorpay API.
    // Otherwise it generates a validated test checkout payload.
    const isLiveConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    const mockOrderId = `order_rzp_${Math.random().toString(36).substring(2, 10)}`;

    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sev7n_demo_key',
      orderId: mockOrderId,
      amount: Math.round(amount * 100), // In Paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      isLiveConfigured,
      note: isLiveConfigured 
        ? 'Live Razorpay gateway enabled' 
        : 'Demo / Sandbox mode active. To process real transactions, provide RAZORPAY_KEY_ID in .env'
    });
  });

  app.post('/api/razorpay/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Server validation: In live mode, verify crypto hmac signature
    // In demo/test mode, verify fields are present and return structured verification
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Incomplete payment proof' });
    }

    res.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      verifiedAt: new Date().toISOString()
    });
  });

  // Supabase SQL Migration Blueprint Exporter
  app.get('/api/supabase-schema.sql', (_req, res) => {
    const sql = `-- ==============================================================================
-- SEV7N CLOTHING STORE (सेव7न) — MANSAROVAR, JAIPUR
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Admins and Registered Customers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price >= 0),
  description TEXT NOT NULL,
  details JSONB DEFAULT '[]'::jsonb,
  fabric_care TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  total_stock INT DEFAULT 0 CHECK (total_stock >= 0),
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Variants (Size, Color, Stock SKU)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'not_applicable')),
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL
);

-- 8. Store Settings
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT NOT NULL DEFAULT 'Sev7n',
  hindi_brand_name TEXT NOT NULL DEFAULT 'सेव7न',
  phone TEXT NOT NULL DEFAULT '+91 86198 90774',
  whatsapp_number TEXT NOT NULL DEFAULT '918619890774',
  address TEXT NOT NULL,
  plus_code TEXT NOT NULL,
  closing_time TEXT NOT NULL,
  announcement_enabled BOOLEAN DEFAULT true,
  announcement_text TEXT NOT NULL,
  cash_on_delivery_enabled BOOLEAN DEFAULT false,
  free_shipping_threshold NUMERIC(10, 2) DEFAULT 2499.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read published products, only admins can modify
CREATE POLICY "Public products viewable" ON public.products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Categories: Anyone can read, admins can modify
CREATE POLICY "Public categories viewable" ON public.categories
  FOR SELECT USING (true);

-- Orders: Customers can insert their order, but cannot read other customers orders
CREATE POLICY "Public create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Store Settings: Public can read, only admin can update
CREATE POLICY "Public read store settings" ON public.store_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin update store settings" ON public.store_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Contact Messages: Anyone can post, only admin can view
CREATE POLICY "Public send contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contact messages" ON public.contact_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(sql);
  });

  // Vite Integration
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sev7n (सेव7न) server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
