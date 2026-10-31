# Akeera Gifts — Frontend-only Gift Boutique

A React 19 + TypeScript + Tailwind CSS storefront with direct WhatsApp ordering.
There is **no backend or database** — all catalogue data lives in `src/data/mockProducts.ts`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
```

## Adding product images

1. Copy your image files into `public/products/` (e.g. `public/products/teddy-bear.jpg`).
2. Reference them in `src/data/mockProducts.ts` with a path starting with `/`:

```ts
images: ['/products/teddy-bear.jpg', '/products/teddy-bear-2.jpg'],
```

Notes:
- Do **not** write `public/` in the path, and don't use `./`.
- Google Drive "share" links do **not** work as image sources. Download the image and put it in `public/products/`.
- Filenames are case-sensitive once deployed (`Teddy.JPG` ≠ `teddy.jpg`).
- Category images (`image:` in `mockCategories`) work the same way.

## Admin console

Edits made in the admin console (products, categories, brand settings) are kept in memory
and reset on refresh. Reviews are stored in the browser's localStorage.
To change the permanent catalogue, edit `src/data/mockProducts.ts`.

## Structure

```
public/products/    # your product images
src/data/           # mockProducts.ts — products & categories
src/services/       # productService, reviewService, analyticsService (all local)
src/pages/          # Home, Shop, Product Detail, About, Contact
src/components/     # UI, reviews, admin console
```
