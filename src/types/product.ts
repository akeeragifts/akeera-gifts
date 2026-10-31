export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'made_to_order' | 'out_of_stock';

export interface ProductVariantGroup {
  name: string; // e.g. "Color", "Size", "Fragrance", "Style"
  options: string[]; // e.g. ["Pastel Blush", "Ivory Cream", "Muted Sage"]
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  productCode: string; // e.g. "GFT-JWL-001"
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName?: string;
  images: string[];
  variants?: ProductVariantGroup[];
  isFeatured: boolean;
  isNew: boolean;
  availabilityStatus: AvailabilityStatus;
  packagingDetails?: string;
  features?: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
  tagline?: string;
  productCount?: number;
}
