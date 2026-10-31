import { Product, Category } from '../types/product';
import { mockProducts, mockCategories } from '../data/mockProducts';
import { defaultBusinessConfig, BusinessConfig } from '../config/businessConfig';

export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  isFeatured?: boolean;
  isNew?: boolean;
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Frontend-only Product & Catalog Service.
 *
 * The single source of truth is `src/data/mockProducts.ts`. Everything is held
 * in memory, so edits made in the Admin console last until the page is
 * refreshed. To change the real catalogue (names, prices, images), edit
 * `mockProducts.ts` and the dev server will hot-reload it.
 */
class ProductService {
  private products: Product[] = mockProducts.map((p) => ({ ...p, images: [...(p.images || [])] }));
  private categories: Category[] = mockCategories.map((c) => ({ ...c }));
  private config: BusinessConfig = { ...defaultBusinessConfig };

  private withCategoryName(p: Product): Product {
    const cat = this.categories.find((c) => c.id === p.categoryId);
    return { ...p, categoryName: p.categoryName || cat?.name };
  }

  async refreshCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
    return { products: this.products.map((p) => this.withCategoryName(p)), categories: await this.getCategories() };
  }

  // --- Business config ---
  async getBusinessConfig(): Promise<BusinessConfig> {
    return { ...this.config };
  }

  async updateBusinessConfig(updates: Partial<BusinessConfig>): Promise<BusinessConfig> {
    this.config = { ...this.config, ...updates };
    return { ...this.config };
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    return this.categories.map((cat) => ({
      ...cat,
      productCount: this.products.filter((p) => p.isPublished && p.categoryId === cat.id).length,
    }));
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!slug) return null;
    const found = this.categories.find((c) => c.slug === slug);
    if (!found) return null;
    return {
      ...found,
      productCount: this.products.filter((p) => p.isPublished && p.categoryId === found.id).length,
    };
  }

  async createCategory(catData: Partial<Category>): Promise<Category> {
    const created: Category = {
      id: catData.id || `cat-${Date.now()}`,
      name: catData.name || 'New Category',
      slug: catData.slug || (catData.name ? slugify(catData.name) : `cat-${Date.now()}`),
      description: catData.description || '',
      image: catData.image || '',
      featured: Boolean(catData.featured),
      tagline: catData.tagline || '',
    };
    this.categories.push(created);
    return created;
  }

  async updateCategory(slugOrId: string, updates: Partial<Category>): Promise<Category | null> {
    const idx = this.categories.findIndex((c) => c.id === slugOrId || c.slug === slugOrId);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    return this.categories[idx];
  }

  async deleteCategory(slugOrId: string): Promise<boolean> {
    const idx = this.categories.findIndex((c) => c.id === slugOrId || c.slug === slugOrId);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }

  // --- Filtering & sorting ---
  filterProducts(productList: Product[], filters?: ProductFilters): Product[] {
    if (!Array.isArray(productList)) return [];

    let result = productList.filter((p) => Boolean(p && p.isPublished));

    if (filters?.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    } else if (filters?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter((p) => p.categoryId === cat.id);
      }
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name ? p.name.toLowerCase().includes(q) : false;
        const codeMatch = p.productCode ? p.productCode.toLowerCase().includes(q) : false;
        const descMatch = p.shortDescription ? p.shortDescription.toLowerCase().includes(q) : false;
        const fullDescMatch = p.description ? p.description.toLowerCase().includes(q) : false;
        return nameMatch || codeMatch || descMatch || fullDescMatch;
      });
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => (p.price || 0) >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => (p.price || 0) <= filters.maxPrice!);
    }

    if (filters?.isFeatured !== undefined) {
      result = result.filter((p) => Boolean(p.isFeatured) === filters.isFeatured);
    }
    if (filters?.isNew !== undefined) {
      result = result.filter((p) => Boolean(p.isNew) === filters.isNew);
    }

    const sorted = [...result];
    switch (filters?.sort) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return sorted;
  }

  // --- Product queries ---
  async getPublishedProducts(filters?: ProductFilters): Promise<Product[]> {
    return this.filterProducts(this.products, filters).map((p) => this.withCategoryName(p));
  }

  async getAllPublishedProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.isPublished).map((p) => this.withCategoryName(p));
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (!slug) return null;
    const found = this.products.find((p) => p.slug === slug && p.isPublished);
    return found ? this.withCategoryName(found) : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!id) return null;
    const found = this.products.find((p) => p.id === id && p.isPublished);
    return found ? this.withCategoryName(found) : null;
  }

  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    return this.products
      .filter((p) => p.isPublished && p.isFeatured)
      .slice(0, limit)
      .map((p) => this.withCategoryName(p));
  }

  async getNewArrivals(limit = 4): Promise<Product[]> {
    return this.products
      .filter((p) => p.isPublished)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((p) => this.withCategoryName(p));
  }

  async getRelatedProducts(currentProductId: string, categoryId: string, limit = 4): Promise<Product[]> {
    const published = this.products.filter((p) => p.isPublished && p.id !== currentProductId);
    const related = published.filter((p) => p.categoryId === categoryId);
    const others = published.filter((p) => p.categoryId !== categoryId);
    return [...related, ...others].slice(0, limit).map((p) => this.withCategoryName(p));
  }

  // --- Admin catalog operations (in-memory for this session) ---
  async createProduct(newProd: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    if (!newProd.name) throw new Error('Product name is required');
    if (newProd.price == null) throw new Error('Product price is required');

    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      slug: newProd.slug || slugify(newProd.name),
      productCode: newProd.productCode || `GFT-PRD-${Math.floor(100 + Math.random() * 900)}`,
      description: newProd.description || newProd.shortDescription || newProd.name,
      shortDescription: newProd.shortDescription || '',
      images: newProd.images || [],
      isPublished: newProd.isPublished !== false,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(created);
    return this.withCategoryName(created);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    // Drop a stale cached category name if the category changed.
    const next = { ...this.products[idx], ...updates };
    if (updates.categoryId && updates.categoryName === undefined) next.categoryName = undefined;
    this.products[idx] = next;
    return this.withCategoryName(next);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Aliases for full compatibility
  async createProductPreview(newProd: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    return this.createProduct(newProd);
  }

  async updateProductPreview(id: string, updates: Partial<Product>): Promise<Product | null> {
    return this.updateProduct(id, updates);
  }

  async deleteProductPreview(id: string): Promise<boolean> {
    return this.deleteProduct(id);
  }
}

export const productService = new ProductService();
