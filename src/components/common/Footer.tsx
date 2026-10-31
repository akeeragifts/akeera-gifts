import React from 'react';
import { Gift, Phone, Mail, MapPin, Instagram, MessageCircle, Heart, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import { defaultBusinessConfig } from '../../config/businessConfig';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
  storeName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  storeName = defaultBusinessConfig.storeName,
}) => {
  const config = defaultBusinessConfig;

  const handleWhatsAppChat = () => {
    const num = config.whatsAppNumber;
    const msg = encodeURIComponent(`Hello! I would like more information about the gift catalog at ${storeName}.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  return (
    <footer className="bg-[#292526] text-stone-300 border-t border-[#A7B7A0]/20">
      {/* Brand Values Banner */}
      <div className="border-b border-stone-800 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#B85C75]/20 text-[#B85C75] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs sm:text-sm">Thoughtful Presentation</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Every box arrives tied with satin bows and a complimentary handwritten note.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs sm:text-sm">Personal WhatsApp Assistance</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Direct conversation to customize variants, packaging, and delivery timing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#A7B7A0]/20 text-[#A7B7A0] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs sm:text-sm">Curated Keepsakes</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Handpicked jewellery, plush companions, fragrances, and luxury hampers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#B85C75]" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs sm:text-sm">Handcrafted with Care</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Inspected and packaged by hand to ensure genuine gifting joy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#B85C75] flex items-center justify-center text-white">
                <Gift className="w-4 h-4" />
              </div>
              <span className="font-serif-display text-2xl font-bold text-white tracking-tight">
                {storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An online gift boutique curated for life's meaningful moments. Browse our collections and connect with us directly on WhatsApp to order customized keepsakes and celebratory hampers.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Explore Catalog</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop All Gifts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { sort: 'newest' })} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hampers')} className="hover:text-white transition-colors">
                  Gift Hampers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'gifts-for-her' })} className="hover:text-white transition-colors">
                  Gifts for Her
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'jewellery-and-accessories' })} className="hover:text-white transition-colors">
                  Jewellery & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Our Boutique</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Our Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  How WhatsApp Ordering Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Bespoke Custom Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Direct Connect</h5>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp: {config.whatsAppDisplayNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B85C75] shrink-0" />
                <span>{config.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A7B7A0] shrink-0" />
                <span>{config.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#B85C75] shrink-0" />
                <span>{config.instagramHandle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved. Thoughtfully crafted.
        </p>
        
        <div className="flex items-center gap-4 sm:gap-5 text-stone-400 text-xs">
          <span>Direct WhatsApp Catalog</span>
          <span>·</span>
          <span>Bespoke Gifting Concierge</span>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="hover:text-stone-300 transition-colors text-[11px] underline opacity-50 hover:opacity-100 cursor-pointer"
            title="Open Store Administration"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
