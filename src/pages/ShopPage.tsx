import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Product, Category } from '../types/product';
import { productService, ProductFilters } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import { defaultBusinessConfig } from '../config/businessConfig';
import { usePageMetadata } from '../utils/usePageMetadata';

interface ShopPageProps {
  mode?: 'shop-all' | 'gift-hampers';
  initialSearch?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  initialCategory?: string;
  initialSort?: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  onOpenProductDetails: (product: Product) => void;
  onNavigate?: (page: string, params?: any) => void;
  storeName?: string;
  currencySymbol?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  mode = 'shop-all',
  initialSearch = '',
  searchQuery,
  onSearchChange,
  initialCategory = '',
  initialSort = 'featured',
  onOpenProductDetails,
  onNavigate,
  storeName = defaultBusinessConfig.storeName,
  currencySymbol = defaultBusinessConfig.currencySymbol,
}) => {
  const isHampersPage = mode === 'gift-hampers';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback internal search query state if not controlled externally
  const [internalSearch, setInternalSearch] = useState(initialSearch);
  const currentSearch = searchQuery !== undefined ? searchQuery : internalSearch;

  // Selected Category: If on Gift Hampers page, locked to 'gift-hampers'
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(
    isHampersPage ? 'gift-hampers' : initialCategory
  );
  const [sortOption, setSortOption] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if mode or initial props change
  useEffect(() => {
    if (isHampersPage) {
      setSelectedCategorySlug('gift-hampers');
    } else {
      setSelectedCategorySlug(initialCategory || '');
    }
  }, [isHampersPage, initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined && searchQuery === undefined) {
      setInternalSearch(initialSearch);
    }
  }, [initialSearch, searchQuery]);

  // Active Category Object
  const activeCategory = categories.find((c) => c.slug === (isHampersPage ? 'gift-hampers' : selectedCategorySlug));

  // Dynamic SEO metadata
  usePageMetadata({
    page: isHampersPage ? 'hampers' : 'shop',
    pageParams: {
      category: isHampersPage ? 'gift-hampers' : selectedCategorySlug,
      search: currentSearch,
    },
    storeName,
  });

  // Load Categories and All Published Products on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      productService.getCategories(),
      productService.getAllPublishedProducts(),
    ])
      .then(([cats, prods]) => {
        if (!mounted) return;
        setCategories(cats);
        setAllProducts(prods);
      })
      .catch((err) => {
        console.error('Failed to load catalog data:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Handle search input updates
  const handleSearchInput = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    } else {
      setInternalSearch('');
    }
  };

  // Instant, safe, immutable filtering via useMemo
  // On Gift Hampers page, category is strictly locked to 'gift-hampers'
  const effectiveCategorySlug = isHampersPage ? 'gift-hampers' : (selectedCategorySlug || undefined);

  const filteredProducts = useMemo(() => {
    const filters: ProductFilters = {
      categorySlug: effectiveCategorySlug,
      search: currentSearch.trim() || undefined,
      maxPrice: maxPrice < 3000 ? maxPrice : undefined,
      sort: sortOption,
      isFeatured: onlyFeatured || undefined,
    };
    return productService.filterProducts(allProducts, filters);
  }, [allProducts, effectiveCategorySlug, currentSearch, maxPrice, sortOption, onlyFeatured]);

  // Total available hampers vs total available catalog items
  const totalHampersCount = useMemo(() => {
    const hamperCat = categories.find((c) => c.slug === 'gift-hampers');
    return hamperCat ? allProducts.filter((p) => p.categoryId === hamperCat.id).length : 0;
  }, [categories, allProducts]);

  const handleResetFilters = () => {
    handleClearSearch();
    if (!isHampersPage) {
      setSelectedCategorySlug('');
    }
    setMaxPrice(3000);
    setOnlyFeatured(false);
    setSortOption('featured');
  };

  const hasActiveFilters =
    Boolean(currentSearch.trim()) ||
    (!isHampersPage && Boolean(selectedCategorySlug)) ||
    maxPrice < 3000 ||
    onlyFeatured;

  return (
    <div className="bg-[#FFF9F4]/30 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#F8E8ED]/70 via-[#FFF9F4]/40 to-transparent border-b border-[#A7B7A0]/20 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#B85C75]">
            {isHampersPage ? 'Bespoke Bundles & Trunks' : 'Curated Gift Collection'}
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292526]">
            {isHampersPage
              ? 'Luxury Gift Hampers'
              : activeCategory
              ? activeCategory.name
              : 'All Curated Gifts'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {isHampersPage
              ? 'Multi-piece luxury bundles, celebration trunks, and hand-packed keepsake boxes arranged with artisanal flair. Order directly on WhatsApp.'
              : activeCategory
              ? activeCategory.description
              : 'Browse our full showcase of artisan gift boxes, plush companions, fragrances, and keepsakes. Order directly through WhatsApp.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Controls Bar: Search, Sort, and Mobile Filter Toggle */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between pb-5 sm:pb-6 border-b border-stone-200">
          {/* Controlled Search Input */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                isHampersPage
                  ? 'Search gift hampers, celebration boxes...'
                  : 'Search gifts, teddy, jewellery, hampers...'
              }
              value={currentSearch}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full text-xs pl-10 pr-9 py-2.5 min-h-[44px] rounded-full bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-900 shadow-2xs"
            />
            {currentSearch ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 justify-between sm:justify-end w-full sm:w-auto">
            {/* Mobile Filter Button (44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white border border-stone-300 px-4 py-2.5 min-h-[44px] rounded-xl shadow-2xs hover:bg-stone-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#B85C75]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Selector (44px touch target) */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <span className="text-xs text-stone-500 hidden sm:inline shrink-0">Sort:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="w-full sm:w-auto appearance-none bg-white border border-stone-300 text-xs font-medium rounded-xl py-2.5 min-h-[44px] pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-800 shadow-2xs cursor-pointer"
                >
                  <option value="featured">Featured Keepsakes</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips / Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 pb-2">
            <span className="text-xs text-stone-500 font-medium">Active filters:</span>
            {currentSearch.trim() && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F8E8ED] text-[#B85C75] font-medium px-3 py-1 rounded-full border border-[#B85C75]/20">
                <span>Keyword: &ldquo;{currentSearch.trim()}&rdquo;</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-stone-900 cursor-pointer"
                  title="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {!isHampersPage && selectedCategorySlug && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 font-medium px-3 py-1 rounded-full border border-stone-300">
                <span>Category: {activeCategory ? activeCategory.name : selectedCategorySlug}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategorySlug('')}
                  className="hover:text-stone-900 cursor-pointer"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPrice < 3000 && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 font-medium px-3 py-1 rounded-full border border-stone-300">
                <span>Under {currencySymbol}{maxPrice}</span>
                <button
                  type="button"
                  onClick={() => setMaxPrice(3000)}
                  className="hover:text-stone-900 cursor-pointer"
                  title="Remove budget filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyFeatured && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-800 font-medium px-3 py-1 rounded-full border border-stone-300">
                <span>Featured only</span>
                <button
                  type="button"
                  onClick={() => setOnlyFeatured(false)}
                  className="hover:text-stone-900 cursor-pointer"
                  title="Remove featured filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#B85C75] hover:underline font-semibold ml-1 cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          </div>
        )}

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-stone-900 text-sm">
                  {isHampersPage ? 'Hamper Options' : 'Filter Catalog'}
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#B85C75] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <span className="font-bold text-xs text-stone-800 block">
                  {isHampersPage ? 'Active Category' : 'Collections'}
                </span>

                {isHampersPage ? (
                  <div className="space-y-3">
                    <div className="bg-[#F8E8ED] text-[#B85C75] p-3 rounded-2xl border border-[#B85C75]/25 text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#B85C75]" />
                        <span>Gift Hampers</span>
                      </div>
                      <span className="text-[10px] bg-white text-[#B85C75] px-2 py-0.5 rounded-full font-mono font-bold">
                        {totalHampersCount} items
                      </span>
                    </div>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('shop')}
                        className="w-full text-left p-3 rounded-2xl border border-stone-200 hover:border-[#B85C75]/40 text-stone-600 hover:text-[#B85C75] hover:bg-stone-50 transition-colors text-xs font-medium flex items-center justify-between group cursor-pointer"
                      >
                        <span>Browse Shop All</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategorySlug('')}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        !selectedCategorySlug
                          ? 'bg-[#F8E8ED] text-[#B85C75] font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>All Collections</span>
                      <span className="text-[10px] text-stone-400 font-mono">({allProducts.length})</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategorySlug(cat.slug)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                          selectedCategorySlug === cat.slug
                            ? 'bg-[#F8E8ED] text-[#B85C75] font-bold'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-[10px] text-stone-400 font-mono">({cat.productCount})</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="space-y-2.5 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-800">Max Budget</span>
                  <span className="font-serif-display font-bold text-[#B85C75]">
                    {maxPrice >= 3000 ? 'Any' : `${currencySymbol}${maxPrice}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B85C75] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>{currencySymbol}200</span>
                  <span>{currencySymbol}1,500</span>
                  <span>{currencySymbol}3,000+</span>
                </div>
              </div>

              {/* Special Toggles */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                    className="rounded text-[#B85C75] focus:ring-[#B85C75] accent-[#B85C75]"
                  />
                  <span>Featured Highlights Only</span>
                </label>
              </div>

              {/* WhatsApp Concierge Banner */}
              <div className="p-4 bg-[#FFF9F4] rounded-2xl border border-[#A7B7A0]/25 text-xs space-y-1.5">
                <span className="font-bold text-[#B85C75] block">
                  {isHampersPage ? 'Custom Hamper Curation' : 'Need custom gifting advice?'}
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {isHampersPage
                    ? 'Want to swap products or design a custom corporate gift hamper? Chat with our team on WhatsApp.'
                    : 'Message our team directly on WhatsApp to customize box combinations or bulk party favors.'}
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Products count and active badge */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>
                Showing <strong className="text-stone-900 font-semibold">{filteredProducts.length}</strong>{' '}
                {isHampersPage ? 'exclusive gift hampers' : 'thoughtfully crafted items'}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#B85C75] hover:underline font-semibold cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-stone-200" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={onOpenProductDetails}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200/80 space-y-4 max-w-lg mx-auto my-8 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#F8E8ED] text-[#B85C75] flex items-center justify-center mx-auto">
                  <Gift className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display font-bold text-stone-900 text-lg sm:text-xl">
                  {currentSearch.trim()
                    ? isHampersPage
                      ? `No gift hampers found matching "${currentSearch.trim()}"`
                      : `No gifts found matching "${currentSearch.trim()}"`
                    : isHampersPage
                    ? 'No gift hampers match your filter'
                    : 'No gifts match your filter'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                  {currentSearch.trim()
                    ? isHampersPage
                      ? 'No hamper curations match this search. Try searching for "celebration", "candle", or "coffee", or clear search to browse all hampers.'
                      : 'Try checking for spelling errors, trying simpler keywords like "teddy", "candle", or "hamper", or clearing search to browse everything.'
                    : 'Try adjusting your budget limit or filters, or ask us directly on WhatsApp!'}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full sm:w-auto bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    {isHampersPage ? 'Clear Search & View All Hampers' : 'Clear Search & View All Gifts'}
                  </button>
                  {isHampersPage && onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('shop')}
                      className="w-full sm:w-auto border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Browse All Categories in Shop All
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B85C75]" />
                  <span className="font-bold text-sm text-stone-900">
                    {isHampersPage ? 'Hamper Filters' : 'Filters'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-stone-800 block">
                  {isHampersPage ? 'Collection' : 'Collection'}
                </span>

                {isHampersPage ? (
                  <div className="space-y-2">
                    <div className="bg-[#F8E8ED] text-[#B85C75] p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span>Gift Hampers</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-mono font-bold">
                        {totalHampersCount} items
                      </span>
                    </div>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileFilterOpen(false);
                          onNavigate('shop');
                        }}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium flex items-center justify-between"
                      >
                        <span>View Shop All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug('');
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        !selectedCategorySlug ? 'bg-[#F8E8ED] text-[#B85C75] font-bold' : 'text-stone-600'
                      }`}
                    >
                      All Collections ({allProducts.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategorySlug(cat.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                          selectedCategorySlug === cat.slug ? 'bg-[#F8E8ED] text-[#B85C75] font-bold' : 'text-stone-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-800">Budget Limit</span>
                  <span className="font-bold text-[#B85C75]">
                    {maxPrice >= 3000 ? 'Any' : `${currencySymbol}${maxPrice}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B85C75]"
                />
              </div>

              {/* Featured */}
              <div className="pt-4 border-t border-stone-100">
                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                    className="rounded text-[#B85C75] focus:ring-[#B85C75] accent-[#B85C75]"
                  />
                  <span>Featured Highlights Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs font-semibold py-3 rounded-xl shadow-xs"
              >
                Show Results ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full text-xs text-stone-500 hover:text-stone-800 py-2"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
