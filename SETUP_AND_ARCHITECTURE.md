# Sev7n (सेव7न) Clothing Store — Architecture & Setup Guide

**Store Location:** 24/27, Swarn Path, Sector II, Shukalpura, Mansarovar, Jaipur, Rajasthan 302020  
**Store Phone & WhatsApp:** +91 86198 90774 (WhatsApp: 918619890774)  
**Store Closing Time:** 10:00 PM IST  
**Google Rating:** 4.9 / 5 (15 Google Reviews)  

---

## 1. Project Structure

```
├── /data/store_db.json              # Local persistent JSON database with multi-device sync
├── /src
│   ├── /assets/images               # High-fidelity fashion assets & interior photography
│   ├── /components
│   │   ├── AboutPage.tsx            # Brand narrative & Mansarovar craftsmanship
│   │   ├── AdminDashboard.tsx       # Full store admin portal & inventory management
│   │   ├── AnnouncementBar.tsx      # Configurable top promotional ribbon
│   │   ├── CartDrawer.tsx           # Slide-over shopping bag with real-time stock checks
│   │   ├── CheckoutModal.tsx        # Multi-channel checkout (WhatsApp, Store Pickup, Razorpay)
│   │   ├── FeaturedCategories.tsx   # Streetwear category showcase
│   │   ├── Footer.tsx               # Editorial anti-slop footer with verified address
│   │   ├── HeroSection.tsx          # "YOUR STYLE. YOUR RULES." campaign hero
│   │   ├── HomePage.tsx             # Complete storefront home experience
│   │   ├── Navbar.tsx               # Strict Top Bar Contract navigation
│   │   ├── PoliciesPage.tsx         # Live editable store policy documents
│   │   ├── ProductCard.tsx          # Luxury streetwear product card with zero-pill metadata
│   │   ├── ProductDetailsModal.tsx  # Contiguous purchase module & size guide
│   │   ├── ProductGrid.tsx          # Responsive catalog grid with skeleton & empty states
│   │   ├── ShopPage.tsx             # Search, category, size, color & price filtering
│   │   ├── StoreLocationSection.tsx # Google Maps locator, opening hours & contact form
│   │   ├── ToastContainer.tsx       # Auto-dismissing notification toasts
│   │   ├── VerifiedReviewsSection.tsx # Google Maps 4.9/5 proof section
│   │   └── WhatsAppFloatingButton.tsx # Verified direct WhatsApp floating desk
│   ├── /context
│   │   ├── CartContext.tsx          # Cart state, stock limits, and buy-now flow
│   │   └── StoreContext.tsx         # Routing, catalog, settings, and auth state
│   ├── /data
│   │   └── initialData.ts           # Verified store facts, settings, and starter products
│   ├── /services
│   │   └── api.ts                   # Client API layer communicating with Express backend
│   ├── /types
│   │   └── index.ts                 # Strong TypeScript models
│   ├── App.tsx                      # Top-level application router
│   ├── index.css                    # Tailwind CSS v4 design tokens and fonts
│   └── main.tsx                     # React DOM entry point
├── .env.example                     # Environment variables template
├── index.html                       # SEO metadata & Google Fonts
├── metadata.json                    # AI Studio manifest
├── package.json                     # Dependencies and build scripts
├── server.ts                        # Full-stack Express server with Vite middlewares
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 2. Supabase SQL Schema & Row Level Security (RLS)

A complete copy of the production PostgreSQL schema and RLS policies is pre-configured and accessible via the **Admin Dashboard -> Supabase Schema & Setup** tab or by downloading from `/api/supabase-schema.sql`.

### Key Tables Provisioned:
1. `profiles`: Customer and admin user profiles with role constraints (`'admin'`, `'manager'`, `'customer'`).
2. `categories`: Garment classifications with unique slugs.
3. `products`: Catalog items with prices, sale prices, images, sizes, colors, and total stock.
4. `product_variants`: Normalized size, color, stock, and SKU combinations.
5. `orders`: Orders with server-verified amounts, customer delivery data, and fulfillment status.
6. `order_items`: Line items with foreign keys to orders and products.
7. `store_settings`: Business address, WhatsApp number, announcement status, and policies.
8. `contact_messages`: Inquiries received via the storefront contact desk.

### Row Level Security (RLS) Enforced:
- **Products & Categories**: Public read for active items; write restricted strictly to authenticated admins.
- **Orders**: Anyone can submit a valid checkout; reading or modifying customer orders is restricted strictly to authenticated administrators.
- **Store Settings & Policies**: Public read; update restricted to admins.

---

## 3. Creating the First Admin Account

1. In the local/deployed application, navigate to the **Store Admin Access** lock icon in the top navigation bar or footer.
2. Enter the default master administrator password:  
   `sev7n@admin2026`  
   *(This can be customized via the `ADMIN_PASSWORD` variable in `.env`)*
3. Once logged in, administrators have full access to add products, adjust stock levels per size, modify banner texts, change store hours, update policies, and track customer orders.
4. When migrating to Supabase, create an admin user in Supabase Authentication and update their profile role:
   ```sql
   INSERT INTO public.profiles (id, full_name, phone, role)
   VALUES ('<USER_AUTH_UID>', 'Sev7n Store Owner', '+91 86198 90774', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## 4. Local Development Instructions

1. Install all dependencies:
   ```bash
   npm install
   ```
2. Start the full-stack development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser. The Express server serves Vite middlewares in development.

---

## 5. Deployment Instructions

1. Compile the production assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```
   The Express server automatically serves the compiled `dist/` directory and mounts all persistent `/api/*` endpoints.

---

## 6. Production Testing Checklist

- [x] **Top Bar Contract**: Exactly 3 zones (wordmark, single-line links, primary action).
- [x] **Verified Store Facts**: Address in Mansarovar Jaipur, phone +91 86198 90774, closing time 10 PM.
- [x] **Catalog Search & Filters**: Live search, category pills, size/color selectors, price range slider.
- [x] **Inventory & Stock Limits**: Variant-level stock control prevents over-ordering or dead clicks.
- [x] **WhatsApp Order Prefill**: Generates pre-formatted order summary links for +91 86198 90774.
- [x] **Cash on Delivery Restraint**: Disabled by default as requested; store owner toggleable in Admin.
- [x] **Responsive Mobile Layout**: Compact navigation drawer, touch-friendly touch targets, sticky cap under 15%.
- [x] **Policies**: Full editable policies for Shipping, Returns, Privacy, Terms, and Cancellations.
