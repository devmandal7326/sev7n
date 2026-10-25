import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal, totalItems } = useCart();
  const { settings, setCurrentPage } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const standardShippingFee = settings.standardShippingFee;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : standardShippingFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const finalTotal = subtotal + shippingFee;

  const handleStartCheckout = () => {
    setIsCheckoutOpen(true);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCartOpen]);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          className="fixed inset-y-0 right-0 max-w-md w-full bg-[#121216] border-l border-neutral-800 shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="font-display text-lg font-bold text-white tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs text-neutral-400 font-medium tabular-nums">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-neutral-900/90 px-5 py-2.5 border-b border-neutral-800/80 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Your order qualifies for complimentary express delivery across India!</span>
                </div>
              ) : (
                <div className="text-neutral-300">
                  <span>Add </span>
                  <strong className="text-white tabular-nums">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong>
                  <span> more to unlock free shipping.</span>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-800/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Your bag is empty</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Discover new oversized silhouettes, cargos, and jackets from Sev7n.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-white leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata: unboxed text with separators */}
                      <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                        <span>Size: <strong className="text-neutral-200">{item.size}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-700/80 rounded bg-neutral-900">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-xs font-semibold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.availableStock}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-neutral-200">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums text-neutral-200">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-medium">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-center text-neutral-400">
                  Orders dispatched directly from Mansarovar, Jaipur
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </>
  );
};
