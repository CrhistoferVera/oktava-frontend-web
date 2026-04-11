"use client";

import { useMemo, useState } from "react";
import { MenuCategoryTabs } from "@/components/admin/menu/category-tabs";
import { CreateProductModal } from "@/components/admin/menu/create-product-modal";
import { MenuHeader } from "@/components/admin/menu/header";
import { MenuMetrics } from "@/components/admin/menu/metrics";
import { mockProducts } from "@/components/admin/menu/mock-products";
import { ProductGrid } from "@/components/admin/menu/product-grid";
import { productToFormFields } from "@/components/admin/menu/product-form.utils";
import { MenuSearch } from "@/components/admin/menu/search";
import { Product, ProductFilterCategory } from "@/types/product.types";
import { CreateProductPayload } from "@/types/product-form.types";

type ProductModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; product: Product };

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] =
    useState<ProductFilterCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState<ProductModalState>({
    mode: "closed",
  });

  const filteredProducts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const matchesSearch =
        normalizedSearchTerm === "" ||
        product.name.toLowerCase().includes(normalizedSearchTerm) ||
        product.description.toLowerCase().includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  // Memoized so the form's useEffect only fires when the product actually changes,
  // not on every render.
  const editInitialValues = useMemo(() => {
    if (modalState.mode !== "edit") return undefined;
    return productToFormFields(modalState.product);
  }, [modalState]);

  function openCreateModal() {
    setModalState({ mode: "create" });
  }

  function openEditModal(product: Product) {
    setModalState({ mode: "edit", product });
  }

  function closeModal() {
    setModalState({ mode: "closed" });
  }

  function handleCreateProduct(payload: CreateProductPayload) {
    const newProduct: Product = {
      ...payload,
      id: `product-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  }

  function handleUpdateProduct(payload: CreateProductPayload) {
    if (modalState.mode !== "edit") return;
    const productId = modalState.product.id;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...payload, id: productId } : p)),
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <MenuHeader onCreateProductClick={openCreateModal} />
        <MenuCategoryTabs
          products={products}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <MenuSearch value={searchTerm} onChange={setSearchTerm} />
        <MenuMetrics products={filteredProducts} />
        <ProductGrid products={filteredProducts} onEdit={openEditModal} />
      </div>

      <CreateProductModal
        isOpen={modalState.mode !== "closed"}
        mode={modalState.mode === "edit" ? "edit" : "create"}
        initialValues={editInitialValues}
        onClose={closeModal}
        onSubmit={
          modalState.mode === "edit" ? handleUpdateProduct : handleCreateProduct
        }
      />
    </>
  );
}
