export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/**
 * Review entity model matching future database schema:
 * id, product_id, customer_name, rating, title, review_text, status, created_at, updated_at
 */
export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number; // 1 to 5
  title?: string;
  review_text: string;
  status: ReviewStatus;
  created_at: string;
  updated_at?: string;
  is_verified?: boolean;
}

export interface ReviewInput {
  product_id: string;
  customer_name: string;
  rating: number;
  title?: string;
  review_text: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
  percentages: RatingDistribution;
}

export interface ReviewFilters {
  productId?: string;
  status?: 'all' | ReviewStatus;
  rating?: number;
  sort?: 'newest' | 'highest' | 'lowest';
}

export interface AdminReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  overallAverage: number;
}
