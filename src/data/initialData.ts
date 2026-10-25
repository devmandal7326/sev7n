import { Product, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'Sev7n',
  hindiBrandName: 'सेव7न',
  tagline: 'YOUR STYLE. YOUR RULES.',
  phone: '+91 86198 90774',
  whatsappNumber: '918619890774',
  address: '24/27, Swarn Path, Sector II, Swarn Path, Shukalpura, Mansarovar, Jaipur, Rajasthan 302020',
  plusCode: 'VQC2+4W, Jaipur, Rajasthan',
  closingTime: '10:00 PM',
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=24%2F27%2C+Swarn+Path%2C+Sector+II%2C+Swarn+Path%2C+Shukalpura%2C+Mansarovar%2C+Jaipur%2C+Rajasthan+302020',
  rating: 4.9,
  reviewsCount: 15,
  announcement: {
    enabled: true,
    text: 'Visit our Mansarovar, Jaipur flagship store daily until 10 PM. Discover the new contemporary drop.',
    linkText: 'Store Directions',
    linkUrl: '#store-location'
  },
  cashOnDeliveryEnabled: false, // Per prompt: Keep cash on delivery disabled until confirmed by store owner
  freeShippingThreshold: 2499,
  standardShippingFee: 99,
  policies: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'October 2026',
      content: `At Sev7n (सेव7न), we respect your privacy. This policy outlines how we collect, use, and protect your personal information when you browse our storefront or visit our Mansarovar, Jaipur retail location.

1. Information We Collect
We collect personal information necessary to fulfill your orders, provide customer support, and communicate regarding store inquiries:
- Contact Information: Full name, delivery address, city, state, postal code, mobile number, and email.
- Order Details: Selected products, sizes, quantities, and transaction receipts.
- Direct Communications: Inquiries initiated via WhatsApp or our store contact form.

2. How We Use Your Data
- Order Processing: To prepare and deliver your streetwear garments or coordinate in-store pickup at our Mansarovar, Jaipur outlet.
- Customer Care: To resolve questions or provide updates on garment availability.
- Compliance: To adhere to applicable statutory regulations in Rajasthan, India.

3. Data Security & Storage
We never sell, rent, or trade your personal details to third-party brokers. We maintain industry-standard physical and electronic safeguards to preserve your data security.`
    },
    terms: {
      title: 'Terms & Conditions',
      lastUpdated: 'October 2026',
      content: `Welcome to Sev7n (सेव7न). By browsing our catalog, placing an order, or visiting our physical store in Mansarovar, Jaipur, you agree to these Terms and Conditions.

1. General Overview
Sev7n is a retail clothing brand based at 24/27, Swarn Path, Sector II, Shukalpura, Mansarovar, Jaipur, Rajasthan 302020. All transactions are governed by local and national regulations of India.

2. Product Availability & Pricing
All prices are displayed in Indian Rupees (INR). We strive for absolute accuracy in inventory counts and pricing; however, in the rare event an item is sold in-store simultaneously, we reserve the right to contact you and offer an alternative or cancel the unfulfilled portion.

3. Order Confirmation
Orders submitted through WhatsApp or our website are confirmed once our team verifies stock availability at our Mansarovar store. WhatsApp communications constitute direct user inquiries and require store acceptance.

4. Intellectual Property
All brand marks, visual imagery, product layouts, and design materials of Sev7n (सेव7न) are proprietary property.`
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      lastUpdated: 'October 2026',
      content: `1. Service Area
We ship across Jaipur, Rajasthan, and across India. Local deliveries within Jaipur can also be picked up directly at our Mansarovar outlet during operating hours (until 10:00 PM).

2. Delivery Timelines
- Jaipur Metro Area: 1–2 business days or same-day store pickup.
- Rest of Rajasthan: 2–3 business days.
- Nationwide (Rest of India): 3–6 business days via trusted logistics partners.

3. Shipping Charges
- Free delivery on prepaid orders above ₹2,499.
- Flat ₹99 standard shipping on orders below the threshold.
- In-store pickup at Mansarovar is always complimentary.

4. Tracking
Once dispatched, tracking information or delivery confirmation will be shared with you via SMS or WhatsApp.`
    },
    returns: {
      title: 'Returns & Exchange Policy',
      lastUpdated: 'October 2026',
      content: `Please note: The following policy represents our current guidelines. All returns and exchanges are subject to verification at our Mansarovar, Jaipur location.

1. Exchange Window
Garments may be brought into our Mansarovar store or shipped back within 7 days of delivery for size exchange, provided they are unwashed, unworn, and retain original tags and packaging.

2. Defective or Incorrect Items
If you receive an item with a manufacturing defect or incorrect size, notify us via WhatsApp at +91 86198 90774 within 48 hours of receipt with clear photos of the issue.

3. Non-Returnable Items
Items purchased on clearance sale or custom-altered pieces cannot be returned.`
    },
    cancellation: {
      title: 'Cancellation Policy',
      lastUpdated: 'October 2026',
      content: `1. Customer Cancellations
You may request cancellation of an order before it has been dispatched from our Jaipur store by reaching out to our WhatsApp care desk (+91 86198 90774) with your Order ID.

2. Store Cancellations
Sev7n reserves the right to cancel an order due to unforeseen inventory shortages or logistical restrictions. If an order is cancelled by us, any prepaid amount is refunded in full.`
    }
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sev7n-tee-01',
    name: 'Washed Charcoal Heavyweight Tee',
    category: 'Oversized Tees',
    price: 1299,
    salePrice: 1099,
    description: 'Custom 260 GSM combed cotton oversized streetwear t-shirt with a vintage acid wash finish and reinforced collar stitching. Designed for everyday drape and lasting structure.',
    details: [
      '260 GSM 100% heavyweight combed cotton',
      'Drop-shoulder boxy streetwear silhouette',
      'Ribbed 1.25" high-density neck collar',
      'Pre-shrunk fabric to prevent post-wash shrinkage',
      'Handcrafted finish with subtle distressing'
    ],
    fabricCare: 'Machine wash cold inside out with like colors. Do not tumble dry. Warm iron on reverse.',
    images: [
      '/src/assets/images/product_oversized_tee_1792911393250.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Charcoal', 'Chalk Bone'],
    variants: [
      { size: 'S', color: 'Vintage Charcoal', stock: 6, sku: 'SV7-TEE-VCH-S' },
      { size: 'M', color: 'Vintage Charcoal', stock: 12, sku: 'SV7-TEE-VCH-M' },
      { size: 'L', color: 'Vintage Charcoal', stock: 14, sku: 'SV7-TEE-VCH-L' },
      { size: 'XL', color: 'Vintage Charcoal', stock: 8, sku: 'SV7-TEE-VCH-XL' },
      { size: 'XXL', color: 'Vintage Charcoal', stock: 4, sku: 'SV7-TEE-VCH-XXL' },
      { size: 'M', color: 'Chalk Bone', stock: 7, sku: 'SV7-TEE-BN-M' },
      { size: 'L', color: 'Chalk Bone', stock: 9, sku: 'SV7-TEE-BN-L' }
    ],
    totalStock: 60,
    featured: true,
    trending: true,
    isNewArrival: true,
    createdAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'sev7n-cargo-02',
    name: 'Stone Utility Relaxed Cargo Trousers',
    category: 'Cargos & Trousers',
    price: 2499,
    salePrice: 2199,
    description: 'Engineered utility cargos featuring 6 reinforced pockets, articulated knee pleats, and an adjustable drawstring hem. Built from resilient cotton twill for comfort on Jaipur streets.',
    details: [
      '310 GSM rugged cotton twill construction',
      'Relaxed straight fit with articulated knee darts',
      'Dual deep bellows cargo pockets with hidden snaps',
      'Elasticated waistband with durable tubular drawstrings',
      'Cuff cinch tabs to alternate between straight and tapered look'
    ],
    fabricCare: 'Cold machine wash. Wash separately for initial cycles. Do not bleach.',
    images: [
      '/src/assets/images/product_street_cargo_1792911393195.jpg'
    ],
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Stone Grey', 'Deep Black'],
    variants: [
      { size: '30', color: 'Stone Grey', stock: 5, sku: 'SV7-CRG-STN-30' },
      { size: '32', color: 'Stone Grey', stock: 10, sku: 'SV7-CRG-STN-32' },
      { size: '34', color: 'Stone Grey', stock: 8, sku: 'SV7-CRG-STN-34' },
      { size: '36', color: 'Stone Grey', stock: 6, sku: 'SV7-CRG-STN-36' },
      { size: '38', color: 'Stone Grey', stock: 3, sku: 'SV7-CRG-STN-38' }
    ],
    totalStock: 32,
    featured: true,
    trending: true,
    isNewArrival: true,
    createdAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'sev7n-hoodie-03',
    name: 'Chalk French Terry Heavyweight Hoodie',
    category: 'Hoodies & Sweatshirts',
    price: 2899,
    salePrice: null,
    description: '450 GSM luxury French terry oversized hoodie in natural chalk bone. Features a seamless double-layer hood without eyelets for a clean, sculptural contemporary drape.',
    details: [
      '450 GSM ultra-heavy French terry loopback fleece',
      'Double-layer structured architectural hood',
      'Deep kangaroo pocket with reinforced bartacks',
      'Relaxed drop-shoulder silhouette with heavy ribbed cuffs',
      'Tonal Sev7n minimalist emblem embroidery'
    ],
    fabricCare: 'Dry clean recommended or gentle hand wash in cold water. Lay flat to dry.',
    images: [
      '/src/assets/images/product_relaxed_hoodie_1792911394977.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Chalk Bone', 'Obsidian Black'],
    variants: [
      { size: 'S', color: 'Chalk Bone', stock: 4, sku: 'SV7-HD-CHK-S' },
      { size: 'M', color: 'Chalk Bone', stock: 11, sku: 'SV7-HD-CHK-M' },
      { size: 'L', color: 'Chalk Bone', stock: 10, sku: 'SV7-HD-CHK-L' },
      { size: 'XL', color: 'Chalk Bone', stock: 5, sku: 'SV7-HD-CHK-XL' }
    ],
    totalStock: 30,
    featured: true,
    trending: false,
    isNewArrival: true,
    createdAt: '2026-10-20T14:30:00Z'
  },
  {
    id: 'sev7n-jacket-04',
    name: 'Monochrome Tactical Zip Overshirt',
    category: 'Contemporary Jackets',
    price: 3299,
    salePrice: 2999,
    description: 'Structured technical cotton overshirt with industrial two-way matte zipper and modular chest compartments. An essential transitional layer tailored for evening wear.',
    details: [
      'Heavyweight 290 GSM matte cotton-poly technical weave',
      'Two-way matte black metal zip closure',
      'Angular chest patch pockets with flap closures',
      'Crisp pointed collar with concealed collar stays',
      'Square hem designed for layering over oversized tees'
    ],
    fabricCare: 'Dry clean only to maintain crisp structure and matte finish.',
    images: [
      '/src/assets/images/hero_streetwear_editorial_1792911392703.jpg'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Pitch Black', 'Slate Grey'],
    variants: [
      { size: 'M', color: 'Pitch Black', stock: 6, sku: 'SV7-JKT-BLK-M' },
      { size: 'L', color: 'Pitch Black', stock: 8, sku: 'SV7-JKT-BLK-L' },
      { size: 'XL', color: 'Pitch Black', stock: 4, sku: 'SV7-JKT-BLK-XL' }
    ],
    totalStock: 18,
    featured: true,
    trending: true,
    isNewArrival: false,
    createdAt: '2026-10-08T09:00:00Z'
  },
  {
    id: 'sev7n-shirt-05',
    name: 'Raw Edge Boxy Poplin Street Shirt',
    category: 'Street Shirts',
    price: 1899,
    salePrice: null,
    description: 'Crisp poplin cut into a boxy short-sleeve silhouette. Featuring clean mother-of-pearl buttons, a camp collar, and contemporary chest proportions.',
    details: [
      '100% fine cotton crisp poplin',
      'Cuban camp collar design',
      'Matte buttons with cross-stitch attachment',
      'Wide elbow-length sleeve drape',
      'Subtle Sev7n typographic print at back yoke'
    ],
    fabricCare: 'Machine wash warm with mild detergent. Warm iron while slightly damp.',
    images: [
      '/src/assets/images/product_oversized_tee_1792911393250.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crisp Chalk', 'Ash Olive'],
    variants: [
      { size: 'S', color: 'Crisp Chalk', stock: 3, sku: 'SV7-SHT-WHT-S' },
      { size: 'M', color: 'Crisp Chalk', stock: 7, sku: 'SV7-SHT-WHT-M' },
      { size: 'L', color: 'Crisp Chalk', stock: 9, sku: 'SV7-SHT-WHT-L' },
      { size: 'XL', color: 'Crisp Chalk', stock: 4, sku: 'SV7-SHT-WHT-XL' }
    ],
    totalStock: 23,
    featured: false,
    trending: true,
    isNewArrival: false,
    createdAt: '2026-10-02T11:00:00Z'
  },
  {
    id: 'sev7n-trouser-06',
    name: 'Pleated Wide Leg Minimalist Trouser',
    category: 'Cargos & Trousers',
    price: 2799,
    salePrice: 2499,
    description: 'Contemporary double-pleated relaxed trousers designed to break cleanly over chunky sneakers or dress shoes. Crafted from wool-blend suiting fabric.',
    details: [
      'Mid-weight premium twill suiting fabric',
      'Double front knife pleats for elevated volume',
      'Hook-and-bar waist closure with interior curtain waistband',
      'Deep slanted side pockets and double welt back pockets',
      'Unfinished hem allowing custom inseam tailoring'
    ],
    fabricCare: 'Dry clean only.',
    images: [
      '/src/assets/images/product_street_cargo_1792911393195.jpg'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Charcoal Heather', 'Midnight Black'],
    variants: [
      { size: '30', color: 'Charcoal Heather', stock: 4, sku: 'SV7-TRS-CH-30' },
      { size: '32', color: 'Charcoal Heather', stock: 8, sku: 'SV7-TRS-CH-32' },
      { size: '34', color: 'Charcoal Heather', stock: 6, sku: 'SV7-TRS-CH-34' },
      { size: '36', color: 'Charcoal Heather', stock: 3, sku: 'SV7-TRS-CH-36' }
    ],
    totalStock: 21,
    featured: false,
    trending: true,
    isNewArrival: true,
    createdAt: '2026-10-22T08:00:00Z'
  }
];
