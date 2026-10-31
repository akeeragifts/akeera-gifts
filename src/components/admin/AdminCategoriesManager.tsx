import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { Category } from '../../types/product';
import { productService } from '../../services/productService';

export const AdminCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [tagline, setTagline] = useState('');
  const [featured, setFeatured] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const cats = await productService.getCategories();
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800');
    setTagline('');
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setTagline(cat.tagline || '');
    setFeatured(Boolean(cat.featured));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      await productService.updateCategory(editingCategory.id, {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        image: image.trim(),
        tagline: tagline.trim(),
        featured,
      });
      setNotification(`Category "${name.trim()}" updated in database.`);
    } else {
      await productService.createCategory({
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
        tagline: tagline.trim(),
        featured,
      });
      setNotification(`Category "${name.trim()}" created in database.`);
    }

    setModalOpen(false);
    await loadCategories();
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = async (cat: Category) => {
    if (window.confirm(`Delete category "${cat.name}" from database? Products in this category will remain.`)) {
      await productService.deleteCategory(cat.id);
      setNotification(`Category "${cat.name}" deleted from database.`);
      await loadCategories();
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filtered = categories.filter((c) =>
    !searchQuery.trim() ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85C75] uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-[#B85C75]" />
            <span>Category Taxonomy</span>
          </div>
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
            Category Management
          </h2>
          <p className="text-xs text-stone-500">
            Manage your boutique gift collections and navigation taxonomies.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#B85C75] hover:bg-[#9A465C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
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

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-400">Loading categories from database...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Slug</th>
                  <th className="py-3 px-3">Products</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 block truncate">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate max-w-xs">
                            {cat.tagline || cat.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {cat.slug}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-full font-semibold">
                        {cat.productCount ?? 0} items
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {cat.featured ? (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="text-stone-500 hover:text-[#B85C75] p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone-400">No categories found in database.</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-display font-bold text-lg text-stone-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding Keepsakes"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. wedding-keepsakes (auto-generated if empty)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Short marketing hook..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe items in this category..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B85C75]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#B85C75]"
                  />
                  <span>Feature on homepage banner</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B85C75] text-white rounded-xl hover:bg-[#9A465C] font-semibold"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
