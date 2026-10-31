import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Search,
  Gift,
  X,
  ExternalLink,
  Database,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Category } from '../../types/product';
import { productService } from '../../services/productService';

interface AdminProductsManagerProps {
  onOpenProductDetails?: (product: Product) => void;
  currencySymbol?: string;
}

export const AdminProductsManager: React.FC<AdminProductsManagerProps> = ({
  onOpenProductDetails,
  currencySymbol = '₹',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(499);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(699);
  const [categoryId, setCategoryId] = useState('cat-hampers');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const [notification, setNotification] = useState<string | null>(null);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAllPublishedProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setNotification(`Error loading catalog: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice(499);
    setOriginalPrice(699);
    setCategoryId(categories[0]?.id || 'cat-hampers');
    setShortDesc('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800');
    setIsFeatured(false);
    setIsNew(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setCategoryId(p.categoryId);
    setShortDesc(p.shortDescription || '');
    setDescription(p.description || '');
    setImageUrl(p.images[0] || '');
    setIsFeatured(p.isFeatured);
    setIsNew(p.isNew);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (!price || price <= 0) {
      setFormError('A valid price is required.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const chosenCat = categories.find((c) => c.id === categoryId);
    const categoryName = chosenCat ? chosenCat.name : 'Curated Gift';

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: name.trim(),
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          categoryId,
          categoryName,
          shortDescription: shortDesc.trim(),
          description: description.trim() || name.trim(),
          images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
          isFeatured,
          isNew,
        });
        setNotification(`Successfully updated "${name.trim()}" in database.`);
      } else {
        await productService.createProduct({
          name: name.trim(),
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          productCode: `GFT-PRD-${Math.floor(100 + Math.random() * 900)}`,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          categoryId,
          categoryName,
          shortDescription: shortDesc.trim() || 'Handcrafted bespoke gift item.',
          description: description.trim() || name.trim(),
          images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
          isFeatured,
          isNew,
          availabilityStatus: 'in_stock',
          isPublished: true,
        });
        setNotification(`Successfully created "${name.trim()}" in database.`);
      }

      setModalOpen(false);
      await loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setFormError(`Database error: ${err.message || 'Operation failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Permanently remove "${prodName}" from the database?`)) {
      try {
        await productService.deleteProduct(id);
        setNotification(`Permanently removed "${prodName}" from database.`);
        await loadData();
        setTimeout(() => setNotification(null), 4000);
      } catch (err: any) {
        setNotification(`Failed to delete product: ${err.message}`);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.categoryId === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider">
            <Package className="w-4 h-4 text-[#B85C75]" />
            <span>Catalog & Inventory Console</span>
          </div>
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            Product Catalog Management
          </h2>
          <p className="text-xs text-stone-500">
            Live database-connected catalog: Add, modify, and delete products with immediate persistence.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Catalogue info */}
      <div className="p-3 rounded-2xl border border-stone-200 bg-white shadow-2xs text-[11px] text-stone-500">
        Frontend-only mode: edits here last until you refresh. To change the permanent catalogue, edit{' '}
        <code className="text-stone-700 font-mono bg-stone-100 px-1 rounded">src/data/mockProducts.ts</code>.
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="p-1 text-emerald-600 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or SKU code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter products by category"
          className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#B85C75]" />
          <span>Querying database catalog...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500 space-y-2">
          <Package className="w-8 h-8 mx-auto text-stone-400" />
          <p className="font-semibold text-stone-700">No products found matching query.</p>
          <p>Click &quot;Add New Product&quot; to insert an item into the database.</p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const mainImg = p.images && p.images[0] ? p.images[0] : '';
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {mainImg ? (
                          <img
                            src={mainImg}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                            <Gift className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{p.productCode}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {p.categoryName || p.categoryId}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-stone-900">
                          {currencySymbol}
                          {p.price}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="ml-1.5 text-[10px] line-through text-stone-400">
                            {currencySymbol}
                            {p.originalPrice}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#B85C75]/10 text-[#B85C75]">
                              Featured
                            </span>
                          )}
                          {p.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              New
                            </span>
                          )}
                          {!p.isFeatured && !p.isNew && (
                            <span className="text-[10px] text-stone-400">Standard</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {onOpenProductDetails && (
                            <button
                              type="button"
                              onClick={() => onOpenProductDetails(p)}
                              title="View in Customer Storefront"
                              className="p-1.5 text-stone-500 hover:text-[#B85C75] hover:bg-stone-100 rounded-lg cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-display font-bold text-lg text-stone-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Database'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lavender & Rose Silk Hamper"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Original Price ({currencySymbol})</label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional for strikethrough"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief summary for catalog card..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed gifting story and highlights..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#B85C75]"
                  />
                  <span>Featured Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-[#B85C75]"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#B85C75] text-white rounded-xl hover:bg-[#9A465C] font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
