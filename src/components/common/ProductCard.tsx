import React from 'react';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types/product';
import { WhatsAppButton } from './WhatsAppButton';
import { defaultBusinessConfig } from '../../config/businessConfig';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  currencySymbol = defaultBusinessConfig.currencySymbol,
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#A7B7A0]/30 hover:border-[#B85C75]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#F8E8ED]/80 flex flex-col cursor-pointer select-none"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-4/5 w-full bg-[#FFF9F4] overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.isNew && (
            <span className="bg-[#B85C75] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              New
            </span>
          )}
          {discountPercent && (
            <span className="bg-[#292526] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Availability Badge */}
        {product.availabilityStatus === 'low_stock' && (
          <span className="absolute bottom-3 left-3 bg-amber-50/95 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
            Limited Pieces
          </span>
        )}
        {product.availabilityStatus === 'made_to_order' && (
          <span className="absolute bottom-3 left-3 bg-[#A7B7A0]/20 text-[#292526] border border-[#A7B7A0]/40 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
            Made to Order
          </span>
        )}

        {/* Quick View Hover Peek */}
        <div className="absolute inset-0 bg-[#292526]/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#292526] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata: Category & Product Code */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#575253] mb-1">
            <span className="truncate max-w-[110px] sm:max-w-[140px] font-medium text-[#B85C75]">
              {product.categoryName || 'Curated Gift'}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-stone-400 shrink-0">{product.productCode}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-display font-semibold text-stone-900 text-xs sm:text-base leading-snug group-hover:text-[#B85C75] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 mt-1 leading-relaxed hidden xs:block">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & WhatsApp CTA */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div>
            <div className="flex items-baseline flex-wrap gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-lg font-bold text-[#292526] tabular-nums">
                {currencySymbol}{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                  {currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
            <WhatsAppButton
              details={{
                product,
                productName: product.name,
                productCode: product.productCode,
                price: product.price,
                quantity: 1,
              }}
              size="sm"
              label="Order"
              className="w-full sm:w-auto min-h-[38px] text-xs font-semibold"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
