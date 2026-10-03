import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { useCategories } from '@/context/CategoryContext';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Misc';

interface FormData {
  name: string;
  description: string;
}

export function AdminCategoriesPage() {
  const { categories, addCategory, renameCategory, deleteCategory } = useCategories();
  const { products } = useProducts();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const openAdd = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (id: string, name: string, description: string) => {
    setForm({ name, description });
    setEditingId(id);
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editingId) {
      renameCategory(editingId, form.name, form.description);
      showToast('Category updated successfully', 'success');
    } else {
      addCategory(form.name, form.description);
      showToast('Category added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const result = deleteCategory(deleteTarget.id);
    if (result.success) {
      showToast('Category deleted', 'info');
    } else {
      showToast(result.error ?? 'Failed to delete category', 'error');
    }
  };

  const getProductCount = (categoryId: string) => products.filter((p) => p.categoryId === categoryId).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = getProductCount(cat.id);
            return (
              <div key={cat.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-caramel/10 text-caramel flex-shrink-0">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-espresso">{cat.name}</h3>
                      <p className="text-xs text-muted mt-0.5 line-clamp-2">{cat.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs font-medium ${count > 0 ? 'text-caramel' : 'text-muted'}`}>
                    {count} product{count !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat.id, cat.name, cat.description)} className="p-1.5 rounded-lg hover:bg-cream-dark text-muted hover:text-caramel" aria-label="Edit category">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })} className="p-1.5 rounded-lg hover:bg-cream-dark text-muted hover:text-red-600" aria-label="Delete category">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={<Tag className="h-7 w-7" />}
            title="No categories yet"
            message="Add your first category to organize your products."
            action={<button onClick={openAdd} className="btn-primary btn-sm">Add Category</button>}
          />
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Add New Category'}
        size="md"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary btn-sm" onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Category'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Categories with products cannot be deleted — reassign products first.`}
        confirmLabel="Delete Category"
      />
    </div>
  );
}
