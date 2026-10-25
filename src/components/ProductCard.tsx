import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductId } = useStore();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.totalStock <= 0;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice! : product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // Pick first available variant size and color
    const firstAvailableVariant = product.variants.find(v => v.stock > 0) || {
      size: product.sizes[0] || 'M',
      color: product.colors[0] || 'Default',
      stock: 1
    };

    const res = addToCart(product, firstAvailableVariant.size, firstAvailableVariant.color, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  return (
    <div
      onClick={() => setSelectedProductId(product.id)}
      className="group flex flex-col bg-[#121216] border border-neutral-800/80 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-neutral-600 hover:-translate-y-0.5"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden">
        {!imageError && product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500 p-4 text-center">
            <span className="font-display font-semibold text-neutral-400 text-sm">{product.name}</span>
            <span className="text-xs text-neutral-600 mt-1">Sev7n Mansarovar</span>
          </div>
        )}

        {/* Subtle Text Tag (Section B: At most 1 subtle text tag, zero pills) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[11px] font-medium tracking-wide uppercase text-rose-400 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded">
              Sold Out
            </span>
          ) : product.isNewArrival ? (
            <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-300 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded">
              New Drop
            </span>
          ) : product.trending ? (
            <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-300 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded">
              Trending
            </span>
          ) : null}
        </div>

        {/* Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductId(product.id);
            }}
            className="flex-1 py-2 px-3 text-xs font-medium text-white bg-neutral-950/90 hover:bg-neutral-900 border border-neutral-700/80 rounded backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className={`p-2 rounded border backdrop-blur-sm transition-colors cursor-pointer ${
                justAdded
                  ? 'bg-emerald-700 text-white border-emerald-600'
                  : 'bg-white text-neutral-950 hover:bg-neutral-200 border-white'
              }`}
              title="Add default size to cart"
              aria-label="Add to cart"
            >
              {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category - Clean unboxed text */}
          <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider mb-1 font-medium">
            <span>{product.category}</span>
            <span className="text-[11px] text-neutral-400 lowercase font-normal">
              {product.colors[0]}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-neutral-200 transition-colors">
            {product.name}
          </h3>

          {/* Available Sizes List */}
          <div className="text-[11px] text-neutral-400 mt-1.5 truncate">
            <span>Sizes: </span>
            <span className="text-neutral-300">
              {product.sizes.join(' · ')}
            </span>
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-neutral-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-white tabular-nums">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasSale && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 font-medium">
            {isOutOfStock ? (
              <span className="text-rose-400">Out of Stock</span>
            ) : product.totalStock <= 5 ? (
              <span className="text-amber-400">Only {product.totalStock} left</span>
            ) : (
              <span>In Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
