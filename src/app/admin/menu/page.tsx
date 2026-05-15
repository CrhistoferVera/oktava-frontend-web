'use client';

import { useEffect, useMemo, useState } from 'react';
import { MenuCategoryTabs } from '@/components/admin/menu/category-tabs';
import { CreateProductModal } from '@/components/admin/menu/create-product-modal';
import { ManageCategoriesModal } from '@/components/admin/menu/manage-categories-modal';
import { MenuHeader } from '@/components/admin/menu/header';
import { MenuMetrics } from '@/components/admin/menu/metrics';
import { ProductGrid } from '@/components/admin/menu/product-grid';
import { productToFormFields } from '@/components/admin/menu/product-form.utils';
import { MenuSearch } from '@/components/admin/menu/search';
import { productService } from '@/services/product.service';
import { Category, Product, ProductFilterCategory } from '@/types/product.types';
import { CreateProductPayload } from '@/types/product-form.types';

type ProductModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; product: Product };

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductFilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<ProductModalState>({ mode: 'closed' });
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError('Error al cargar los productos. Intenta recargar la página.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ─── Refresh active categories (called after category CRUD) ──────────────────

  async function refreshCategories() {
    try {
      const data = await productService.getCategories();
      setCategories(data);
      // If the active filter no longer exists, reset to 'all'
      if (activeCategory !== 'all' && !data.find((c) => c.id === activeCategory)) {
        setActiveCategory('all');
      }
    } catch {
      // non-blocking; categories will be stale at worst
    }
  }

  // ─── Filtering ───────────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.categoryId === activeCategory;

      const matchesSearch =
        normalized === '' ||
        product.name.toLowerCase().includes(normalized) ||
        (product.description ?? '').toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const editInitialValues = useMemo(() => {
    if (modalState.mode !== 'edit') return undefined;
    return productToFormFields(modalState.product);
  }, [modalState]);

  // ─── Product modal handlers ───────────────────────────────────────────────────

  function openCreateModal() {
    setModalState({ mode: 'create' });
  }

  function openEditModal(product: Product) {
    setModalState({ mode: 'edit', product });
  }

  function closeModal() {
    if (isSaving) return;
    setModalState({ mode: 'closed' });
  }

  // ─── Product CRUD handlers ────────────────────────────────────────────────────

  async function handleCreateProduct(payload: CreateProductPayload) {
    try {
      setIsSaving(true);
      setError(null);
      const created = await productService.createProduct(payload);
      setProducts((prev) => [created, ...prev]);
      setModalState({ mode: 'closed' });
    } catch {
      setError('No se pudo crear el producto. Verifica los datos e intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateProduct(payload: CreateProductPayload) {
    if (modalState.mode !== 'edit') return;
    const productId = modalState.product.id;

    try {
      setIsSaving(true);
      setError(null);
      const updated = await productService.updateProduct(productId, payload);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updated : p)),
      );
      setModalState({ mode: 'closed' });
    } catch {
      setError('No se pudo actualizar el producto. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleStatus(product: Product) {
    const isActive = product.status === 'active';
    const action = isActive ? 'desactivar' : 'activar';
    if (!window.confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} "${product.name}"?`)) return;

    try {
      setDeletingId(product.id);
      setError(null);
      const updated = await productService.toggleProductStatus(product.id, !isActive);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch {
      setError(`No se pudo ${action} el producto. Intenta de nuevo.`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleHardDelete(product: Product) {
    if (!window.confirm(`¿Eliminar permanentemente "${product.name}"? Esta acción no se puede deshacer.`)) return;

    try {
      setDeletingId(product.id);
      setError(null);
      await productService.permanentlyDeleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      setError('No se pudo eliminar el producto. Intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-zinc-400">Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <MenuHeader onCreateProductClick={openCreateModal} />

        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-red-800 bg-red-950/40 px-5 py-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 text-sm text-zinc-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        )}

        <MenuCategoryTabs
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onManageClick={() => setManageCategoriesOpen(true)}
        />
        <MenuSearch value={searchTerm} onChange={setSearchTerm} />
        <MenuMetrics products={filteredProducts} />
        <ProductGrid
          products={filteredProducts}
          busyId={deletingId}
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          onHardDelete={handleHardDelete}
        />
      </div>

      <CreateProductModal
        isOpen={modalState.mode !== 'closed'}
        mode={modalState.mode === 'edit' ? 'edit' : 'create'}
        categories={categories}
        initialValues={editInitialValues}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={
          modalState.mode === 'edit' ? handleUpdateProduct : handleCreateProduct
        }
      />

      <ManageCategoriesModal
        isOpen={manageCategoriesOpen}
        onClose={() => setManageCategoriesOpen(false)}
        onCategoriesChanged={refreshCategories}
      />
    </>
  );
}
