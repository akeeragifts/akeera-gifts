import { Category, Product } from '../types/product';

export const mockCategories: Category[] = [

   // CATEGORY HER

  {
    id: 'cat-her',
    name: 'Gifts for Her',
    slug: 'gifts-for-her',
    description: 'Delicate jewellery, silk bands, gentle fragrances, and treats she will cherish.',
    image:'/products/bangles/BG-001.png',
    featured: true,
    tagline: 'Elegance for every milestone',
  },


  // CATEGORY HIM

  // {
  //   id: 'cat-him',
  //   name: 'Gifts for Him',
  //   slug: 'gifts-for-him',
  //   description: 'Refined leather accessories, warm woody fragrances, and thoughtful desk keepsakes.',
  //   // image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
  //   image:'https://drive.google.com/thumbnail?id=1okMhW3Y1tm5J0YJklcWH2-1V2iOtIv9A&sz=w1000',
  //   featured: true,
  //   tagline: 'Understated, classic treasures',
  // },



    // CATEGORY KIDS

  {
    id: 'cat-kids',
    name: "Kids' Gifts",
    slug: 'kids-gifts',
    description: 'Ultra-soft plush teddy bears, nostalgic rag dolls, and sweet keepsake charms.',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
    featured: true,
    tagline: 'Cuddles, wonder, and joy',
  },


  // CATEGORY BIRTHDAY

  {
    id: 'cat-birthday',
    name: 'Birthday Gifts',
    slug: 'birthday-gifts',
    description: 'Bespoke birthday celebration items, hand-dipped candles, and greeting cards.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=80',
    featured: true,
    tagline: 'Make their day unforgettable',
  },


  
  // CATEGORY ANNIVERSARY

  // {
  //   id: 'cat-anniversary',
  //   name: 'Anniversary Gifts',
  //   slug: 'anniversary-gifts',
  //   description: 'Everlasting silk florals, custom engraved plaques, and romantic gift pairings.',
  //   image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
  //   featured: true,
  //   tagline: 'Timeless symbols of devotion',
  // },


  // CATEGORY FESTIVAL


  {
    id: 'cat-festival',
    name: 'Festival Gifts',
    slug: 'festival-gifts',
    description: 'Gilded brass diyas, handcrafted incense, aromatic candles, and festive tokens.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
    featured: true,
    tagline: 'Warmth and holiday sparkle',
  },


  // CATEGORY GIFT HAMPERS

  {
    id: 'cat-hampers',
    name: 'Gift Hampers',
    slug: 'gift-hampers',
    description: 'Curated multi-piece luxury bundles, celebration trunks, and hand-packed keepsake boxes.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    featured: true,
    tagline: 'The ultimate gift experience',
  },
  



  // {
  //   id: 'cat-her',
  //   name: 'Accessories',
  //   slug: 'jewellery-and-accessories',
  //   description: 'Pastel resin hair grips, rose gold charms, and handcrafted freshwater pearl drops.',
  //   image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&auto=format&fit=crop&q=80',
  //   featured: true,
  //   tagline: 'Everyday sparkle and charm',
  // },
];

