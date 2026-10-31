import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MessageSquarePlus,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { WriteReviewModal } from './WriteReviewModal';
import { reviewService } from '../../services/reviewService';
import { Review, ReviewSummary } from '../../types/review';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    productId,
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Write Review Modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [recentSubmissionNotice, setRecentSubmissionNotice] = useState<string | null>(null);

  const loadReviewsData = useCallback(async () => {
    try {
      setLoading(true);
      const [revs, summ] = await Promise.all([
        reviewService.getProductReviews(productId, {
          sort: sortOption,
          rating: selectedRatingFilter || undefined,
        }),
        reviewService.getReviewSummary(productId),
      ]);
      setReviews(revs);
      setSummary(summ);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  }, [productId, sortOption, selectedRatingFilter]);

  useEffect(() => {
    loadReviewsData();
  }, [loadReviewsData]);

  const handleReviewSubmitted = () => {
    setRecentSubmissionNotice(
      'Thank you for your feedback! Your review has been submitted and may appear after moderation.'
    );
    // Reload data in case it was auto-approved or to update summary
    loadReviewsData();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="mt-14 sm:mt-20 border-t border-[#A7B7A0]/25 pt-12 sm:pt-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B85C75]" />
            <span>Community Feedback</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#292526]">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Real experiences from gifting moments, celebration boxes, and WhatsApp deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 min-h-[44px] rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {recentSubmissionNotice && (
        <div className="mb-6 p-4 bg-[#F8E8ED]/70 border border-[#B85C75]/25 rounded-2xl text-xs text-[#B85C75] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span>{recentSubmissionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentSubmissionNotice(null)}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Review Scorecard & Breakdown (When reviews exist) */}
      {summary.totalReviews > 0 ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/80 shadow-xs mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Overall Scorecard */}
            <div className="lg:col-span-4 text-center lg:text-left space-y-2 lg:border-r lg:border-stone-100 lg:pr-8">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Overall Rating
              </span>
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="font-serif-display text-4xl sm:text-5xl font-bold text-[#292526]">
                  {summary.averageRating}
                </span>
                <span className="text-stone-400 font-medium text-lg">/ 5.0</span>
              </div>
              <div className="flex justify-center lg:justify-start">
                <StarRating rating={summary.averageRating} size="md" />
              </div>
              <p className="text-xs text-stone-500">
                Based on <strong className="text-stone-800">{summary.totalReviews}</strong> verified customer reviews
              </p>
            </div>

            {/* Rating Distribution Bars */}
            <div className="lg:col-span-8 space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = summary.percentages[star as 1 | 2 | 3 | 4 | 5] || 0;
                const isSelected = selectedRatingFilter === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setSelectedRatingFilter(isSelected ? null : star)
                    }
                    className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-xl transition-colors ${
                      isSelected ? 'bg-[#F8E8ED]/60 font-semibold' : 'hover:bg-stone-50'
                    }`}
                    title={`Filter by ${star} star reviews`}
                  >
                    <span className="w-14 text-stone-700 text-left font-medium flex items-center gap-1 shrink-0">
                      <span>{star} stars</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>

                    {/* Progress Bar */}
                    <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[#B85C75] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-12 text-stone-500 text-right font-mono text-[11px] shrink-0">
                      {count} ({percentage}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Filter and Sort Toolbar */}
      {summary.totalReviews > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6 border-b border-stone-200">
          {/* Active Star Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs text-stone-500 font-medium shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B85C75]" />
              <span>Filter:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] flex items-center ${
                selectedRatingFilter === null
                  ? 'bg-[#292526] text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'
              }`}
            >
              All ({summary.totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setSelectedRatingFilter(selectedRatingFilter === star ? null : star)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] flex items-center gap-1 ${
                  selectedRatingFilter === star
                    ? 'bg-[#B85C75] text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{star}</span>
                <Star className={`w-3 h-3 ${selectedRatingFilter === star ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                <span className="font-mono text-[10px] opacity-75">
                  ({summary.distribution[star as 1 | 2 | 3 | 4 | 5] || 0})
                </span>
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="appearance-none bg-white border border-stone-300 text-xs font-medium rounded-xl py-2 pl-3 pr-8 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[#B85C75] text-stone-800 shadow-2xs cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Reviews List or Empty State */}
      <div className="pt-6 sm:pt-8 space-y-4">
        {loading ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-36 border border-stone-200 animate-pulse p-6"
              />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs hover:border-[#B85C75]/30 transition-colors space-y-3"
              >
                {/* Review Header: Name, Stars, Verified Badge, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-stone-900 text-sm">
                      {rev.customer_name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Approved Review</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <StarRating rating={rev.rating} size="sm" />
                    <span className="text-stone-300 select-none">•</span>
                    <time dateTime={rev.created_at} className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{formatDate(rev.created_at)}</span>
                    </time>
                  </div>
                </div>

                {/* Review Title if present */}
                {rev.title && (
                  <h4 className="font-serif-display font-bold text-stone-900 text-sm sm:text-base leading-snug">
                    {rev.title}
                  </h4>
                )}

                {/* Review Content */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal whitespace-pre-line">
                  {rev.review_text}
                </p>
              </article>
            ))}
          </div>
        ) : summary.totalReviews > 0 && selectedRatingFilter !== null ? (
          /* Filtered empty state */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 space-y-3 max-w-md mx-auto my-6 shadow-xs">
            <p className="text-sm font-semibold text-stone-800">
              No {selectedRatingFilter}-star reviews found.
            </p>
            <p className="text-xs text-stone-500">
              Try selecting another star rating or reset the filter to view all customer reviews.
            </p>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter(null)}
              className="text-xs text-[#B85C75] hover:underline font-semibold cursor-pointer"
            >
              Show all reviews
            </button>
          </div>
        ) : (
          /* Global Friendly Empty State (As explicitly requested by user) */
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-stone-200/80 space-y-4 max-w-lg mx-auto my-6 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#F8E8ED] text-[#B85C75] flex items-center justify-center mx-auto shadow-xs">
              <Star className="w-7 h-7 fill-[#B85C75] text-[#B85C75]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif-display font-bold text-stone-900 text-lg sm:text-xl">
                No reviews yet. Be the first to share your experience!
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                Have you gifted or received this keepsake? Tell others about the packaging, quality, or recipient&apos;s reaction. No account or login required!
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs font-semibold px-6 py-3 min-h-[44px] rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write the First Review</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        productId={productId}
        productName={productName}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </section>
  );
};
