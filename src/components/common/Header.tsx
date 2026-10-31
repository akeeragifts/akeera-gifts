import React, { useState, useRef, useEffect } from 'react';
import {
  Gift,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { defaultBusinessConfig } from '../../config/businessConfig';
import { Category } from '../../types/product';
import { productService } from '../../services/productService';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  storeName?: string;
  announcementText?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentPage,
  storeName = defaultBusinessConfig.storeName,
  announcementText = defaultBusinessConfig.announcementBarText,
  searchQuery = '',
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Load categories for dropdown
  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  // Close categories dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Handle search input changes
  const handleInputChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'shop') {
      onNavigate('shop', { search: searchQuery });
    }
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  // Clear search input
  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
    if (desktopSearchInputRef.current) {
      desktopSearchInputRef.current.focus();
    }
  };

  const handleWhatsAppGeneralChat = () => {
    const num = defaultBusinessConfig.whatsAppNumber;
    const msg = encodeURIComponent(`Hello! I am browsing ${storeName} and would like assistance choosing a gift.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#A7B7A0]/25 transition-all w-full">
      {/* 1. Slim Announcement Bar */}
      {announcementText && (
        <div className="bg-[#B85C75] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 overflow-hidden">
          <Sparkles className="w-3 h-3 text-[#F8E8ED] shrink-0" />
          <span className="truncate max-w-[92vw] sm:max-w-none">{announcementText}</span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-5 relative">
          
          {/* Mobile Hamburger Button (Touch target >= 44x44px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center text-stone-700 hover:text-[#B85C75] rounded-xl hover:bg-[#F8E8ED]/50 transition-colors cursor-pointer select-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Business Logo & Name (Guaranteed visible, flex-shrink-0, never squeezed or truncated) */}
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            className="flex-shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#B85C75] to-[#9A465C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Gift className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <span className="font-serif-display text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-[#292526] group-hover:text-[#B85C75] transition-colors whitespace-nowrap block leading-tight">
                {storeName}
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest uppercase font-semibold text-[#A7B7A0] leading-none mt-0.5 whitespace-nowrap">
                Bespoke Gifting
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6 text-xs font-semibold shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors hover:text-[#B85C75] py-2 cursor-pointer whitespace-nowrap ${
                currentPage === 'home' ? 'text-[#B85C75] font-bold border-b-2 border-[#B85C75]' : 'text-stone-700'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('shop', { search: '', category: '' })}
              className={`transition-colors hover:text-[#B85C75] py-2 cursor-pointer whitespace-nowrap ${
                currentPage === 'shop' && !searchQuery ? 'text-[#B85C75] font-bold border-b-2 border-[#B85C75]' : 'text-stone-700'
              }`}
            >
              Shop All
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 text-stone-700 hover:text-[#B85C75] transition-colors py-2 cursor-pointer whitespace-nowrap"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="p-2 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Collections & Occasions
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (cat.slug === 'gift-hampers') {
                            onNavigate('hampers', { search: '' });
                          } else {
                            onNavigate('shop', { category: cat.slug, search: '' });
                          }
                          setCategoriesOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-[#F8E8ED]/60 hover:text-[#B85C75] transition-colors font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span>{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-[10px] text-stone-400 font-mono">({cat.productCount})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('shop', { sort: 'newest' })}
              className="text-stone-700 hover:text-[#B85C75] transition-colors py-2 cursor-pointer whitespace-nowrap"
            >
              New Arrivals
            </button>

            <button
              onClick={() => onNavigate('hampers', { search: '' })}
              className={`transition-colors hover:text-[#B85C75] py-2 cursor-pointer whitespace-nowrap ${
                currentPage === 'hampers' || currentPage === 'gift-hampers'
                  ? 'text-[#B85C75] font-bold border-b-2 border-[#B85C75]'
                  : 'text-stone-700'
              }`}
            >
              Gift Hampers
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors hover:text-[#B85C75] py-2 cursor-pointer whitespace-nowrap ${
                currentPage === 'about' ? 'text-[#B85C75] font-bold border-b-2 border-[#B85C75]' : 'text-stone-700'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors hover:text-[#B85C75] py-2 cursor-pointer whitespace-nowrap ${
                currentPage === 'contact' ? 'text-[#B85C75] font-bold border-b-2 border-[#B85C75]' : 'text-stone-700'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Header Controls (Search and WhatsApp ordering shortcut) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Inline Search Field (Coexists cleanly, never squeezes the logo) */}
            <div className="hidden lg:flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-32 lg:w-36 xl:w-56 focus-within:w-44 lg:focus-within:w-48 xl:focus-within:w-64 text-xs bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#B85C75] focus:ring-2 focus:ring-[#B85C75]/20 rounded-full py-2 pl-8 pr-7 text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-300 min-w-0"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-200 transition-colors"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : null}
              </form>
            </div>

            {/* Mobile Search Toggle Button (Touch target >= 44x44px) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center text-stone-600 hover:text-[#B85C75] rounded-xl hover:bg-[#F8E8ED]/50 transition-colors cursor-pointer"
              aria-label={mobileSearchOpen ? 'Close search' : 'Search catalog'}
              title="Search gifts"
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Direct WhatsApp Ordering Shortcut (Always visible, compact on mobile, never clipped) */}
            <button
              type="button"
              onClick={handleWhatsAppGeneralChat}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white h-11 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0 cursor-pointer"
              title="Chat with our gift concierge on WhatsApp"
              aria-label="Order or chat on WhatsApp"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden xs:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Dropdown (Never forces horizontal scrollbar) */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3 pt-1 border-t border-stone-100 animate-in fade-in slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search gifts, teddy, jewellery..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full text-xs bg-stone-100 border border-stone-300 rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#B85C75] focus:bg-white text-stone-900"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-700 p-1 w-8 h-8 flex items-center justify-center rounded-lg"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </form>
          </div>
        )}
      </div>

      {/* 3. Mobile Navigation Drawer (Full-width, clean touch targets >= 44px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-8 space-y-1 shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Quick Search inside Mobile Menu */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-900"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </form>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center min-h-[44px]"
          >
            Home
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('shop', { search: '', category: '' });
            }}
            className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center min-h-[44px]"
          >
            Shop All Gifts
          </button>

          {/* Expandable Mobile Categories Accordion */}
          <div>
            <button
              onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
              className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center justify-between min-h-[44px]"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileCategoriesExpanded ? 'rotate-180 text-[#B85C75]' : 'text-stone-400'}`}
              />
            </button>
            {mobileCategoriesExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#B85C75]/20 ml-3 mt-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (cat.slug === 'gift-hampers') {
                        onNavigate('hampers', { search: '' });
                      } else {
                        onNavigate('shop', { category: cat.slug, search: '' });
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-600 hover:text-[#B85C75] hover:bg-[#F8E8ED]/30 transition-colors flex items-center justify-between min-h-[40px]"
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

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('shop', { sort: 'newest' });
            }}
            className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center min-h-[44px]"
          >
            New Arrivals
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('hampers', { search: '' });
            }}
            className={`w-full text-left px-3 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center min-h-[44px] ${
              currentPage === 'hampers' || currentPage === 'gift-hampers'
                ? 'bg-[#F8E8ED] text-[#B85C75]'
                : 'text-stone-800 hover:bg-[#F8E8ED]/50 hover:text-[#B85C75]'
            }`}
          >
            Gift Hampers
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('about');
            }}
            className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center min-h-[44px]"
          >
            About Us
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('contact');
            }}
            className="w-full text-left px-3 py-3 rounded-xl text-stone-800 font-semibold text-sm hover:bg-[#F8E8ED]/50 hover:text-[#B85C75] transition-colors flex items-center min-h-[44px]"
          >
            Contact
          </button>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppGeneralChat();
              }}
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
