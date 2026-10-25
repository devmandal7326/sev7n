import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { 
  X, 
  ArrowLeft,
  ShoppingBag, 
  MessageSquare, 
  MapPin, 
  Ruler, 
  Check, 
  ShieldAlert, 
  Truck,
  Sparkles
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProductId, setSelectedProductId, products, openWhatsAppChat, showToast, goBack } = useStore();
  const { addToCart, buyNow, setIsCartOpen } = useCart();

  const product = products.find(p => p.id === selectedProductId);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [addFeedback, setAddFeedback] = useState<boolean>(false);

  // Initialize selected size and color when product opens
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      setActiveImageIndex(0);
      setAddFeedback(false);
    }
  }, [product]);

  if (!selectedProductId || !product) {
    return null;
  }

  // Calculate variant stock
  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const variantStock = currentVariant ? currentVariant.stock : product.totalStock;
  const isOutOfStock = variantStock <= 0;

  const hasSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice! : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Selected variant is out of stock', 'error');
      return;
    }
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setAddFeedback(true);
      showToast(`Added ${product.name} (${selectedSize}) to bag`, 'success');
      setTimeout(() => setAddFeedback(false), 2000);
    } else {
      showToast(res.error || 'Failed to add item', 'error');
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('Selected variant is out of stock', 'error');
      return;
    }
    const success = buyNow(product, selectedSize, selectedColor, quantity);
    if (success) {
      setSelectedProductId(null);
    }
  };

  const handleWhatsAppInquiry = () => {
    openWhatsAppChat('product', {
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#121216] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => goBack()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-950/90 hover:bg-neutral-900 border border-neutral-700/80 rounded-full transition-colors cursor-pointer backdrop-blur-sm shadow-md"
            aria-label="Go back to previous step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white bg-neutral-950/90 hover:bg-neutral-900 border border-neutral-700/80 rounded-full transition-colors cursor-pointer backdrop-blur-sm shadow-md"
          aria-label="Close product modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 bg-neutral-950 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-md overflow-hidden bg-neutral-900 border border-neutral-800/80">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded overflow-hidden border cursor-pointer shrink-0 transition-colors ${
                        activeImageIndex === idx ? 'border-white' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-store Trial Notice */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Available for Store Trial</p>
                <p className="text-neutral-400">
                  Try this piece at our Mansarovar, Jaipur store before purchasing. Open until 10 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1.5">
                <span>{product.category}</span>
                <span className="tabular-nums">SKU: {currentVariant?.sku || 'SV7-INVENTORY'}</span>
              </div>

              {/* Product Title */}
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Price & Stock Display */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-display text-2xl font-extrabold text-white tabular-nums">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasSale && (
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
                {hasSale && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Save ₹{(product.price - product.salePrice!).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-neutral-300 text-sm leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-300 mb-2">
                    <span>Color: <strong className="text-white">{selectedColor}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                          selectedColor === color
                            ? 'bg-white text-neutral-950 border-white font-semibold'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector & Size Guide */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-300 mb-2">
                  <span>Size: <strong className="text-white">{selectedSize}</strong></span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    const variant = product.variants?.find(
                      v => v.size === size && v.color === selectedColor
                    );
                    const isAvailable = variant ? variant.stock > 0 : product.totalStock > 0;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 h-10 px-3 text-xs font-semibold rounded border transition-all cursor-pointer flex items-center justify-center ${
                          selectedSize === size
                            ? 'bg-white text-neutral-950 border-white'
                            : isAvailable
                            ? 'bg-neutral-900 text-neutral-200 border-neutral-700 hover:border-neutral-500'
                            : 'bg-neutral-950 text-neutral-600 border-neutral-850 line-through cursor-not-allowed opacity-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Live Stock Notification */}
                <div className="mt-3 text-xs">
                  {isOutOfStock ? (
                    <span className="text-rose-400 flex items-center gap-1 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Currently Out of Stock in Size {selectedSize}.
                    </span>
                  ) : variantStock <= 5 ? (
                    <span className="text-amber-400 font-medium">
                      Low stock: Only {variantStock} left in this size at Jaipur warehouse.
                    </span>
                  ) : (
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      In Stock ({variantStock} available). Ready for dispatch or Mansarovar pickup.
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              {!isOutOfStock && (
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-medium text-neutral-300">Quantity</span>
                  <div className="flex items-center border border-neutral-700 rounded bg-neutral-900">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-semibold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Size Guide Drawer / Panel */}
              {showSizeGuide && (
                <div className="mt-4 p-4 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 animate-in fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-white">Oversized Silhouette Fit Guide (Inches)</span>
                    <button onClick={() => setShowSizeGuide(false)} className="text-neutral-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse text-[11px] tabular-nums">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400">
                        <th className="py-1">Size</th>
                        <th className="py-1">Chest (Pit-to-Pit)</th>
                        <th className="py-1">Length</th>
                        <th className="py-1">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      <tr><td className="py-1 font-semibold text-white">S</td><td>42"</td><td>28"</td><td>21"</td></tr>
                      <tr><td className="py-1 font-semibold text-white">M</td><td>44"</td><td>29"</td><td>22"</td></tr>
                      <tr><td className="py-1 font-semibold text-white">L</td><td>46"</td><td>30"</td><td>23"</td></tr>
                      <tr><td className="py-1 font-semibold text-white">XL</td><td>48"</td><td>31"</td><td>24"</td></tr>
                      <tr><td className="py-1 font-semibold text-white">XXL</td><td>50"</td><td>32"</td><td>25"</td></tr>
                    </tbody>
                  </table>
                  <p className="mt-2 text-[10px] text-neutral-400">
                    *Designed with an intentional relaxed drop-shoulder cut. Order true to size for boxy fit.
                  </p>
                </div>
              )}

              {/* Details & Specifications Accordion */}
              {product.details && product.details.length > 0 && (
                <div className="mt-6 pt-5 border-t border-neutral-800">
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Specifications & Details
                  </h4>
                  <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                  {product.fabricCare && (
                    <p className="text-[11px] text-neutral-400 mt-3 italic">
                      Care: {product.fabricCare}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`py-3 px-4 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : addFeedback
                      ? 'bg-emerald-700 text-white'
                      : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                  }`}
                >
                  {addFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`py-3 px-4 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-white text-neutral-950 hover:bg-neutral-200 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp direct inquiry button */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-4 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/80 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Ask about this piece on WhatsApp (+91 86198 90774)</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Jaipur 24-48h Delivery
                </span>
                <span>·</span>
                <span>In-Store Pickup Available</span>
                <span>·</span>
                <span>Exchange within 7 Days</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
