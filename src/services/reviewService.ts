import {
  Review,
  ReviewInput,
  ReviewSummary,
  ReviewFilters,
  AdminReviewStats,
  ReviewStatus,
} from '../types/review';

const STORAGE_KEY = 'ecommerce_customer_reviews';
const LAST_SUBMIT_KEY = 'ecommerce_last_review_timestamp';

// Seed sample reviews for fallback verification
const INITIAL_SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    product_id: 'prod-004', // Deluxe Birthday Bliss Gift Hamper
    customer_name: 'Ananya Sharma',
    rating: 5,
    title: 'Exceeded every expectation for my sister’s milestone birthday!',
    review_text:
      'The presentation was breathtaking. The double-faced blush ribbon and handwritten note felt so authentic and premium. My sister said the lavender candle filled her entire apartment with fragrance. The ordering process on WhatsApp took under three minutes!',
    status: 'approved',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true,
  },
  {
    id: 'rev-002',
    product_id: 'prod-004',
    customer_name: 'Devika Nair',
    rating: 5,
    title: 'The magnetic gift box alone is a keeper',
    review_text:
      'I was hesitant to order delicate chocolates online, but everything arrived safely in pristine condition. The box feels heavy, durable, and luxurious. 10/10 gift.',
    status: 'approved',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true,
  },
  {
    id: 'rev-003',
    product_id: 'prod-004',
    customer_name: 'Rohan Kapur',
    rating: 4,
    title: 'Thoughtful combination and fast response on WhatsApp',
    review_text:
      'The concierge confirmed my delivery instructions on WhatsApp immediately. The candle smells delightful. Would love if they offered a customized coffee option too, but this was wonderful.',
    status: 'approved',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true,
  },
  {
    id: 'rev-004',
    product_id: 'prod-001', // Honey Mini Teddy Bear
    customer_name: 'Pooja V.',
    rating: 5,
    title: 'Adorably soft little companion',
    review_text:
      'Ordered this little bear along with birthday flowers. The fur is extraordinarily silky and does not shed. Such fine quality for this price.',
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true,
  },
];

/**
 * Basic sanitize helper to avoid raw HTML / script injection
 */
function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets
    .replace(/javascript:/gi, '') // Strip javascript scheme
    .trim();
}

/**
 * Review Service
 * Frontend-only: reviews are stored in the browser's localStorage.
 */
