/**
 * Dynamic SEO and Metadata Utility Service
 * Conforms to AI Studio applet-seo guidelines, OpenGraph protocol, Twitter Cards, and Schema.org JSON-LD.
 */

export interface SEOMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product';
  ogImage?: string;
  schema?: Record<string, any>;
  keywords?: string[];
  noIndex?: boolean;
}

function getOrCreateMetaTag(attributeName: 'name' | 'property', attributeValue: string): HTMLMetaElement {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  return element;
}

function getOrCreateLinkTag(rel: string): HTMLLinkElement {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  return element;
}

function updateSchemaJsonLd(schemaData?: Record<string, any>) {
  const SCRIPT_ID = 'seo-structured-data-ldjson';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!schemaData) {
    if (script) {
      script.remove();
    }
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schemaData, null, 2);
}

/**
 * Updates document title, meta tags (name and property), canonical link, and JSON-LD structured data.
 */
export function updateSEOMetadata(metadata: SEOMetadata): void {
  if (typeof document === 'undefined') return;

  const {
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage,
    schema,
    keywords,
    noIndex,
  } = metadata;

  // 1. Title
  if (title) {
    document.title = title;
    getOrCreateMetaTag('property', 'og:title').content = title;
    getOrCreateMetaTag('name', 'twitter:title').content = title;
  }

  // 2. Description
  if (description) {
    getOrCreateMetaTag('name', 'description').content = description;
    getOrCreateMetaTag('property', 'og:description').content = description;
    getOrCreateMetaTag('name', 'twitter:description').content = description;
  }

  // 3. Robots
  const robotsMeta = getOrCreateMetaTag('name', 'robots');
  robotsMeta.content = noIndex ? 'noindex, nofollow' : 'index, follow';

  // 4. OpenGraph Type & Site Name
  getOrCreateMetaTag('property', 'og:type').content = ogType;

  // 5. Canonical & OpenGraph URL
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  if (currentUrl) {
    getOrCreateLinkTag('canonical').href = currentUrl;
    getOrCreateMetaTag('property', 'og:url').content = currentUrl;
  }

  // 6. Image (Social Cards)
  if (ogImage) {
    getOrCreateMetaTag('property', 'og:image').content = ogImage;
    getOrCreateMetaTag('name', 'twitter:image').content = ogImage;
    getOrCreateMetaTag('name', 'twitter:card').content = 'summary_large_image';
  }

  // 7. Keywords
  if (keywords && keywords.length > 0) {
    getOrCreateMetaTag('name', 'keywords').content = keywords.join(', ');
  }

  // 8. Schema.org JSON-LD
  updateSchemaJsonLd(schema);
}
