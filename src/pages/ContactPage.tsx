import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Send,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { defaultBusinessConfig } from '../config/businessConfig';
import { usePageMetadata } from '../utils/usePageMetadata';

interface ContactPageProps {
  onNavigate: (page: string, params?: any) => void;
  storeName?: string;
  whatsAppNumber?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  storeName = defaultBusinessConfig.storeName,
  whatsAppNumber = defaultBusinessConfig.whatsAppNumber,
  contactEmail = defaultBusinessConfig.contactEmail,
  contactPhone = defaultBusinessConfig.contactPhone,
  contactAddress = defaultBusinessConfig.contactAddress,
}) => {
  const [topic, setTopic] = useState('Product Question');
  const [customerName, setCustomerName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  usePageMetadata({
    page: 'contact',
    storeName,
  });

  const handleSendWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `Hello ${storeName}!`,
      `Inquiry Topic: ${topic}`,
    ];
    if (customerName.trim()) {
      lines.push(`My Name: ${customerName.trim()}`);
    }
    if (customMessage.trim()) {
      lines.push(`Message: ${customMessage.trim()}`);
    } else {
      lines.push('I would like to speak with a gift concierge regarding an order.');
    }

    const raw = lines.join('\n');
    const encoded = encodeURIComponent(raw);
    window.open(`https://wa.me/${whatsAppNumber}?text=${encoded}`, '_blank');
  };

  const faqs = [
    {
      q: 'How does WhatsApp-based ordering work?',
      a: `Browse our website catalog, pick your desired gifts and variants, and click "Order on WhatsApp". A pre-filled message will open directly in WhatsApp with all product details, where our gift concierge confirms customization, greeting card wording, delivery slot, and payment details with you.`,
    },
    {
      q: 'Can I customize the greeting card or ribbon color?',
      a: `Absolutely! Every gift includes a complimentary handwritten greeting card and our signature double-faced satin ribbon. Simply tell us your desired message and ribbon color preference in the WhatsApp chat.`,
    },
    {
      q: 'How are payments completed?',
      a: `During the WhatsApp ordering conversation, our team coordinates payment seamlessly via secure UPI, QR code, bank transfer, or instant payment link before wrapping and dispatching your parcel.`,
    },
    {
      q: 'What are the delivery timelines?',
      a: `We provide standard pan-India delivery within 2 to 4 business days. Same-day delivery or express overnight courier is also available across major metro locations upon request via WhatsApp.`,
    },
    {
      q: 'Do you offer bulk corporate or wedding favors?',
      a: `Yes! We curate bespoke celebration boxes for weddings, corporate milestones, baby showers, and festive occasions. Contact us on WhatsApp for bulk catalogs and custom brand engraving.`,
    },
  ];

  return (
    <div className="bg-[#FFF9F4]/40 min-h-screen pb-24 space-y-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F8E8ED]/80 via-[#FFF9F4]/40 to-transparent pt-12 sm:pt-14 pb-14 sm:pb-16 border-b border-[#A7B7A0]/20">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B85C75]">
            We Love Connecting
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292526]">
            Get in Touch with our Studio
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Need styling advice, custom gift curation, or urgent dispatch assistance? Our concierge is always just a message away.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left: Contact Info & WhatsApp Shortcut */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#A7B7A0]/30 shadow-xs space-y-5 sm:space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B85C75]">
                  Direct WhatsApp Channel
                </span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-1">
                  Fastest Response via WhatsApp
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Our gift curators typically respond within 5–15 minutes during studio hours.
                </p>
              </div>

              {/* Direct WhatsApp Callout */}
              <a
                href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(`Hello ${storeName}! I have a general gift inquiry.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs py-3.5 px-4 min-h-[44px] rounded-2xl flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Message Concierge on WhatsApp</span>
              </a>

              <div className="pt-4 border-t border-stone-100 space-y-4 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold block text-stone-900">Phone Support</span>
                    <span className="text-stone-500">{contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold block text-stone-900">Email Studio</span>
                    <span className="text-stone-500">{contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold block text-stone-900">Design Studio & Workshop</span>
                    <span className="text-stone-500 leading-relaxed">{contactAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold block text-stone-900">Concierge Operating Hours</span>
                    <span className="text-stone-500">Monday – Sunday: 9:30 AM – 9:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick WhatsApp Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#A7B7A0]/30 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B85C75]">
                  Start a Conversation
                </span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-1">
                  Send a Structured WhatsApp Inquiry
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Fill out this quick form and click &ldquo;Send via WhatsApp&rdquo; to launch a tailored chat with our concierge team.
                </p>
              </div>

              <form onSubmit={handleSendWhatsAppInquiry} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Inquiry Topic:
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-800 cursor-pointer"
                  >
                    <option value="Product Question">Question about a specific gift</option>
                    <option value="Custom Gift Box">Bespoke hamper customization</option>
                    <option value="Corporate / Bulk Order">Corporate milestone / Wedding bulk order</option>
                    <option value="Express Delivery Inquiry">Urgent / same-day delivery request</option>
                    <option value="General Inquiry">General boutique question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Your Name (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B85C75]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Message or Details:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you're looking for, recipient preferences, delivery location, or date..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#B85C75]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85C75]">
              Common Inquiries
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#292526]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#A7B7A0]/30 overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#B85C75] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#B85C75]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FFF9F4]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
