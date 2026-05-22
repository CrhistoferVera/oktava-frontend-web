/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import type {
  Product,
  SelectedOptionGroup,
  SelectedOptionItem,
  StorefrontOptionGroup,
} from "@/types/storefront.types";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop";

interface ProductOptionsModalProps {
  readonly product: Product;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (selectedOptions: SelectedOptionGroup[]) => void;
}

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

function groupLabel(group: StorefrontOptionGroup): string {
  if (group.maxSelections === 1) return "Elige 1";
  if (group.maxSelections === group.minSelections)
    return `Elige exactamente ${group.maxSelections}`;
  return `Elige hasta ${group.maxSelections}`;
}

export function ProductOptionsModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) {
  // Map of groupId → Set of selected optionIds
  const [selections, setSelections] = useState<Map<string, Set<string>>>(
    new Map(),
  );
  const [errors, setErrors] = useState<Set<string>>(new Set());

  // Reset selections each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelections(new Map());
      setErrors(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ─── Selection helpers ──────────────────────────────────────────────────────

  function toggleOption(group: StorefrontOptionGroup, optionId: string) {
    setSelections((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(group.id) ?? []);

      if (group.maxSelections === 1) {
        // Radio: replace selection
        next.set(group.id, new Set([optionId]));
      } else if (current.has(optionId)) {
        // Uncheck
        current.delete(optionId);
        next.set(group.id, current);
      } else if (current.size < group.maxSelections) {
        // Check (only if under limit)
        current.add(optionId);
        next.set(group.id, current);
      }

      return next;
    });

    // Clear error for this group when user interacts
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete(group.id);
      return next;
    });
  }

  // ─── Computed values ────────────────────────────────────────────────────────

  const extraPrice = product.optionGroups
    .flatMap((g) =>
      g.options.filter((o) => selections.get(g.id)?.has(o.id)),
    )
    .reduce((sum, o) => sum + o.extraPrice, 0);

  const totalPrice = (product.price ?? 0) + extraPrice;

  // ─── Validation & submit ────────────────────────────────────────────────────

  function handleConfirm() {
    const newErrors = new Set<string>();
    for (const group of product.optionGroups) {
      if (group.isRequired) {
        const count = selections.get(group.id)?.size ?? 0;
        if (count < group.minSelections) {
          newErrors.add(group.id);
        }
      }
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedGroups: SelectedOptionGroup[] = product.optionGroups
      .map((group) => {
        const selectedIds = selections.get(group.id) ?? new Set<string>();
        const items: SelectedOptionItem[] = group.options
          .filter((o) => selectedIds.has(o.id))
          .map((o) => ({ optionId: o.id, name: o.name, extraPrice: o.extraPrice }));
        return { groupId: group.id, groupName: group.name, items };
      })
      .filter((g) => g.items.length > 0);

    onConfirm(selectedGroups);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[#0f0f0f] shadow-2xl md:inset-0 md:m-auto md:rounded-3xl md:max-h-[85dvh]">
        {/* Product hero */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-56">
          <img
            src={product.imageUrl ?? PLACEHOLDER}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 pt-4">
          {/* Name & price */}
          <div className="mb-1 flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold leading-tight text-white">
              {product.name}
            </h2>
            <span className="shrink-0 text-lg font-bold text-white">
              {product.price == null ? "—" : formatCurrency(product.price)}
            </span>
          </div>

          {product.description && (
            <p className="mb-3 text-sm leading-relaxed text-zinc-400">
              {product.description}
            </p>
          )}

          {product.includes && (
            <div className="mb-4 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Incluye
              </p>
              <p className="mt-0.5 text-sm text-zinc-300">{product.includes}</p>
            </div>
          )}

          {/* Option groups */}
          <div className="flex flex-col gap-5 pb-2">
            {product.optionGroups.map((group) => {
              const selectedIds = selections.get(group.id) ?? new Set<string>();
              const hasError = errors.has(group.id);
              const isSingleSelect = group.maxSelections === 1;

              return (
                <div key={group.id}>
                  {/* Group header */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{group.name}</p>
                      {group.isRequired && (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                          Requerido
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">{groupLabel(group)}</span>
                  </div>

                  {hasError && (
                    <p className="mb-2 text-xs text-red-400">
                      Debes seleccionar al menos {group.minSelections} opción.
                    </p>
                  )}

                  {/* Options */}
                  <div className="flex flex-col gap-1.5">
                    {group.options.map((option) => {
                      const isSelected = selectedIds.has(option.id);
                      const isDisabled =
                        !isSingleSelect &&
                        !isSelected &&
                        selectedIds.size >= group.maxSelections;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleOption(group, option.id)}
                          disabled={isDisabled}
                          className={[
                            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                            isSelected
                              ? "border-red-500 bg-red-500/10 text-white"
                              : isDisabled
                                ? "border-white/5 bg-white/2 text-zinc-600 cursor-not-allowed"
                                : "border-white/10 bg-white/3 text-zinc-200 hover:border-white/25 hover:bg-white/6",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            {/* Indicator */}
                            <span
                              className={[
                                "grid h-5 w-5 shrink-0 place-items-center",
                                isSingleSelect
                                  ? "rounded-full border-2"
                                  : "rounded-md border-2",
                                isSelected
                                  ? "border-red-500 bg-red-500"
                                  : "border-zinc-600",
                              ].join(" ")}
                            >
                              {isSelected && (
                                <span className="block h-2 w-2 rounded-full bg-white" />
                              )}
                            </span>
                            <span className="text-sm font-medium">{option.name}</span>
                          </div>
                          {option.extraPrice > 0 && (
                            <span className="text-sm font-semibold text-red-400">
                              +{formatCurrency(option.extraPrice)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-white/8 px-5 pb-6 pt-4">
          {extraPrice > 0 && (
            <p className="mb-2 text-center text-xs text-zinc-500">
              Precio base{" "}
              <span className="text-zinc-300">{formatCurrency(product.price ?? 0)}</span>
              {" + extras "}
              <span className="text-red-400">{formatCurrency(extraPrice)}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 hover:scale-[1.01] active:scale-100"
          >
            <Plus size={16} />
            Agregar al carrito &mdash; {formatCurrency(totalPrice)}
          </button>
        </div>
      </div>
    </>
  );
}
