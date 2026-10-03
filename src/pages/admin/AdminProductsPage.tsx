import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, X, ToggleLeft, ToggleRight, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { ImageWithFallback, EmptyState } from '@/components/ui/Misc';
import { formatPrice } from '@/lib/calculations';
import type { Product } from '@/types';

interface FormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  categoryId: string;
  image: string;
  available: boolean;
  popularity: string;
  hasSizes: boolean;
}

const emptyForm: FormData = {
  name: '',
  description: '',
  longDescription: '',
  price: '',
  categoryId: '',
  image: '',
  available: true,
  popularity: '50',
  hasSizes: false,
};

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } = useProducts();
  const { categories } = useCategories();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [viewTarget, setViewTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = [...products].sort((a, b) => b.popularity - a.popularity);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') result = result.filter((p) => p.categoryId === categoryFilter);
    if (availabilityFilter === 'available') result = result.filter((p) => p.available);
    if (availabilityFilter === 'unavailable') result = result.filter((p) => !p.available);
    return result;
  }, [products, search, categoryFilter, availabilityFilter]);

  const hasFilters = search.trim() || categoryFilter !== 'all' || availabilityFilter !== 'all';
  const resetFilters = () => { setSearch(''); setCategoryFilter('all'); setAvailabilityFilter('all'); };

  const openAdd = () => {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: String(product.price),
      categoryId: product.categoryId,
      image: product.image,
      available: product.available,
      popularity: String(product.popularity),
      hasSizes: product.hasSizes,
    });
    setEditingId(product.id);
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price.trim() || Number(form.price) <= 0) e.price = 'Price must be a positive number';
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (!form.image.trim()) e.image = 'Image URL is required';
    else if (!/^https?:\/\//.test(form.image.trim())) e.image = 'Please enter a valid URL';
    if (Number(form.popularity) < 0 || Number(form.popularity) > 100) e.popularity = 'Popularity must be 0–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || form.description.trim(),
      price: Number(form.price),
      categoryId: form.categoryId,
      image: form.image.trim(),
      available: form.available,
      popularity: Number(form.popularity),
      hasSizes: form.hasSizes,
    };
    if (editingId) {
      updateProduct(editingId, data);
      showToast('Product updated successfully', 'success');
    } else {
      addProduct(data);
      showToast('Product added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    showToast(`${deleteTarget.name} deleted`, 'info');
  };

  const handleToggle = (product: Product) => {
    toggleAvailability(product.id);
    showToast(`${product.name} is now ${product.available ? 'unavailable' : 'available'}`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-espresso">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="sm:w-48">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="sm:w-44">
          <Select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </Select>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm flex-shrink-0">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        {hasFilters && (
          <button onClick={resetFilters} className="text-sm text-caramel hover:underline flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            return (
              <div key={product.id} className="card overflow-hidden">
                <div className="relative aspect-square">
                  <ImageWithFallback src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  {!product.available && (
                    <div className="absolute inset-0 bg-espresso/40 flex items-center justify-center">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-espresso">Unavailable</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-espresso">
                    {category?.name ?? '—'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-espresso text-sm">{product.name}</h3>
                    <span className="font-bold text-espresso flex-shrink-0">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button onClick={() => handleToggle(product)} className="flex items-center gap-1 text-xs text-muted hover:text-espresso">
                      {product.available ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                      {product.available ? 'Available' : 'Hidden'}
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => setViewTarget(product)} className="p-1.5 rounded-lg hover:bg-cream-dark text-muted hover:text-espresso" aria-label="View product">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-cream-dark text-muted hover:text-caramel" aria-label="Edit product">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg hover:bg-cream-dark text-muted hover:text-red-600" aria-label="Delete product">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="No products found"
            message="Try adjusting your filters or add a new product."
            action={hasFilters ? <button onClick={resetFilters} className="btn-outline btn-sm">Reset filters</button> : <button onClick={openAdd} className="btn-primary btn-sm">Add Product</button>}
          />
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary btn-sm" onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Product'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
            <Input label="Price (EGP)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} required />
          </div>
          <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} error={errors.categoryId} required>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Short Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={errors.description} required />
          <Textarea label="Long Description" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={3} />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} error={errors.image} placeholder="https://..." required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Popularity (0–100)" type="number" value={form.popularity} onChange={(e) => setForm({ ...form, popularity: e.target.value })} error={errors.popularity} />
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-espresso cursor-pointer">
                <input type="checkbox" checked={form.hasSizes} onChange={(e) => setForm({ ...form, hasSizes: e.target.checked })} className="h-4 w-4 rounded accent-caramel" />
                Has Sizes
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-espresso cursor-pointer">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 rounded accent-caramel" />
                Available
              </label>
            </div>
          </div>
          {form.image && (
            <div>
              <p className="text-sm font-medium text-espresso mb-2">Image Preview</p>
              <ImageWithFallback src={form.image} alt="Preview" className="h-32 w-32 rounded-xl object-cover" />
            </div>
          )}
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Product Details" size="md">
        {viewTarget && (
          <div className="space-y-4">
            <ImageWithFallback src={viewTarget.image} alt={viewTarget.name} className="w-full aspect-video rounded-xl object-cover" />
            <div>
              <h2 className="font-serif text-xl font-bold text-espresso">{viewTarget.name}</h2>
              <p className="text-sm text-muted mt-1">{categories.find((c) => c.id === viewTarget.categoryId)?.name}</p>
            </div>
            <p className="text-sm text-muted leading-relaxed">{viewTarget.longDescription}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-cream-dark p-3">
                <p className="text-xs text-muted">Price</p>
                <p className="font-bold text-espresso">{formatPrice(viewTarget.price)}</p>
              </div>
              <div className="rounded-xl bg-cream-dark p-3">
                <p className="text-xs text-muted">Popularity</p>
                <p className="font-bold text-espresso">{viewTarget.popularity}/100</p>
              </div>
              <div className="rounded-xl bg-cream-dark p-3">
                <p className="text-xs text-muted">Status</p>
                <p className={`font-bold ${viewTarget.available ? 'text-green-600' : 'text-red-600'}`}>
                  {viewTarget.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
      />
    </div>
  );
}