export const mockProducts: Product[] = [

  // GIFTS FOR HER

    // --- Bangles (cat-her) ---
  {
    id: 'prod-her-001',
    name: 'Blush Rose Antique Kundan Bangle Set',
    slug: 'blush-rose-antique-kundan-bangle-set',
    productCode: 'GFT-BNG-001',
    shortDescription: 'Soft blush-pink bangles with antique gold kundan flower borders.',
    description: 'Soft blush-rose frosted bangles accented with fine gold dots and wide antique gold borders of kundan-style flowers and rose-tinted stones. A delicate, romantic set that works for engagements, festive days and gifting.',
    price: 849,
    originalPrice: 1099,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-001.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Soft blush-pink frosted bangles with gold dot detailing',
      'Wide antique gold kundan flower borders',
      'Rose-tinted stone accents',
      'A lovely gift for her',
    ],
    isPublished: true,
    createdAt: '2026-10-31T09:00:00Z',
  },
  {
    id: 'prod-her-002',
    name: 'Peacock Teal Floral Bangle Set',
    slug: 'peacock-teal-floral-bangle-set',
    productCode: 'GFT-BNG-002',
    shortDescription: 'Deep peacock-teal bangles with antique gold floral borders.',
    description: 'Deep peacock-teal bangles with a faceted bead texture, framed by antique gold flower borders and aqua square-stone accents. A striking, modern take on traditional bangles.',
    price: 899,
    originalPrice: 1149,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-002.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Deep peacock-teal faceted bangles',
      'Antique gold-tone flower borders',
      'Aqua square-stone accents',
      'Stands out beautifully on neutral and gold outfits',
    ],
    isPublished: true,
    createdAt: '2026-10-31T10:00:00Z',
  },
  {
    id: 'prod-her-003',
    name: 'Fuchsia Crystal Beaded Kundan Bangle Set',
    slug: 'fuchsia-crystal-beaded-kundan-bangle-set',
    productCode: 'GFT-BNG-003',
    shortDescription: 'Sparkling fuchsia crystal-bead bangles with kundan flower borders.',
    description: 'Vibrant fuchsia crystal-beaded bangles that sparkle with every movement, layered with white crystal lines and kundan-style flower borders set with soft pink stones. A glamorous pick for weddings and receptions.',
    price: 1199,
    originalPrice: 1499,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-003.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Faceted fuchsia crystal-bead bangles',
      'White crystal line bands for extra sparkle',
      'Kundan-style flower borders with soft pink stones',
      'Glamorous set for weddings and receptions',
    ],
    isPublished: true,
    createdAt: '2026-10-31T11:00:00Z',
  },
  {
    id: 'prod-her-004',
    name: 'Garnet Wine Coin Centerpiece Bangle Set',
    slug: 'garnet-wine-coin-centerpiece-bangle-set',
    productCode: 'GFT-BNG-004',
    shortDescription: 'Deep wine-garnet faceted bangles with a gold coin centrepiece.',
    description: 'Deep garnet and wine faceted bangles with a row of gold temple coins as the centrepiece, bordered by gold-tone stone-studded edge bangles. A rich, dramatic set for evening and festive occasions.',
    price: 899,
    originalPrice: 1149,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-004.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Faceted garnet-wine bangles with gold bead detailing',
      'Gold temple-coin centrepiece row',
      'Stone-studded gold-tone edge bangles',
      'Deep jewel tone that stands out on any outfit',
    ],
    isPublished: true,
    createdAt: '2026-10-31T12:00:00Z',
  },
  {
    id: 'prod-her-005',
    name: 'Golden Lakshmi Coin & Pearl Bangle Set',
    slug: 'golden-lakshmi-coin-pearl-bangle-set',
    productCode: 'GFT-BNG-005',
    shortDescription: 'Champagne-gold bangles with Lakshmi coin borders and pearl-white inlays.',
    description: 'Shimmering champagne-gold bangles edged with embossed Lakshmi coin charms, pearl-white inlay bands and diamond-shaped mirror-cut accents. A graceful, auspicious set that suits everything from silk sarees to ethnic suits.',
    price: 999,
    originalPrice: 1299,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-005.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: true,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Champagne-gold bangles with fine bead detailing',
      'Embossed Lakshmi coin borders',
      'Pearl-white inlay bands and mirror-cut diamond accents',
      'Auspicious design for festivals and gifting',
    ],
    isPublished: true,
    createdAt: '2026-10-31T13:00:00Z',
  },
  {
    id: 'prod-her-006',
    name: 'Ruby Red Temple Coin & Lotus Bangle Set',
    slug: 'ruby-red-temple-coin-lotus-bangle-set',
    productCode: 'GFT-BNG-006',
    shortDescription: 'Ruby red faceted bangles with temple-style gold coins and lotus accents.',
    description: 'Rich ruby red faceted bangles paired with temple-style gold coin borders, a deity-motif centre panel and delicate pink lotus flowers. A festive heirloom-inspired set for pujas, weddings and Diwali.',
    price: 1299,
    originalPrice: 1599,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-006.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: true,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Faceted ruby red bangles',
      'Temple-style gold coin borders with deity-motif centre panel',
      'Pink and green lotus-flower detailing',
      'Perfect for pujas, weddings and festivals',
    ],
    isPublished: true,
    createdAt: '2026-10-31T14:00:00Z',
  },
  {
    id: 'prod-her-007',
    name: 'Mint Jade Kundan Blossom Bangle Set',
    slug: 'mint-jade-kundan-blossom-bangle-set',
    productCode: 'GFT-BNG-007',
    shortDescription: 'Frosted mint-green bangles with white kundan flowers and green stones.',
    description: 'Soft frosted mint-jade bangles adorned with white kundan-style flower bands and emerald-green stone accents in antique gold settings. A fresh, elegant choice for day functions, brunches and pastel festive looks.',
    price: 849,
    originalPrice: 1099,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-007.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Frosted mint-jade bangles with fine gold dotting',
      'White flower-shaped kundan-style stone bands',
      'Green stone and diamond-shape accents',
      'Light, fresh colour that suits pastel outfits',
    ],
    isPublished: true,
    createdAt: '2026-10-31T15:00:00Z',
  },
  {
    id: 'prod-her-008',
    name: 'Emerald & Maroon Kundan Edge Bangle Set',
    slug: 'emerald-maroon-kundan-edge-bangle-set',
    productCode: 'GFT-BNG-008',
    shortDescription: 'Green and maroon bangles with kundan teardrop-stone borders.',
    description: 'Classic emerald green and deep maroon bangles layered together and finished with gold-tone borders of teardrop kundan-style stones and a leaf-motif centre band. A timeless combination for traditional and festive wear.',
    price: 899,
    originalPrice: 1149,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-008.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Traditional green and maroon colour pairing',
      'Teardrop kundan-style stone borders',
      'Leaf-motif centre band in gold tone',
      'Sold as a pair of matching sets',
    ],
    isPublished: true,
    createdAt: '2026-10-31T16:00:00Z',
  },
  {
    id: 'prod-her-009',
    name: 'Royal Blue & Magenta Lotus Bangle Stack',
    slug: 'royal-blue-magenta-lotus-bangle-stack',
    productCode: 'GFT-BNG-009',
    shortDescription: 'Faceted royal blue bangles with magenta lotus-petal gold borders.',
    description: 'Deep royal blue faceted bangles dotted with fine gold beads, separated by antique gold lotus panels and magenta petal-enamel edges. A bold, jewel-toned stack made for weddings and celebrations.',
    price: 1099,
    originalPrice: 1399,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-009.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: true,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Faceted royal blue bangles with fine gold bead detailing',
      'Gold-tone lotus panels with magenta petal accents',
      'Magenta-edged border bangles frame the stack',
      'Statement set for weddings, sangeet and festive occasions',
    ],
    isPublished: true,
    createdAt: '2026-10-31T17:00:00Z',
  },
  {
    id: 'prod-her--010',
    name: 'Amber Glow Antique Gold Bangle Set',
    slug: 'amber-glow-antique-gold-bangle-set',
    productCode: 'GFT-BNG-010',
    shortDescription: 'Translucent amber-orange bangles framed with antique gold floral borders.',
    description: 'Warm, translucent amber-orange bangles stacked with antique gold-tone borders of petal-shaped pearl-white stones. A rich festive statement that glows against silk and cotton sarees alike.',
    price: 799,
    originalPrice: 999,
    categoryId: 'cat-her',
    categoryName: 'Accessories',
    images: [
      '/products/bangles/BG-010.png',
    ],
    variants: [
      {
        name: 'Size',
        options: ['2.2', '2.4', '2.6', '2.8'],
      },
    ],
    isFeatured: false,
    isNew: true,
    availabilityStatus: 'in_stock',
    packagingDetails: 'Packed in a padded gift box to keep the set safe in transit.',
    features: [
      'Translucent amber-orange bangles with fine gold dot detailing',
      'Antique gold-tone petal and pearl-stone borders',
      'Stackable set — wear together or mix and match',
      'Pairs beautifully with festive and traditional outfits',
    ],
    isPublished: true,
    createdAt: '2026-10-31T18:00:00Z',
  },
  

    



  // --- Kids' Gifts (cat-kids) ---
  
  // {
  //   id: 'prod-001',
  //   name: 'Handcrafted Honey Mini Teddy Bear',
  //   slug: 'handcrafted-honey-mini-teddy-bear',
  //   productCode: 'GFT-PLSH-001',
  //   shortDescription: 'Ultra-soft 15cm honey plush bear holding a tiny heart ribbon.',
  //   description: 'Our signature cuddly companion: a 15cm pocket-sized honey-brown plush bear crafted with hypoallergenic microfiber velvet. Hand-finished with a soft rose-gold neck ribbon and embroidered detailing. Ideal as a bedside token, sweet surprise, or delightful gift keepsake.',
  //   price: 349,
  //   originalPrice: 449,
  //   categoryId: 'cat-kids',
  //   categoryName: "Kids' Gifts",
  //   images: [
  //     '/products/bangles/test-pink.png',
  //     'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=900&auto=format&fit=crop&q=80',
  //     'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&auto=format&fit=crop&q=80',
  //   ],
  //   variants: [
  //     {
  //       name: 'Ribbon Color',
  //       options: ['Blush Pink', 'Champagne Gold', 'Sage Green'],
  //     },
  //   ],
  //   isFeatured: true,
  //   isNew: false,
  //   availabilityStatus: 'in_stock',
  //   packagingDetails: 'Arrives enclosed in an organic cotton drawstring muslin pouch stamped with the signature rose motif.',
  //   features: [
  //     '15 cm seated height — perfect keepsake size',
  //     'Hypoallergenic, ultra-soft cloud velvet fill',
  //     'Hand-tied double-face satin ribbon',
  //     'Safe for all ages 3 and above',
  //   ],
  //   isPublished: true,
  //   createdAt: '2026-09-15T10:00:00Z',
  // },
    
  ];