class ReviewService {
  private reviews: Review[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    if (typeof window === 'undefined') {
      this.reviews = [...INITIAL_SEED_REVIEWS];
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.reviews = JSON.parse(stored);
      } else {
        this.reviews = [...INITIAL_SEED_REVIEWS];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reviews));
      }
    } catch {
      this.reviews = [...INITIAL_SEED_REVIEWS];
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reviews));
    } catch (e) {
      console.warn('Unable to persist reviews to localStorage:', e);
    }
  }

  /**
   * Public: Get approved reviews for a single product with optional sorting and rating filter.
   */
  async getProductReviews(
    productId: string,
    options?: {
      sort?: 'newest' | 'highest' | 'lowest';
      rating?: number;
    }
  ): Promise<Review[]> {
    if (!productId) return [];

    let list = this.reviews.filter(
      (r) => r.product_id === productId && r.status === 'approved'
    );

    if (options?.rating && options.rating >= 1 && options.rating <= 5) {
      list = list.filter((r) => r.rating === options.rating);
    }

    const sorted = [...list];
    switch (options?.sort) {
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return sorted;
  }

  /**
   * Public: Get aggregated review summary (average, count, rating distribution)
   */
  async getReviewSummary(productId: string): Promise<ReviewSummary> {
    const approved = this.reviews.filter(
      (r) => r.product_id === productId && r.status === 'approved'
    );

    const total = approved.length;
    if (total === 0) {
      return {
        productId,
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const sum = approved.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = Number((sum / total).toFixed(1));

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    approved.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
    });

    const percentages = {
      1: Math.round((distribution[1] / total) * 100),
      2: Math.round((distribution[2] / total) * 100),
      3: Math.round((distribution[3] / total) * 100),
      4: Math.round((distribution[4] / total) * 100),
      5: Math.round((distribution[5] / total) * 100),
    };

    return {
      productId,
      averageRating: avg,
      totalReviews: total,
      distribution,
      percentages,
    };
  }

  /**
   * Public: Submit a review with robust client-side validation
   */
  async submitReview(
    reviewData: ReviewInput
  ): Promise<{ success: boolean; review?: Review; error?: string }> {
    // 1. Validation checks
    const sanitizedName = sanitizeInput(reviewData.customer_name);
    const sanitizedTitle = sanitizeInput(reviewData.title || '');
    const sanitizedText = sanitizeInput(reviewData.review_text);

    if (!sanitizedName || sanitizedName.length < 2) {
      return { success: false, error: 'Please enter your name (minimum 2 characters).' };
    }
    if (sanitizedName.length > 60) {
      return { success: false, error: 'Name cannot exceed 60 characters.' };
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: 'Please select a rating between 1 and 5 stars.' };
    }

    if (sanitizedTitle.length > 100) {
      return { success: false, error: 'Review title cannot exceed 100 characters.' };
    }

    if (!sanitizedText || sanitizedText.length < 10) {
      return { success: false, error: 'Please provide at least 10 characters in your review.' };
    }
    if (sanitizedText.length > 1500) {
      return { success: false, error: 'Review text cannot exceed 1,500 characters.' };
    }

    // 2. Spam & rate-limit check (minimum 15 seconds between submissions)
    if (typeof window !== 'undefined') {
      const lastSubmitStr = localStorage.getItem(LAST_SUBMIT_KEY);
      if (lastSubmitStr) {
        const lastSubmit = parseInt(lastSubmitStr, 10);
        const elapsedSeconds = (Date.now() - lastSubmit) / 1000;
        if (elapsedSeconds < 15) {
          return {
            success: false,
            error: `Please wait ${Math.ceil(15 - elapsedSeconds)} seconds before submitting another review.`,
          };
        }
      }
    }

    // 3. Construct pending review record locally
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      product_id: reviewData.product_id,
      customer_name: sanitizedName,
      rating: Math.min(5, Math.max(1, Math.round(reviewData.rating))),
      title: sanitizedTitle || undefined,
      review_text: sanitizedText,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
    };

    this.reviews.unshift(newReview);
    this.saveToStorage();

    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
    }

    return { success: true, review: newReview };
  }

  /**
   * Admin: Retrieve reviews across all products with filtering
   */
  async getReviewsForAdmin(filters?: ReviewFilters): Promise<Review[]> {
    let list = [...this.reviews];

    if (filters?.productId) {
      list = list.filter((r) => r.product_id === filters.productId);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((r) => r.status === filters.status);
    }

    if (filters?.rating) {
      list = list.filter((r) => r.rating === filters.rating);
    }

    switch (filters?.sort) {
      case 'highest':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        list.sort((a, b) => a.rating - b.rating);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return list;
  }

  /**
   * Admin: Moderate a review status (Approve or Reject)
   */
  async moderateReview(reviewId: string, status: ReviewStatus): Promise<Review | null> {
    const idx = this.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return null;

    this.reviews[idx] = {
      ...this.reviews[idx],
      status,
      updated_at: new Date().toISOString(),
      is_verified: status === 'approved',
    };

    this.saveToStorage();
    return this.reviews[idx];
  }

  /**
   * Admin: Delete a review permanently
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    const initialLength = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
    this.saveToStorage();
    return this.reviews.length < initialLength;
  }

  /**
   * Admin: Aggregate review stats (supports both getAllReviewStats and getAdminStats aliases)
   */
  async getAllReviewStats(): Promise<AdminReviewStats> {
    const list = await this.getReviewsForAdmin({ status: 'all' });
    const pending = list.filter((r) => r.status === 'pending').length;
    const approved = list.filter((r) => r.status === 'approved').length;
    const rejected = list.filter((r) => r.status === 'rejected').length;

    const approvedList = list.filter((r) => r.status === 'approved');
    const overallAverage =
      approvedList.length > 0
        ? Number((approvedList.reduce((acc, r) => acc + r.rating, 0) / approvedList.length).toFixed(1))
        : 0;

    return {
      total: list.length,
      pending,
      approved,
      rejected,
      overallAverage,
    };
  }

  async getAdminStats(): Promise<AdminReviewStats> {
    return this.getAllReviewStats();
  }

  /**
   * Admin: Reset reviews back to the default sample seed data
   */
  async resetToSeed(): Promise<void> {
    this.reviews = [...INITIAL_SEED_REVIEWS];
    this.saveToStorage();
  }
}

export const reviewService = new ReviewService();
