import React, { useState, useEffect } from 'react';
import { imagePath } from '../utils/imagePath';
import {
  ArrowLeft,
  Gift,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  PenTool,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { defaultBusinessConfig } from '../config/businessConfig';
import { usePageMetadata } from '../utils/usePageMetadata';
import { ProductReviewsSection } from '../components/reviews/ProductReviewsSection';
import { StarRating } from '../components/reviews/StarRating';
import { reviewService } from '../services/reviewService';
import { ReviewSummary } from '../types/review';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onOpenProductDetails: (product: Product) => void;
  storeName?: string;
  currencySymbol?: string;
  whatsAppNumber?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: initialProduct,
  onBack,
  onOpenProductDetails,
  storeName = defaultBusinessConfig.storeName,
  currencySymbol = defaultBusinessConfig.currencySymbol,
  whatsAppNumber = defaultBusinessConfig.whatsAppNumber,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(initialProduct.images[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [personalizationNote, setPersonalizationNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'packaging' | 'delivery'>('details');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [pincode, setPincode] = useState<string>('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);

  // Dynamic SEO metadata
  usePageMetadata({
    page: 'product',
    product,
    storeName,
  });

  // Sync state if initialProduct prop updates or fresh database data arrives
  useEffect(() => {
    setProduct(initialProduct);
    setSelectedImage(initialProduct.images[0] || '');
    setQuantity(1);
    setPersonalizationNote('');
    setDeliveryEstimate(null);

    // Fetch latest live product details from database
    productService.getProductById(initialProduct.id).then((fresh) => {
      if (fresh) {
        setProduct(fresh);
        if (fresh.images && fresh.images.length > 0) {
          setSelectedImage(fresh.images[0]);
        }
      }
    });

    // Initialize default variants
    if (initialProduct.variants && initialProduct.variants.length > 0) {
      const defaults: Record<string, string> = {};
      initialProduct.variants.forEach((v) => {
        if (v.options && v.options.length > 0) {
          defaults[v.name] = v.options[0];
        }
      });
      setSelectedVariants(defaults);
    } else {
      setSelectedVariants({});
    }

    // Load related items and review summary directly from database
    productService.getRelatedProducts(initialProduct.id, initialProduct.categoryId, 4).then(setRelatedProducts);
    reviewService.getReviewSummary(initialProduct.id).then(setReviewSummary);
  }, [initialProduct]);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Format active variant string for the WhatsApp message
  const variantSummary = Object.entries(selectedVariants)
    .map(([key, val]) => `${key}: ${val}`)
    .concat(personalizationNote.trim() ? [`Note: "${personalizationNote.trim()}"`] : [])
    .join(' | ');

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setDeliveryEstimate('✓ Available for Express Dispatch. Standard delivery: 2-3 business days.');
    } else {
      setDeliveryEstimate('Please enter a valid 6-digit postal code.');
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="bg-[#FFF9F4]/40 min-h-screen pb-28 md:pb-24 w-full">
      {/* 1. Breadcrumb Bar (Zero horizontal overflow at any width) */}
      <div className="border-b border-stone-200/80 bg-white/80 backdrop-blur-xs w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 w-full">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 font-semibold text-stone-700 hover:text-[#B85C75] transition-colors shrink-0 py-1 cursor-pointer"
              aria-label="Return to catalog"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Catalog</span>
            </button>
            <span className="text-stone-300 select-none">/</span>
            <span className="text-stone-600 shrink-0 max-w-[120px] sm:max-w-none truncate">
              {product.categoryName || 'Gifts'}
            </span>
            <span className="text-stone-300 select-none">/</span>
            <span
              className="text-stone-900 font-semibold truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-md block"
              title={product.name}
            >
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Responsive Product Gallery */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 w-full">
            {/* Main Showcase Image (aspect-4/5, responsive, badges protected inside frame) */}
            <div className="relative aspect-4/5 w-full max-h-[480px] sm:max-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#A7B7A0]/30 shadow-xs">
             <img
  src={imagePath(selectedImage)}
  alt={product.name}
  loading="eager"
  className="w-full h-full object-cover object-center transition-all duration-300"
/>

              {/* Status Badges (Neatly anchored without obstructing subject) */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                {product.isNew && (
                  <span className="bg-[#B85C75] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg shadow-xs">
                    New Arrival
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-[#292526] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {product.availabilityStatus === 'low_stock' && (
                <div className="absolute bottom-3 left-3 bg-amber-500/95 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg shadow-xs backdrop-blur-xs z-10">
                  Limited Pieces
                </div>
              )}
            </div>

            {/* Thumbnail Strip (Touch targets >= 44x44px) */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-none touch-pan-x w-full">
                {product.images.map((img, idx) => {
                  const isCurrent = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'border-[#B85C75] ring-2 ring-[#B85C75]/30'
                          : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={imagePath(img)} alt={`${product.name} thumbnail ${idx + 1}`}
  className="w-full h-full object-cover object-center"
/>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Packaging Preview Callout */}
            <div className="p-3.5 sm:p-5 bg-white rounded-2xl border border-[#A7B7A0]/25 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F8E8ED] text-[#B85C75] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold text-stone-900">Complimentary Boutique Packaging</h4>
                <p className="text-stone-600 leading-relaxed text-[11px] sm:text-xs">
                  {product.packagingDetails || defaultBusinessConfig.packagingNote}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & WhatsApp Ordering (Logical vertical hierarchy) */}
          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#A7B7A0]/30 shadow-xs space-y-5 sm:space-y-6 w-full">
              
              {/* 1. Category Tag & SKU */}
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <span className="font-semibold text-[#B85C75] tracking-widest uppercase text-[11px] sm:text-xs">
                    {product.categoryName || 'Curated Gift'}
                  </span>
                  <span className="font-mono text-stone-400 text-[10px] sm:text-[11px]">
                    SKU: {product.productCode}
                  </span>
                </div>

                {/* 2. Product Name */}
                <h1 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#292526] leading-snug break-words">
                  {product.name}
                </h1>

                {/* Rating Preview Badge */}
                <div className="mt-2 flex items-center gap-2">
                  {reviewSummary && reviewSummary.totalReviews > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById('customer-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#B85C75] cursor-pointer group py-0.5"
                    >
                      <StarRating rating={reviewSummary.averageRating} size="sm" />
                      <span className="font-semibold text-stone-800">{reviewSummary.averageRating}</span>
                      <span className="text-stone-400 group-hover:underline">
                        ({reviewSummary.totalReviews} {reviewSummary.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById('customer-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#B85C75] cursor-pointer py-0.5"
                    >
                      <StarRating rating={0} size="sm" />
                      <span className="text-[11px] underline">Be the first to review</span>
                    </button>
                  )}
                </div>

                {/* 3. Short Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* 4. Price Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFF9F4] border border-[#A7B7A0]/20 space-y-1">
                <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#292526] tabular-nums font-serif-display">
                    {currencySymbol}{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                      {currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-bold text-[#B85C75] bg-[#F8E8ED] px-2.5 py-0.5 rounded-full">
                      Save {currencySymbol}{(product.originalPrice! - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  Inclusive of all taxes · Luxury gift wrap & greeting note included
                </p>
              </div>

              {/* 5. Variant Selectors (Touch-friendly >= 44px) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-1 border-t border-stone-100">
                  {product.variants.map((vGroup) => (
                    <div key={vGroup.name} className="space-y-2">
                      <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                        <span>Select {vGroup.name}:</span>
                        <span className="text-[#B85C75] font-semibold text-[11px]">
                          {selectedVariants[vGroup.name] || 'Please select'}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {vGroup.options.map((opt) => {
                          const isSelected = selectedVariants[vGroup.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [vGroup.name]: opt,
                                }))
                              }
                              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#B85C75] text-white shadow-xs font-semibold'
                                  : 'bg-stone-50 hover:bg-[#F8E8ED]/60 text-stone-700 border border-stone-200'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Personalization / Note Input */}
              <div className="space-y-1.5 pt-1 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[#B85C75]" />
                  <span>Personalization or Greeting Note (Optional):</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'Happy Birthday Maya!' or custom engraving"
                  value={personalizationNote}
                  onChange={(e) => setPersonalizationNote(e.target.value)}
                  maxLength={150}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 min-h-[44px] rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] bg-stone-50/50"
                />
                <p className="text-[10px] text-stone-400">
                  Included in your pre-filled WhatsApp message for our concierge team.
                </p>
              </div>

              {/* 7. Quantity Selector (Touch targets >= 44x44px) */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-800">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white p-0.5">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-100 cursor-pointer font-bold text-lg select-none"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-stone-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= 20}
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-100 cursor-pointer font-bold text-lg select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">
                    Total: <strong className="text-stone-900 font-serif-display text-sm">{currencySymbol}{totalPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* 8. Primary WhatsApp Action (Easy to find, prominent, never overflowing) */}
              <div className="pt-2 space-y-2.5">
                <WhatsAppButton
                  details={{
                    product,
                    productName: product.name,
                    productCode: product.productCode,
                    price: totalPrice,
                    quantity,
                    variant: variantSummary,
                    productUrl: typeof window !== 'undefined' ? window.location.href : '',
                  }}
                  variant="primary"
                  size="full"
                  label={`Order on WhatsApp · ${currencySymbol}${totalPrice.toLocaleString('en-IN')}`}
                  whatsAppNumber={whatsAppNumber}
                  storeName={storeName}
                  className="text-xs sm:text-sm py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] rounded-2xl shadow-sm hover:shadow-md transition-all font-semibold"
                />

                <p className="text-[11px] text-center text-stone-500 leading-snug px-1">
                  Clicking opens WhatsApp with your chosen options. We confirm packaging and greeting note directly with you.
                </p>
              </div>

              {/* 9. Trust Badges (Compact 2x2 grid) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t border-stone-100 text-stone-700 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A7B7A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-stone-900 leading-tight">Handcrafted</span>
                    <span className="text-[10px] text-stone-500">Inspected by artisans</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Gift className="w-4 h-4 text-[#B85C75] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-stone-900 leading-tight">Bespoke Wrap</span>
                    <span className="text-[10px] text-stone-500">Note & ribbon included</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-stone-900 leading-tight">Express Courier</span>
                    <span className="text-[10px] text-stone-500">Fast doorstep delivery</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] text-stone-900 leading-tight">Concierge Help</span>
                    <span className="text-[10px] text-stone-500">1-on-1 assistance</span>
                  </div>
                </div>
              </div>

              {/* 10. Delivery Pincode Checker (Touch targets >= 44px) */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#B85C75]" />
                  <span>Check Delivery Timeline:</span>
                </span>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit pin code"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 text-xs px-3 py-2.5 min-h-[44px] bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                  />
                  <button
                    type="submit"
                    className="bg-[#292526] hover:bg-stone-800 text-white text-xs px-4 min-h-[44px] rounded-xl font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Check
                  </button>
                </form>
                {deliveryEstimate && (
                  <p className="text-[11px] text-stone-700 font-medium">{deliveryEstimate}</p>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* 2. Product Description, Packaging & Shipping Tabs */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl border border-[#A7B7A0]/30 p-5 sm:p-8 lg:p-10 shadow-xs">
          {/* Tab Navigation (Responsive, horizontally scrollable on mobile) */}
          <div className="flex border-b border-stone-200 gap-4 sm:gap-8 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none touch-pan-x">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center ${
                activeTab === 'details'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Gift Details
            </button>
            <button
              onClick={() => setActiveTab('packaging')}
              className={`pb-3 whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center ${
                activeTab === 'packaging'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Packaging & Presentation
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center ${
                activeTab === 'delivery'
                  ? 'border-b-2 border-[#B85C75] text-[#B85C75]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              WhatsApp Ordering Process
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-5 sm:pt-6">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                      Key Highlights:
                    </h4>
                    <ul className="space-y-1.5 pl-4 list-disc text-stone-600">
                      {product.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'packaging' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-sm font-serif-display">
                  Every Gift is an Unboxing Experience
                </h4>
                <p>
                  At {storeName}, we believe that unboxing is half the delight. Every single order is carefully placed into our signature matte-finish box, layered with archival tissue paper, and secured with double-faced satin ribbon hand-tied by our studio team.
                </p>
                <div className="p-4 bg-[#FFF9F4] rounded-2xl border border-[#A7B7A0]/20 space-y-1 text-xs">
                  <p className="font-bold text-stone-900">Included at no extra charge:</p>
                  <p className="text-stone-600">
                    • Heavyweight luxury greeting card with your handwritten message<br />
                    • Fragranced floral sachet inside the keepsake box<br />
                    • Protective outer dispatch carton so your gift box arrives pristine
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-sm font-serif-display">
                  How WhatsApp Ordering Works
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
                  <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[#B85C75] font-serif-display font-bold text-lg block mb-1">1. Message</span>
                    <p className="text-xs text-stone-600">Click &quot;Order on WhatsApp&quot; to send your product and variant selection.</p>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[#B85C75] font-serif-display font-bold text-lg block mb-1">2. Confirm</span>
                    <p className="text-xs text-stone-600">Our concierge confirms your greeting message, delivery address, and date.</p>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[#B85C75] font-serif-display font-bold text-lg block mb-1">3. Dispatch</span>
                    <p className="text-xs text-stone-600">We hand-wrap your gift and share real-time tracking photos on WhatsApp.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Dedicated Customer Reviews & Ratings Section */}
        <div id="customer-reviews-section">
          <ProductReviewsSection
            productId={product.id}
            productName={product.name}
          />
        </div>

        {/* 4. Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C75]">
                  You May Also Adore
                </span>
                <h2 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#292526] mt-0.5">
                  Complementary Keepsakes
                </h2>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-[#B85C75] hover:text-[#9A465C] flex items-center gap-1 group self-start sm:self-auto cursor-pointer min-h-[44px]"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onOpenDetails={onOpenProductDetails}
                  currencySymbol={currencySymbol}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. Mobile Sticky Bottom WhatsApp Action Bar (< md viewports) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-3 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-[#292526] truncate block leading-tight">
            {product.name}
          </span>
          <span className="font-serif-display text-sm font-bold text-[#B85C75]">
            {currencySymbol}{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <WhatsAppButton
          details={{
            product,
            productName: product.name,
            productCode: product.productCode,
            price: totalPrice,
            quantity,
            variant: variantSummary,
            productUrl: typeof window !== 'undefined' ? window.location.href : '',
          }}
          variant="primary"
          size="sm"
          label="Order on WhatsApp"
          whatsAppNumber={whatsAppNumber}
          storeName={storeName}
          className="h-11 px-4 text-xs font-semibold rounded-xl shadow-xs shrink-0"
        />
      </div>
    </div>
  );
};
