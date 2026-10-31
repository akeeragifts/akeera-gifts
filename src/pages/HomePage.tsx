import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Gift,
  Heart,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';
import { Product, Category } from '../types/product';
import { productService } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import { defaultBusinessConfig } from '../config/businessConfig';
import { usePageMetadata } from '../utils/usePageMetadata';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenProductDetails: (product: Product) => void;
  storeName?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProductDetails,
  storeName = defaultBusinessConfig.storeName,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic Page Title & Meta
  usePageMetadata({
    page: 'home',
    title: `${storeName} | Thoughtful Gifts & WhatsApp Ordering`,
    description: 'Discover thoughtfully curated gift boxes, plush toys, and personalized keepsakes. Browse our catalog and order directly through WhatsApp.',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, feat, news] = await Promise.all([
          productService.getCategories(),
          productService.getFeaturedProducts(8),
          productService.getNewArrivals(4),
        ]);
        setCategories(cats);
        setFeaturedProducts(feat);
        setNewArrivals(news);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleWhatsAppChat = () => {
    const num = defaultBusinessConfig.whatsAppNumber;
    const msg = encodeURIComponent(`Hello ${storeName}! I am exploring your gift catalog and would like assistance selecting a gift.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSent(false), 4000);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section (Editorial Split Layout) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8E8ED]/70 via-[#FFF9F4]/40 to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#A7B7A0]/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#B85C75]/25 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#B85C75] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B85C75]" />
                <span>Curated Gifting & WhatsApp Concierge</span>
              </div>

              <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#292526] tracking-tight leading-[1.14]">
                Thoughtful Gifts. <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#B85C75]">Beautiful Moments.</span>
              </h1>

              <p className="text-sm sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover little treasures and thoughtfully curated gifts for the people who matter most. Handpicked, wrapped in satin, and ordered directly via WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto bg-[#292526] hover:bg-[#B85C75] text-white font-semibold px-7 py-3.5 min-h-[44px] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm group active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Our Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-6 py-3.5 min-h-[44px] rounded-xl shadow-xs transition-all text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Us</span>
                </button>
              </div>

              {/* Trust & Craftsmanship Highlights */}
              <div className="pt-5 sm:pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-left max-w-md mx-auto lg:mx-0 text-xs">
                <div>
                  <p className="font-bold text-[#292526] text-xs sm:text-base leading-tight">Artisanal Wrap</p>
                  <p className="text-stone-500 text-[10px] sm:text-[11px] mt-0.5">Satin & notes</p>
                </div>
                <div>
                  <p className="font-bold text-[#292526] text-xs sm:text-base leading-tight">Direct Chat</p>
                  <p className="text-stone-500 text-[10px] sm:text-[11px] mt-0.5">Concierge orders</p>
                </div>
                <div>
                  <p className="font-bold text-[#292526] text-xs sm:text-base leading-tight">Express Courier</p>
                  <p className="text-stone-500 text-[10px] sm:text-[11px] mt-0.5">Fast dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Gallery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FFF9F4]">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&auto=format&fit=crop&q=80"
                    alt="Curated gift hamper with celebratory packaging"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Gifting Note Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80 max-w-xs hidden sm:flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F8E8ED] text-[#B85C75] flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#292526]">Complimentary Handwritten Note</p>
                    <p className="text-[11px] text-stone-500">Share your message on WhatsApp and we handwrite it for you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Thoughtful Classification</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
              Category Collections
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-semibold text-[#B85C75] hover:text-[#9A465C] mt-2 sm:mt-0 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.slug === 'gift-hampers') {
                  onNavigate('hampers');
                } else {
                  onNavigate('shop', { category: cat.slug });
                }
              }}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#A7B7A0]/30 hover:border-[#B85C75]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-square w-full bg-[#FFF9F4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-serif-display font-semibold text-sm sm:text-base text-[#292526] group-hover:text-[#B85C75] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                {cat.tagline && (
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {cat.tagline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider mb-1">
              <Gift className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
              Featured Gifts
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your favorite pieces and click "Order" to start a direct WhatsApp enquiry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-semibold text-[#B85C75] hover:text-[#9A465C] mt-2 sm:mt-0 flex items-center gap-1 group"
          >
            <span>See Full Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-stone-100 rounded-2xl h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Brand Introduction & How WhatsApp Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF9F4] rounded-3xl p-8 sm:p-14 border border-[#A7B7A0]/30 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#B85C75] uppercase tracking-widest block">
                The {storeName} Philosophy
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#292526] leading-tight">
                No impersonal checkout carts. Just human conversations.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Gifting is deeply personal. Rather than forcing you through automated shopping cart flows and confusing forms, we guide each order directly through WhatsApp. 
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Tell us your occasion, customize ribbon colors, share your handwritten message, and let us coordinate prompt doorstep delivery with bespoke presentation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border border-[#A7B7A0]/20 space-y-1">
                  <span className="font-serif-display text-xl font-bold text-[#B85C75]">01</span>
                  <p className="text-xs font-bold text-[#292526]">Browse & Pick</p>
                  <p className="text-[11px] text-stone-500">Explore keepsakes, hampers, and jewellery.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#A7B7A0]/20 space-y-1">
                  <span className="font-serif-display text-xl font-bold text-[#B85C75]">02</span>
                  <p className="text-xs font-bold text-[#292526]">Click to Chat</p>
                  <p className="text-[11px] text-stone-500">Your pre-filled product inquiry opens in WhatsApp.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#A7B7A0]/20 space-y-1">
                  <span className="font-serif-display text-xl font-bold text-[#B85C75]">03</span>
                  <p className="text-xs font-bold text-[#292526]">Bespoke Wrap</p>
                  <p className="text-[11px] text-stone-500">Hand-packed with care and dispatched to recipient.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-white">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80"
                  alt="Packaging gift presentation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Studio Additions</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
              New Arrivals & Keepsakes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shop', { sort: 'newest' })}
            className="text-xs sm:text-sm font-semibold text-[#B85C75] hover:text-[#9A465C] mt-2 sm:mt-0 flex items-center gap-1 group"
          >
            <span>See Newest Gifts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      </section>

      {/* 6. "Need Help Choosing?" WhatsApp Gifting Concierge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#292526] via-[#3B3234] to-[#292526] text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-[#B85C75]/30 text-[#F8E8ED] border border-[#B85C75]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Complimentary Gift Concierge
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Need Help Choosing the Perfect Gift?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Unsure which combination matches their personality, or preparing a birthday, anniversary, or corporate bulk order? Our styling team is right on WhatsApp to help you pick.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with our Gift Concierge</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Instagram & Social Gallery Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <span className="text-xs font-bold text-[#B85C75] uppercase tracking-widest block mb-1">
            Visual Journal
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
            Follow Our Gifting Stories
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Discover real unboxings, hand-tied satin ribbons, and seasonal gift ideas on Instagram <strong className="text-stone-800">{defaultBusinessConfig.instagramHandle}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&auto=format&fit=crop&q=80', label: 'Celebration Hamper' },
            { img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=700&auto=format&fit=crop&q=80', label: 'Pocket Plush Companion' },
            { img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=700&auto=format&fit=crop&q=80', label: 'Artisan Hair Clips' },
            { img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&auto=format&fit=crop&q=80', label: 'Blush Peonies' },
          ].map((item, idx) => (
            <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-2xs">
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#292526]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-xs font-semibold">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter UI Placeholder */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="font-serif-display text-2xl font-bold text-[#292526]">
          Seasonal Gifting Journal
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Get notified when limited-edition holiday hampers and festive gift collections launch.
        </p>

        {newsletterSent ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! You will receive our seasonal gifting previews.</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto pt-1">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#B85C75] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#292526] hover:bg-[#B85C75] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
