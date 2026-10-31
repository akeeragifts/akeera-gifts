import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Star,
  RefreshCw,
  Search,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { Review, ReviewStatus, AdminReviewStats } from '../../types/review';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { StarRating } from '../reviews/StarRating';

export const AdminReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    overallAverage: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [productFilter, setProductFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [revs, st, prods] = await Promise.all([
        reviewService.getReviewsForAdmin({
          status: statusFilter,
          productId: productFilter || undefined,
          rating: ratingFilter,
        }),
        reviewService.getAllReviewStats(),
        productService.getAllPublishedProducts(),
      ]);
      setReviews(revs);
      setStats(st);
      setProducts(prods);
    } catch (e) {
      console.error('Failed to load admin reviews:', e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, productFilter, ratingFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleModerate = async (reviewId: string, newStatus: ReviewStatus) => {
    setActionLoadingId(reviewId);
    try {
      await reviewService.moderateReview(reviewId, newStatus);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to permanently remove this review?')) {
      setActionLoadingId(reviewId);
      try {
        await reviewService.deleteReview(reviewId);
        await loadData();
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleResetSeed = async () => {
    if (window.confirm('Reset reviews to default initial sample seed?')) {
      await reviewService.resetToSeed();
      await loadData();
    }
  };

  const getProductName = (productId: string) => {
    const p = products.find((item) => item.id === productId);
    return p ? p.name : productId;
  };

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.customer_name.toLowerCase().includes(q) ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      r.review_text.toLowerCase().includes(q) ||
      getProductName(r.product_id).toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#B85C75]" />
            <span>Moderation Center</span>
          </div>
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            Customer Reviews & Ratings Management
          </h2>
          <p className="text-xs text-stone-500">
            Moderate anonymous submissions, protect community standards, and approve customer reviews for public display.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:bg-stone-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          title="Refresh review records from database"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Reviews</span>
        </button>
      </div>

      {/* 2. Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Reviews */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Reviews
          </span>
          <span className="text-2xl font-serif-display font-bold text-stone-900 mt-1 block">
            {stats.total}
          </span>
        </div>

        {/* Pending Moderation (Highlighted) */}
        <div
          className={`p-4 rounded-2xl border ${
            stats.pending > 0
              ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-200'
              : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Pending Approval
            </span>
            {stats.pending > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <span className="text-2xl font-serif-display font-bold text-amber-900 mt-1 block">
            {stats.pending}
          </span>
        </div>

        {/* Approved */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Approved (Live)
          </span>
          <span className="text-2xl font-serif-display font-bold text-emerald-900 mt-1 block">
            {stats.approved}
          </span>
        </div>

        {/* Rejected */}
        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
          <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">
            Rejected
          </span>
          <span className="text-2xl font-serif-display font-bold text-rose-900 mt-1 block">
            {stats.rejected}
          </span>
        </div>

        {/* Average Rating */}
        <div className="bg-[#FFF9F4] p-4 rounded-2xl border border-[#A7B7A0]/30 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
            Live Average
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-serif-display font-bold text-[#B85C75]">
              {stats.overallAverage}
            </span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      {/* 3. Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#B85C75]" />
            <span>Status:</span>
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#292526] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Reviews ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span>Pending</span>
            {stats.pending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-amber-900 font-bold">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            Approved ({stats.approved})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Dropdowns & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search by text or reviewer */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reviewer or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
            />
          </div>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75] text-stone-800"
          >
            <option value="">All Catalog Products ({products.length})</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter || ''}
            onChange={(e) =>
              setRatingFilter(e.target.value ? Number(e.target.value) : undefined)
            }
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75] text-stone-800"
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* 4. Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-400">Loading reviews...</div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const prodName = getProductName(rev.product_id);
            const isActing = actionLoadingId === rev.id;

            return (
              <div
                key={rev.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  rev.status === 'pending'
                    ? 'border-amber-300 shadow-sm ring-1 ring-amber-100'
                    : 'border-stone-200'
                } space-y-3.5`}
              >
                {/* Header row: Product, Status, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-stone-900">
                        {rev.customer_name}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-[#B85C75] font-medium truncate max-w-xs">
                        {prodName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} size="sm" />
                      <span className="text-[11px] text-stone-400">
                        ({rev.rating} of 5 stars)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Status Badge */}
                    {rev.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {rev.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>Approved & Public</span>
                      </span>
                    )}
                    {rev.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-700" />
                        <span>Rejected</span>
                      </span>
                    )}

                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100 whitespace-pre-line">
                    {rev.review_text}
                  </p>
                </div>

                {/* Moderation Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-50">
                  <div className="text-[10px] text-stone-400 font-mono">
                    ID: {rev.id}
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleModerate(rev.id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Review</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleModerate(rev.id, 'rejected')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleDelete(rev.id)}
                      className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                      title="Permanently delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-2">
            <p className="text-sm font-semibold text-stone-800">No reviews found</p>
            <p className="text-xs text-stone-500">
              There are no reviews matching the current status, product, or rating filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
