import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { ProductGrid } from './ProductGrid';
import { Search, X, SlidersHorizontal, ArrowUpDown, ArrowLeft } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    isLoading, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    goBack
  } = useStore();

  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Oversized Tees',
    'Cargos & Trousers',
    'Hoodies & Sweatshirts',
    'Contemporary Jackets',
    'Street Shirts'
  ];

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.sizes.forEach(s => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.colors.forEach(c => set.add(c)));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      // Size
      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }
      // Color
      if (selectedColor !== 'All' && !product.colors.includes(selectedColor)) {
        return false;
      }
      // In Stock
      if (onlyInStock && product.totalStock <= 0) {
        return false;
      }
      // Price
      const activePrice = product.salePrice || product.price;
      if (activePrice > priceRange) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortOption === 'price_asc') return priceA - priceB;
      if (sortOption === 'price_desc') return priceB - priceA;
      if (sortOption === 'popular') return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, searchQuery, selectedSize, selectedColor, onlyInStock, priceRange, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedSize('All');
    setSelectedColor('All');
    setOnlyInStock(false);
    setPriceRange(5000);
    setSortOption('newest');
  };

  const isFiltered = selectedCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    selectedSize !== 'All' || 
    selectedColor !== 'All' || 
    onlyInStock || 
    priceRange < 5000;

  return (
    <div className="bg-[#0d0d0f] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <button
                onClick={() => goBack()}
                className="hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Go back to previous view"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">Contemporary Catalog</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sev7n Wardrobe
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 tabular-nums">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} garments
            </span>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 border border-neutral-800 rounded"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          
          {/* Top Row: Search & Category Tabs */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by garment, fabric, or style..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <label htmlFor="sort-select" className="text-xs text-neutral-400 whitespace-nowrap">Sort by:</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e: any) => setSortOption(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-neutral-600 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Popular & Trending</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Segmented Controls (Section 1A: functional buttons allowed for filtering) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Strip (Desktop & Toggled Mobile) */}
          <div className={`${mobileFilterOpen ? 'block' : 'hidden md:block'} p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              
              {/* Size Selector */}
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700/80 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  {availableSizes.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Sizes' : `Size ${s}`}</option>
                  ))}
                </select>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Color Palette</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700/80 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  {availableColors.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Colors' : c}</option>
                  ))}
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between text-neutral-400 font-medium mb-1">
                  <span>Max Price</span>
                  <span className="text-white tabular-nums font-semibold">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-1.5 bg-neutral-800 rounded"
                />
              </div>

              {/* Stock Checkbox & Reset */}
              <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-white rounded"
                  />
                  <span>In Stock Only</span>
                </label>

                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="text-neutral-400 hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Product Grid Component */}
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
        />

      </div>
    </div>
  );
};
