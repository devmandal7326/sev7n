import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onResetFilters?: () => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onResetFilters,
  title,
  subtitle
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden h-80">
            <div className="aspect-[4/3] bg-neutral-800/60" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-neutral-800/80 rounded w-1/3" />
              <div className="h-4 bg-neutral-800/80 rounded w-2/3" />
              <div className="h-4 bg-neutral-800/80 rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center bg-neutral-900/50 border border-neutral-800/80 rounded-lg">
        <PackageOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white mb-1">No products match your criteria</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5">
          Try adjusting your search terms, changing the active category filter, or resetting price range sliders.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-medium text-neutral-900 bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-6">
          {subtitle && (
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
