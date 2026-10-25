import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => { success: boolean; error?: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  buyNow: (product: Product, size: string, color: string, quantity?: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sev7n_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to storage:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    // Find variant stock
    const variant = product.variants?.find(v => v.size === size && v.color === color);
    const availableStock = variant ? variant.stock : product.totalStock;

    if (availableStock <= 0) {
      return { success: false, error: 'Selected size and color is currently out of stock.' };
    }

    const cartItemId = `${product.id}_${size}_${color}`;
    const existingIndex = cart.findIndex(item => item.id === cartItemId);

    const price = product.salePrice || product.price;

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + quantity > availableStock) {
        return { 
          success: false, 
          error: `Only ${availableStock} units available in stock for this variant.` 
        };
      }
      const updated = [...cart];
      updated[existingIndex].quantity = currentQty + quantity;
      setCart(updated);
    } else {
      if (quantity > availableStock) {
        return { 
          success: false, 
          error: `Only ${availableStock} units available in stock.` 
        };
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        price,
        image: product.images[0] || '',
        size,
        color,
        quantity,
        availableStock
      };
      setCart(prev => [...prev, newItem]);
    }

    return { success: true };
  };

  const buyNow = (product: Product, size: string, color: string, quantity = 1) => {
    const res = addToCart(product, size, color, quantity);
    if (res.success) {
      setIsCartOpen(true);
      return true;
    }
    return false;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.availableStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        buyNow
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
