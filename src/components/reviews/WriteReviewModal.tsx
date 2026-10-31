import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { StarRating } from './StarRating';
import { reviewService } from '../../services/reviewService';
import { Review } from '../../types/review';

interface WriteReviewModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (review: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  productId,
  productName,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your name.';
    } else if (customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters.';
    } else if (customerName.length > 60) {
      newErrors.customerName = 'Name cannot exceed 60 characters.';
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please tap a star to give a rating (1 to 5).';
    }

    if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please share your thoughts about this gift.';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long.';
    } else if (reviewText.length > 1500) {
      newErrors.reviewText = 'Review cannot exceed 1,500 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (isSubmitting) return; // Prevent double-clicks
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate real network flight latency for responsive UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      const res = await reviewService.submitReview({
        product_id: productId,
        customer_name: customerName,
        rating,
        title: title.trim() || undefined,
        review_text: reviewText,
      });

      if (res.success && res.review) {
        setSubmitSuccess(true);
        onReviewSubmitted(res.review);
      } else {
        setGeneralError(res.error || 'Unable to submit review. Please try again.');
      }
    } catch {
      setGeneralError('An unexpected error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCustomerName('');
    setRating(0);
    setTitle('');
    setReviewText('');
    setErrors({});
    setGeneralError(null);
    setSubmitSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 bg-[#FFF9F4]/50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Review</span>
            </div>
            <h3 id="write-review-title" className="font-serif-display text-lg sm:text-xl font-bold text-stone-900 leading-tight">
              Share Your Gifting Experience
            </h3>
            <p className="text-[11px] text-stone-500 truncate max-w-xs sm:max-w-sm">
              Reviewing: <span className="text-stone-800 font-medium">{productName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#F8E8ED] text-[#B85C75] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-serif-display font-bold text-xl text-stone-900">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Thank you for sharing your feedback! Your review has been submitted and may appear after moderation.
                </p>
              </div>

              <div className="p-3.5 bg-[#FFF9F4] rounded-2xl border border-[#A7B7A0]/30 text-[11px] text-stone-600 flex items-center gap-2 max-w-sm mx-auto text-left">
                <ShieldCheck className="w-4 h-4 text-[#A7B7A0] shrink-0" />
                <span>
                  Our team reviews submissions to maintain authenticity and ensure friendly, safe community guidelines.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="bg-[#292526] hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
              {generalError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Notice that no account is required */}
              <div className="p-3 bg-[#F8E8ED]/60 border border-[#B85C75]/20 rounded-2xl text-[11px] text-[#B85C75] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>No login or registration required</span>
                </div>
                <p className="text-stone-600 text-[10px] leading-relaxed">
                  Submissions are saved directly to our review database and verified by our boutique concierge.
                </p>
              </div>

              {/* 1. Rating Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onChange={(r) => {
                      setRating(r);
                      if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                    }}
                    showLabel
                  />
                  <span className="text-[11px] text-stone-400 font-medium">
                    {rating > 0 ? `${rating} of 5 stars` : 'Tap to rate'}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.rating}</p>
                )}
              </div>

              {/* 2. Customer Name */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="review-name" className="font-bold text-stone-800">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {customerName.length}/60
                  </span>
                </div>
                <input
                  id="review-name"
                  type="text"
                  maxLength={60}
                  placeholder="e.g. Radhika V."
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  className={`w-full text-xs px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border ${
                    errors.customerName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-stone-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-900 transition-all`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.customerName}</p>
                )}
              </div>

              {/* 3. Review Title (Optional) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="review-title" className="font-bold text-stone-800">
                    Review Headline <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">{title.length}/100</span>
                </div>
                <input
                  id="review-title"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Beautiful presentation, arrived in perfect condition!"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className="w-full text-xs px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-900 transition-all"
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.title}</p>
                )}
              </div>

              {/* 4. Review Text */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="review-body" className="font-bold text-stone-800">
                    Your Review <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {reviewText.length}/1500
                  </span>
                </div>
                <textarea
                  id="review-body"
                  rows={4}
                  maxLength={1500}
                  placeholder="Describe the packaging, fragrance, recipient's reaction, or WhatsApp ordering experience..."
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (errors.reviewText) setErrors((prev) => ({ ...prev, reviewText: '' }));
                  }}
                  className={`w-full text-xs p-3.5 rounded-xl bg-white border ${
                    errors.reviewText ? 'border-rose-400 ring-1 ring-rose-300' : 'border-stone-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-900 leading-relaxed transition-all`}
                />
                {errors.reviewText && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.reviewText}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B85C75] hover:bg-[#9A465C] disabled:bg-[#B85C75]/60 text-white px-6 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
