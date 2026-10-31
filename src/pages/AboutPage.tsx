import React from 'react';
import {
  Gift,
  Heart,
  Sparkles,
  MessageCircle,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  Smile,
} from 'lucide-react';
import { defaultBusinessConfig } from '../config/businessConfig';
import { usePageMetadata } from '../utils/usePageMetadata';

interface AboutPageProps {
  onNavigate: (page: string, params?: any) => void;
  storeName?: string;
  whatsAppNumber?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  storeName = defaultBusinessConfig.storeName,
  whatsAppNumber = defaultBusinessConfig.whatsAppNumber,
}) => {
  usePageMetadata({
    page: 'about',
    storeName,
  });

  const handleWhatsAppChat = () => {
    const msg = encodeURIComponent(`Hello ${storeName}! I read your story and would love to chat about choosing a thoughtful gift.`);
    window.open(`https://wa.me/${whatsAppNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-[#FFF9F4]/40 min-h-screen pb-24 space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F8E8ED]/80 via-[#FFF9F4]/40 to-transparent pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-[#A7B7A0]/20">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-[#B85C75]/25 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#B85C75] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Art of Thoughtful Giving</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#292526] leading-[1.15]">
            Crafting Moments That <br />
            <span className="italic font-normal text-[#B85C75]">Linger in Memory</span>
          </h1>

          <p className="text-stone-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            {storeName} was founded with a singular conviction: gifting should never be an afterthought. It is an intentional act of devotion, warmth, and shared happiness.
          </p>
        </div>
      </section>

      {/* The Story & Philosophy */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[#A7B7A0]/30">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80"
                alt="Artisan gift preparation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white p-5 rounded-2xl shadow-xl border border-[#A7B7A0]/20 max-w-xs">
              <p className="font-serif-display italic text-[#B85C75] text-sm leading-snug">
                &ldquo;Every box is tied by hand, tucked with a handwritten note, and sent with genuine affection.&rdquo;
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85C75]">
              Our Philosophy
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
              Why We Order Directly on WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              In a world of cold automated checkouts, gifts deserve personal connection. That is why {storeName} is intentionally designed around human conversation.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              When you click &ldquo;Order on WhatsApp&rdquo;, you speak with a real gifting concierge. We help you choose the ideal ribbon shade, pen a heartfelt greeting in elegant calligraphy, and coordinate express courier deliveries down to the exact surprise hour.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 space-y-1">
                <span className="font-serif-display font-bold text-xl text-[#B85C75]">100%</span>
                <p className="text-xs font-semibold text-stone-800">Hand-Inspected</p>
                <p className="text-[11px] text-stone-500">Every keepsake examined prior to packing</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 space-y-1">
                <span className="font-serif-display font-bold text-xl text-[#25D366]">1-on-1</span>
                <p className="text-xs font-semibold text-stone-800">WhatsApp Concierge</p>
                <p className="text-[11px] text-stone-500">Personal guidance on customization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars of {storeName} */}
      <section className="bg-white py-16 sm:py-20 border-y border-[#A7B7A0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85C75]">
              Devotion to Detail
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-[#292526]">
              The Four Pillars of Our Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FFF9F4] border border-[#A7B7A0]/25 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B85C75]/15 text-[#B85C75] flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Bespoke Packaging</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Archival tissue, custom matte-finish gift boxes, and lush double-faced satin ribbons are standard on every order.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF9F4] border border-[#A7B7A0]/25 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Real Human Service</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No chatbots or complex forms. Chat with us on WhatsApp to adjust colors, message cards, and delivery slots.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF9F4] border border-[#A7B7A0]/25 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A7B7A0]/20 text-[#3F5038] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Curated Excellence</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We handpick each plush bear, delicate piece of jewellery, and festive candle from ethical craft partners.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF9F4] border border-[#A7B7A0]/25 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Pristine Delivery</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Shipped with an outer protective dispatch box to guarantee the ribbon and corners arrive completely flawless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#292526] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#B85C75] font-bold">
              Looking for Gifting Guidance?
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight">
              Let&apos;s Design the Perfect Surprise Together
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Whether you need a last-minute birthday gift, customized anniversary keepsake, or bulk corporate celebration hampers, we are ready to assist.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with our Concierge</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-6 py-3.5 rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                Explore Gift Catalog
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
