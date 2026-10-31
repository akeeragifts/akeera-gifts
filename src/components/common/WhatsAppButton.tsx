import React, { useState } from 'react';
import { MessageCircle, ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';
import { buildWhatsAppOrderUrl, WhatsAppOrderDetails } from '../../utils/whatsapp';
import { defaultBusinessConfig } from '../../config/businessConfig';

import { analyticsService } from '../../services/analyticsService';

interface WhatsAppButtonProps {
  details: WhatsAppOrderDetails;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'full';
  label?: string;
  showIcon?: boolean;
  className?: string;
  whatsAppNumber?: string;
  storeName?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  details,
  variant = 'primary',
  size = 'md',
  label = 'Order on WhatsApp',
  showIcon = true,
  className = '',
  whatsAppNumber = defaultBusinessConfig.whatsAppNumber,
  storeName = defaultBusinessConfig.storeName,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { url, hasValidNumber, rawMessage } = buildWhatsAppOrderUrl(details, whatsAppNumber, storeName);

  const handleClick = (e: React.MouseEvent) => {
    analyticsService.trackInteraction('whatsapp_click');
    if (!hasValidNumber) {
      e.preventDefault();
      setModalOpen(true);
      return;
    }
    // Opens WhatsApp in a new tab without preventing default link navigation
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Size styling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3.5 text-sm sm:text-base font-semibold',
    full: 'w-full py-3.5 px-4 text-sm font-semibold',
  }[size];

  // Variant styling (tasteful integration with luxury rose/green WhatsApp palette)
  const variantClasses = {
    primary:
      'bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs hover:shadow-md transition-all active:scale-[0.98]',
    secondary:
      'bg-[#292526] hover:bg-[#B85C75] text-white shadow-xs transition-all active:scale-[0.98]',
    outline:
      'border border-[#25D366] text-[#1EBE5D] hover:bg-[#25D366]/10 transition-colors',
    compact:
      'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-2.5 py-1.5 rounded-lg text-xs font-semibold',
  }[variant];

  return (
    <>
      <a
        href={hasValidNumber ? url : '#'}
        onClick={handleClick}
        target={hasValidNumber ? '_blank' : '_self'}
        rel="noopener noreferrer"
        aria-label={`${label} for ${details.productName || 'inquiry'}`}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium select-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      >
        {showIcon && (
          <svg
            className="w-4 h-4 shrink-0 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        <span>{label}</span>
      </a>

      {/* Helper Modal when number is unconfigured or previewed */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 z-10 space-y-4">
            <div className="flex items-center gap-3 text-stone-900 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">WhatsApp Ordering Setup</h3>
                <p className="text-xs text-stone-500">Configure business phone number</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              To connect your real WhatsApp account, update <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px] font-mono">whatsAppNumber</code> in <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px] font-mono">src/config/businessConfig.ts</code>.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono text-stone-700">
              <span className="text-[10px] uppercase font-bold text-stone-400 block font-sans">
                Pre-filled Message Preview
              </span>
              <pre className="whitespace-pre-wrap text-[11px] leading-relaxed font-sans text-stone-800 bg-white p-2.5 rounded-lg border border-stone-100">
                {rawMessage}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
