export type ProductCategory = 
  | 'Oversized Tees'
  | 'Cargos & Trousers'
  | 'Hoodies & Sweatshirts'
  | 'Contemporary Jackets'
  | 'Street Shirts'
  | 'Accessories';

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  salePrice?: number | null;
  description: string;
  details: string[];
  fabricCare: string;
  images: string[];
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  totalStock: number;
  featured?: boolean;
  trending?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // composite: `${productId}_${size}_${color}`
  productId: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  availableStock: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export type PaymentMethod = 'whatsapp' | 'razorpay' | 'store_pickup' | 'cod';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'not_applicable';
  paymentId?: string;
  whatsappMessageSent?: boolean;
}

export interface StorePolicy {
  title: string;
  lastUpdated: string;
  content: string;
}

export interface StoreSettings {
  brandName: string;
  hindiBrandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  plusCode: string;
  closingTime: string;
  googleMapsDirectionsUrl: string;
  rating: number;
  reviewsCount: number;
  announcement: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  policies: {
    privacy: StorePolicy;
    terms: StorePolicy;
    shipping: StorePolicy;
    returns: StorePolicy;
    cancellation: StorePolicy;
  };
  cashOnDeliveryEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}
