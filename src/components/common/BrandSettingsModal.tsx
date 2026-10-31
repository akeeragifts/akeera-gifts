import React, { useState } from 'react';
import {
  X,
  Settings,
  Store,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BusinessConfig, defaultBusinessConfig } from '../../config/businessConfig';

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  onUpdateConfig: (newConfig: BusinessConfig) => void;
}

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<BusinessConfig>({ ...config });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    setFormData({ ...defaultBusinessConfig });
    onUpdateConfig({ ...defaultBusinessConfig });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B85C75]/10 text-[#B85C75] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Centralized Branding & Settings
              </h3>
              <p className="text-xs text-stone-500">
                Update store name, WhatsApp number & details globally
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <div className="p-3.5 bg-[#FFF9F4] rounded-2xl border border-[#A7B7A0]/30 text-stone-600 leading-relaxed space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Single Source of Truth</span>
            </p>
            <p>
              &quot;Ecommerce&quot; is only a temporary business name. Updating it here immediately rebrands the navbar, footer, WhatsApp messages, page titles, and catalogs site-wide without editing code files.
            </p>
          </div>

          {/* Store Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800">
              Business / Store Name:
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 font-medium text-stone-900"
            />
          </div>

          {/* Announcement Bar Text */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800">
              Announcement Bar Headline:
            </label>
            <input
              type="text"
              value={formData.announcementBarText}
              onChange={(e) =>
                setFormData({ ...formData, announcementBarText: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900"
            />
          </div>

          {/* WhatsApp Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Target Number:</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 919876543210 (Country code + number)"
                value={formData.whatsAppNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsAppNumber: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900 font-mono text-[11px]"
              />
              <span className="text-[10px] text-stone-400">
                Number without &apos;+&apos; or spaces used for wa.me links
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-stone-800">
                Currency Symbol:
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) =>
                  setFormData({ ...formData, currencySymbol: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900 font-bold"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800">Contact Email:</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800">Contact Phone:</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900"
              />
            </div>
          </div>

          {/* Physical Address */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800">Studio / Business Address:</label>
            <input
              type="text"
              value={formData.contactAddress}
              onChange={(e) =>
                setFormData({ ...formData, contactAddress: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50 text-stone-900"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleReset}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 font-semibold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#B85C75] hover:bg-[#9A465C] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                <span>{saved ? 'Saved!' : 'Apply Rebranding'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
