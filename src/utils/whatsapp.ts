import { Product } from '../types/product';
import { defaultBusinessConfig } from '../config/businessConfig';

export interface WhatsAppOrderDetails {
  product?: Product;
  productName?: string;
  productCode?: string;
  price?: number;
  quantity?: number;
  variant?: string;
  productUrl?: string;
  customMessage?: string;
}

/**
 * Clean phone number to WhatsApp international URL format
 * Strips '+', spaces, dashes, parentheses.
 */
export function sanitizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^0-9]/g, '');
}

/**
 * Builds the official WhatsApp pre-filled enquiry URL
 * Format: https://wa.me/COUNTRYCODENUMBER?text=ENCODED_MESSAGE
 */
export function buildWhatsAppOrderUrl(
  details: WhatsAppOrderDetails,
  businessNumber?: string,
  storeName?: string
): { url: string; hasValidNumber: boolean; rawMessage: string } {
  const activeNumber = sanitizeWhatsAppNumber(businessNumber || defaultBusinessConfig.whatsAppNumber);
  const activeStoreName = storeName || defaultBusinessConfig.storeName;
  const currencySymbol = defaultBusinessConfig.currencySymbol;

  // If no number configured or too short (invalid)
  const hasValidNumber = Boolean(activeNumber && activeNumber.length >= 8);

  let messageLines: string[] = [];

  if (details.customMessage) {
    messageLines.push(details.customMessage);
  } else if (details.productName || details.product) {
    const pName = details.productName || details.product?.name || '';
    const pCode = details.productCode || details.product?.productCode || '';
    const pPrice = details.price ?? details.product?.price;
    const pQty = details.quantity && details.quantity > 1 ? details.quantity : (details.quantity === 1 ? 1 : undefined);
    const pVariant = details.variant;
    const pUrl = details.productUrl || (typeof window !== 'undefined' ? window.location.href : '');

    messageLines.push(`Hello! I am interested in this product from ${activeStoreName}.`);
    messageLines.push('');
    if (pName) messageLines.push(`Product: ${pName}`);
    if (pCode) messageLines.push(`Product Code: ${pCode}`);
    if (pPrice !== undefined) messageLines.push(`Price: ${currencySymbol}${pPrice}`);
    if (pQty !== undefined) messageLines.push(`Quantity: ${pQty}`);
    if (pVariant && pVariant.trim()) messageLines.push(`Variant: ${pVariant.trim()}`);
    if (pUrl) messageLines.push(`Product Link: ${pUrl}`);
    messageLines.push('');
    messageLines.push('Please share more details. Thank you!');
  } else {
    // General store enquiry
    messageLines.push(`Hello! I am browsing the gift collection at ${activeStoreName} and would like some assistance.`);
  }

  const rawMessage = messageLines.join('\n');
  const encodedText = encodeURIComponent(rawMessage);

  const url = hasValidNumber
    ? `https://wa.me/${activeNumber}?text=${encodedText}`
    : '#';

  return { url, hasValidNumber, rawMessage };
}
