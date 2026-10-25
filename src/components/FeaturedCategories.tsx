import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  name: ProductCategory;
  tagline: string;
  image: string;
  itemCount: number;
}

export const FeaturedCategories: React.FC = () => {
  const { setSelectedCategory, setCurrentPage, products } = useStore();

  const categories: CategoryItem[] = [
    {
      name: 'Oversized Tees',
      tagline: '260 GSM drop-shoulder silhouettes',
      image: '/src/assets/images/product_oversized_tee_1792911393250.jpg',
      itemCount: products.filter(p => p.category === 'Oversized Tees').length
    },
    {
      name: 'Cargos & Trousers',
      tagline: 'Articulated knee darts & utility pockets',
      image: '/src/assets/images/product_street_cargo_1792911393195.jpg',
      itemCount: products.filter(p => p.category === 'Cargos & Trousers').length
    },
    {
      name: 'Hoodies & Sweatshirts',
      tagline: '450 GSM French terry loopback fleece',
      image: '/src/assets/images/product_relaxed_hoodie_1792911394977.jpg',
      itemCount: products.filter(p => p.category === 'Hoodies & Sweatshirts').length
    },
    {
      name: 'Contemporary Jackets',
      tagline: 'Technical overshirts & tactical zip outerwear',
      image: '/src/assets/images/hero_streetwear_editorial_1792911392703.jpg',
      itemCount: products.filter(p => p.category === 'Contemporary Jackets').length
    }
  ];

  const handleSelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCurrentPage('shop');
  };

  return (
    <section className="py-14 md:py-20 bg-[#0d0d0f] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('shop');
            }}
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.name}
              onClick={() => handleSelect(cat.name)}
              className="group relative overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800/80 cursor-pointer transition-all duration-300 hover:border-neutral-600 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              </div>

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-neutral-200 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-neutral-900/80 border border-neutral-700 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                  {cat.tagline}
                </p>
                <div className="text-[11px] text-neutral-400 mt-2">
                  <span className="tabular-nums">{cat.itemCount}</span> items available
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
