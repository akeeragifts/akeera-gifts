import { useEffect } from 'react';
import { Product } from '../types/product';
import { defaultBusinessConfig } from '../config/businessConfig';

export interface PageMetadataOptions {
  page: string;
  product?: Product | null;
  pageParams?: {
    category?: string;
    search?: string;
    [key: string]: any;
  };
  adminTab?: string;
  title?: string;
  description?: string;
  canonicalUrl?: string;
  storeName?: string;
}

function getOrCreateMeta(attrName: 'name' | 'property', attrValue: string): HTMLMetaElement {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  return element;
}

function getOrCreateLink(rel: string): HTMLLinkElement {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  return element;
}

/**
 * usePageMetadata Hook
 * Manages document.title and updates canonical and meta description tags dynamically.
 * Implemented in the main App navigation logic so that titles reflect the active view
 * (e.g., 'Product Name | Ecommerce', 'Shop | Ecommerce', 'About Us | Ecommerce').
 */
export function usePageMetadata(options: PageMetadataOptions): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const storeName = options.storeName || defaultBusinessConfig.storeName;
    const { page, product, pageParams, adminTab, title: customTitle, description: customDescription } = options;

    let computedTitle = '';
    let computedDescription = '';
    let ogImage = '';
    let noIndex = false;

    // 1. Resolve title & description based on current page context
    if (customTitle) {
      computedTitle = customTitle.includes(storeName) ? customTitle : `${customTitle} | ${storeName}`;
      computedDescription = customDescription || defaultBusinessConfig.heroSubheadline;
    } else {
      switch (page) {
        case 'product':
          if (product) {
            computedTitle = `${product.name} | ${storeName}`;
            computedDescription =
              product.shortDescription ||
              (product.description ? product.description.slice(0, 155) : '') ||
              defaultBusinessConfig.heroSubheadline;
            ogImage = product.images?.[0] || '';
          } else {
            computedTitle = `Product Details | ${storeName}`;
            computedDescription = 'Explore handcrafted celebration gifts, soft toys, and custom keepsakes.';
          }
          break;

        case 'hampers':
        case 'gift-hampers': {
          let hampersSubtitle = 'Luxury Gift Hampers';
          if (pageParams?.search && typeof pageParams.search === 'string' && pageParams.search.trim()) {
            hampersSubtitle = `Search Hampers: "${pageParams.search.trim()}"`;
          }
          computedTitle = `${hampersSubtitle} | ${storeName}`;
          computedDescription = 'Browse our exclusive collection of luxury gift hampers, celebration boxes, and curated multi-piece bundles.';
          break;
        }

        case 'shop': {
          let shopSubtitle = 'Shop All Gifts';
          if (pageParams?.search && typeof pageParams.search === 'string' && pageParams.search.trim()) {
            shopSubtitle = `Search: "${pageParams.search.trim()}"`;
          } else if (pageParams?.category && typeof pageParams.category === 'string') {
            const catName = pageParams.category
              .split('-')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            shopSubtitle = `${catName}`;
          }
          computedTitle = `${shopSubtitle} | ${storeName}`;
          computedDescription = `Browse our catalog of curated gift boxes, plush toys, and personal keepsakes.`;
          break;
        }

        case 'about':
          computedTitle = `About Us | ${storeName}`;
          computedDescription = `Learn about ${storeName}'s story, artisanal packaging, and dedicated WhatsApp gift concierge.`;
          break;

        case 'contact':
          computedTitle = `Contact & WhatsApp Inquiry | ${storeName}`;
          computedDescription = `Connect directly with our gift consultants via WhatsApp for inquiries, custom boxes, or express deliveries.`;
          break;

        case 'home':
        default:
          computedTitle = `${storeName} | Curated Gifts & WhatsApp Ordering`;
          computedDescription = defaultBusinessConfig.heroSubheadline;
          break;
      }
    }

    // 2. Update document.title
    document.title = computedTitle;

    // 3. Update meta tags for description (standard, OpenGraph, Twitter)
    getOrCreateMeta('name', 'description').content = computedDescription;
    getOrCreateMeta('property', 'og:description').content = computedDescription;
    getOrCreateMeta('name', 'twitter:description').content = computedDescription;

    // 4. Update OpenGraph & Twitter Title tags
    getOrCreateMeta('property', 'og:title').content = computedTitle;
    getOrCreateMeta('name', 'twitter:title').content = computedTitle;
    getOrCreateMeta('property', 'og:site_name').content = storeName;

    // 5. Update canonical link and OpenGraph URL
    const currentUrl = options.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (currentUrl) {
      getOrCreateLink('canonical').href = currentUrl;
      getOrCreateMeta('property', 'og:url').content = currentUrl;
    }

    // 6. Update Social Card Images
    if (ogImage) {
      getOrCreateMeta('property', 'og:image').content = ogImage;
      getOrCreateMeta('name', 'twitter:image').content = ogImage;
      getOrCreateMeta('name', 'twitter:card').content = 'summary_large_image';
    }

    // 7. Search Indexing Control
    const robotsTag = getOrCreateMeta('name', 'robots');
    robotsTag.content = noIndex ? 'noindex, nofollow' : 'index, follow';

  }, [
    options.page,
    options.product?.id,
    options.product?.name,
    options.pageParams?.category,
    options.pageParams?.search,
    options.adminTab,
    options.title,
    options.description,
    options.canonicalUrl,
    options.storeName,
  ]);
}
