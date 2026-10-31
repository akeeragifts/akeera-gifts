import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BrandSettingsModal } from './components/common/BrandSettingsModal';

import { defaultBusinessConfig, BusinessConfig } from './config/businessConfig';
import { Product } from './types/product';
import { usePageMetadata } from './utils/usePageMetadata';
import { Store, ArrowLeft, MessageSquare, Settings, Package, WifiOff, FolderTree } from 'lucide-react';
import { AdminReviewsManager } from './components/admin/AdminReviewsManager';
import { AdminProductsManager } from './components/admin/AdminProductsManager';
import { AdminCategoriesManager } from './components/admin/AdminCategoriesManager';
import { AdminDashboardSummaryCard } from './components/admin/AdminDashboardSummaryCard';

export default function App() {
  // Centralized Business & Branding Configuration
  // "Ecommerce" is the configurable business name
  const [config, setConfig] = useState<BusinessConfig>({ ...defaultBusinessConfig });

  // Parse initial route from URL hash or query param to guarantee reliable refreshes and direct opens
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = (searchParams.get('page') || hash).toLowerCase();

    if (pageParam === 'hampers' || pageParam === 'gift-hampers') return 'hampers';
    if (pageParam === 'shop') return 'shop';
    if (pageParam === 'about') return 'about';
    if (pageParam === 'contact') return 'contact';
    if (pageParam === 'admin') return 'admin';
    return 'home';
  });

  const [pageParams, setPageParams] = useState<any>(() => {
    if (typeof window === 'undefined') return {};
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = (searchParams.get('page') || hash).toLowerCase();
    const cat = searchParams.get('category');
    if (pageParam === 'hampers' || pageParam === 'gift-hampers') {
      return { category: 'gift-hampers' };
    }
    return cat ? { category: cat } : {};
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Controlled, synchronized search state across Header and Catalog
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Brand Settings Modal (Only accessible from administrative route)
  const [adminSettingsOpen, setAdminSettingsOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'products' | 'categories' | 'reviews' | 'settings'>('products');

  // Network connectivity status listener for genuine offline notifications
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchronize browser history / URL hash changes on refresh and popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'hampers' || hash === 'gift-hampers') {
        setCurrentPage('hampers');
        setPageParams({ category: 'gift-hampers' });
      } else if (hash === 'shop') {
        setCurrentPage('shop');
        setPageParams({});
      } else if (hash === 'home' || hash === '') {
        setCurrentPage('home');
        setPageParams({});
      } else if (hash === 'about') {
        setCurrentPage('about');
        setPageParams({});
      } else if (hash === 'contact') {
        setCurrentPage('contact');
        setPageParams({});
      } else if (hash === 'admin') {
        setCurrentPage('admin');
        setPageParams({});
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic SEO & Title Manager
  usePageMetadata({
    page: currentPage,
    product: selectedProduct,
    pageParams: {
      ...pageParams,
      search: searchQuery || pageParams?.search,
    },
    storeName: config.storeName,
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      if (currentPage !== 'shop' && currentPage !== 'hampers' && currentPage !== 'gift-hampers') {
        // If typing from Home, About, or Contact, navigate to Shop All
        setCurrentPage('shop');
        setPageParams((prev: any) => ({ ...prev, search: query }));
        if (typeof window !== 'undefined') {
          window.location.hash = 'shop';
        }
      } else {
        // Maintain current active view (either Shop All or Gift Hampers)
        setPageParams((prev: any) => ({ ...prev, search: query }));
      }
    }
  };

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    if (params.search !== undefined) {
      setSearchQuery(params.search);
    }
    // Update hash so refreshing and browser back/forward preserve the exact route
    if (typeof window !== 'undefined') {
      if (page === 'home') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = page;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('product');
  };

  // If viewing the admin dashboard / management area
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#FFF9F4] text-[#292526] p-4 sm:p-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Offline Notification Banner */}
          {!isOnline && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center gap-2.5 shadow-2xs">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are currently browsing offline. Local catalog browsing remains available.
              </span>
            </div>
          )}

          {/* Admin Top Header */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#B85C75]/10 text-[#B85C75] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif-display font-bold text-xl text-stone-900 leading-tight">
                  {config.storeName} · Store Administration
                </h1>
                <p className="text-xs text-stone-500">
                  Production database console: Manage products, categories, reviews, and store branding.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="text-xs font-semibold text-stone-600 hover:text-[#B85C75] border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Storefront</span>
              </button>
            </div>
          </div>

          {/* Recharts Analytics Dashboard Summary Card */}
          <AdminDashboardSummaryCard
            currencySymbol={config.currencySymbol}
          />

          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-stone-200/80 gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setAdminTab('products')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                adminTab === 'products'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('categories')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                adminTab === 'categories'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('reviews')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                adminTab === 'reviews'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Reviews</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('settings')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] ${
                adminTab === 'settings'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings & WhatsApp</span>
            </button>
          </div>

          {/* Admin Tab Content */}
          {adminTab === 'products' ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <AdminProductsManager
                onOpenProductDetails={handleOpenProduct}
                currencySymbol={config.currencySymbol}
              />
            </div>
          ) : adminTab === 'categories' ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <AdminCategoriesManager />
            </div>
          ) : adminTab === 'reviews' ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <AdminReviewsManager />
            </div>
          ) : (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif-display font-bold text-lg text-stone-900">
                  Branding & Contact Configuration
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update store title, WhatsApp number, and announcement message.
                </p>
              </div>

              <div className="space-y-3 text-xs text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <p>
                  Store Name: <strong className="text-stone-900">{config.storeName}</strong>
                </p>
                <p>
                  WhatsApp Ordering Number: <strong className="text-stone-900">{config.whatsAppNumber}</strong>
                </p>
                <p>
                  Announcement Bar: <span className="text-stone-700 italic">&ldquo;{config.announcementBarText}&rdquo;</span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setAdminSettingsOpen(true)}
                  className="bg-[#B85C75] hover:bg-[#9A465C] text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Configure Store Branding & WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        <BrandSettingsModal
          isOpen={adminSettingsOpen}
          onClose={() => setAdminSettingsOpen(false)}
          config={config}
          onUpdateConfig={(newConfig) => setConfig(newConfig)}
        />
      </div>
    );
  }

  // Public customer-facing catalog layout (No floating settings overlay, zero public admin buttons)
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4]/40 text-[#292526] selection:bg-[#F8E8ED] selection:text-[#B85C75] font-sans antialiased">
      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="bg-amber-50 border-b border-amber-300 text-amber-900 text-xs py-2 px-4 flex items-center justify-center gap-2 text-center font-medium">
          <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>You are currently offline. Local catalog browsing remains available. Connect to internet to chat on WhatsApp.</span>
        </div>
      )}

      {/* 1. Global Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={navigate}
        storeName={config.storeName}
        announcementText={config.announcementBarText}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 2. Main View Router */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigate}
            onOpenProductDetails={handleOpenProduct}
            storeName={config.storeName}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            key="shop-all"
            mode="shop-all"
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            initialSearch={pageParams.search || ''}
            initialCategory={pageParams.category || ''}
            initialSort={pageParams.sort || 'featured'}
            onOpenProductDetails={handleOpenProduct}
            onNavigate={navigate}
            storeName={config.storeName}
            currencySymbol={config.currencySymbol}
          />
        )}

        {(currentPage === 'hampers' || currentPage === 'gift-hampers') && (
          <ShopPage
            key="gift-hampers"
            mode="gift-hampers"
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            initialSearch={pageParams.search || ''}
            initialCategory="gift-hampers"
            initialSort={pageParams.sort || 'featured'}
            onOpenProductDetails={handleOpenProduct}
            onNavigate={navigate}
            storeName={config.storeName}
            currencySymbol={config.currencySymbol}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigate(selectedProduct.categoryId === 'cat-hampers' ? 'hampers' : 'shop')}
            onOpenProductDetails={handleOpenProduct}
            storeName={config.storeName}
            currencySymbol={config.currencySymbol}
            whatsAppNumber={config.whatsAppNumber}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={navigate}
            storeName={config.storeName}
            whatsAppNumber={config.whatsAppNumber}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={navigate}
            storeName={config.storeName}
            whatsAppNumber={config.whatsAppNumber}
            contactEmail={config.contactEmail}
            contactPhone={config.contactPhone}
            contactAddress={config.contactAddress}
          />
        )}
      </main>

      {/* 3. Global Boutique Footer (Customer-facing only) */}
      <Footer
        onNavigate={navigate}
        storeName={config.storeName}
      />
    </div>
  );
}
