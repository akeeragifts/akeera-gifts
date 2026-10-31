/**
 * Centralized Business & Branding Configuration
 *
 * "Ecommerce" is the temporary store name.
 * Modify this single file to update branding, logo, contact info,
 * and the WhatsApp ordering number across the entire catalog website.
 */

export interface BusinessConfig {
  storeName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementBarText: string;
  
  // WhatsApp Configuration
  // Used for https://wa.me/COUNTRYCODENUMBER
  // Format: Country code + number without '+' or spaces (e.g. 919876543210)
  whatsAppNumber: string;
  whatsAppDisplayNumber: string;
  
  // Contact & Social Placeholders (easy to update later)
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  // pinterestUrl: string;
  
  // Currency Settings
  currencyCode: string;
  currencySymbol: string;
  
  // Storefront Policies & Highlights
  packagingNote: string;
  deliveryNote: string;
  customizationNote: string;
}

export const defaultBusinessConfig: BusinessConfig = {
  storeName: 'Akeera Gifts',
  tagline: 'Thoughtful Gifts. Beautiful Moments.',
  heroHeadline: 'Thoughtful Gifts. Beautiful Moments.',
  heroSubheadline: 'Discover little treasures and thoughtfully curated gifts for the people who matter most. Handcrafted with love, wrapped in satin, and ordered directly via WhatsApp.',
  announcementBarText: 'Make every moment special with thoughtful gifts · Complimentary handwritten note with every gift',

  // Placeholder WhatsApp number (e.g. Indian mobile number with country code 91)
  whatsAppNumber: '918762857606',
  whatsAppDisplayNumber: '+91 87628 57606',

  contactEmail: 'akeeragifts@gmail.com',
  contactPhone: '+91 87628 57606',
  contactAddress: 'Chalukya Nagara, Gopala, Shivamogga 577205',
  instagramHandle: 'akeeragifts',
  instagramUrl: 'https://www.instagram.com/akeeragifts?cplk=MXVqcjRlZW50ZmJnag==',
  facebookUrl: 'https://www.facebook.com/share/18MoERXNjp/',
  // pinterestUrl: 'https://pinterest.com',

  currencyCode: 'INR',
  currencySymbol: '₹',

  packagingNote: 'Each gift arrives beautifully gift-wrapped with bespoke tissue wrap, double-face satin ribbon, and a complimentary handwritten greeting card.',
  deliveryNote: 'Orders are coordinated and dispatched directly via WhatsApp. Same-day & express courier delivery available across major pin codes.',
  customizationNote: 'Looking for a bespoke combination or bulk party favors? Simply message us on WhatsApp to tailor your order.',
};
