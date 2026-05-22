/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import type {
  Product,
  SelectedOptionGroup,
  SelectedOptionItem,
  StorefrontOptionGroup,
  StorefrontOptionItem,
} from "@/types/storefront.types";

const PRODUCT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop";

const OPTION_PLACEHOLDER =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop";

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
  if (group.maxSelections === 1) return "Elige 1 opción";
  if (group.maxSelections === group.minSelections)
    return `Elige ${group.maxSelections} opciones`;
  return `Elige hasta ${group.maxSelections}`;
}

function groupHasImages(group: StorefrontOptionGroup): boolean {
  return group.options.some((o) => o.imageUrl);
}

function cardVariantClass(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) return "border-red-500 shadow-lg shadow-red-900/20 bg-red-500/8";
  if (isDisabled) return "border-white/5 opacity-35 cursor-not-allowed";
  return "border-white/10 hover:border-white/25 hover:bg-white/4";
}

function rowVariantClass(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) return "border-red-500 bg-red-500/10";
  if (isDisabled) return "border-white/5 cursor-not-allowed opacity-35";
  return "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5";
}

// ─── Card option (con imagen) ─────────────────────────────────────────────────

function OptionCard({
  option,
  isSelected,
  isDisabled,
  isSingleSelect,
  onToggle,
}: Readonly<{
  option: StorefrontOptionItem;
  isSelected: boolean;
  isDisabled: boolean;
  isSingleSelect: boolean;
  onToggle: () => void;
}>) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200",
        cardVariantClass(isSelected, isDisabled),
      ].join(" ")}
    >
      {/* Imagen */}
      <div className="relative w-full overflow-hidden bg-zinc-900" style={{ aspectRatio: "4/3" }}>
        <img
          src={option.imageUrl ?? OPTION_PLACEHOLDER}
          alt={option.name}
          className={[
            "h-full w-full object-cover transition-transform duration-300",
            isDisabled ? "" : "group-hover:scale-105",
          ].join(" ")}
        />
        {isSelected && <div className="absolute inset-0 bg-red-500/15" />}
        <div
          className={[
            "absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center border-2 shadow-lg transition-all",
            isSingleSelect ? "rounded-full" : "rounded-lg",
            isSelected
              ? "border-red-500 bg-red-500 text-white"
              : "border-white/40 bg-black/50 backdrop-blur-sm",
          ].join(" ")}
        >
          {isSelected && <Check size={14} strokeWidth={3} />}
        </div>
      </div>

      {/* Etiqueta */}
      <div className={["px-3 py-2.5 transition-colors", isSelected ? "bg-red-500/10" : ""].join(" ")}>
        <p className="text-sm font-semibold leading-snug text-white">{option.name}</p>
        {option.extraPrice > 0 ? (
          <p className="mt-0.5 text-xs font-bold text-red-400">+{formatCurrency(option.extraPrice)}</p>
        ) : (
          <p className="mt-0.5 text-xs text-zinc-500">Incluido</p>
        )}
      </div>
    </button>
  );
}

// ─── Row option (sin imagen) ──────────────────────────────────────────────────

function OptionRow({
  option,
  isSelected,
  isDisabled,
  isSingleSelect,
  onToggle,
}: Readonly<{
  option: StorefrontOptionItem;
  isSelected: boolean;
  isDisabled: boolean;
  isSingleSelect: boolean;
  onToggle: () => void;
}>) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      className={[
        "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all",
        rowVariantClass(isSelected, isDisabled),
      ].join(" ")}
    >
      <span
        className={[
          "grid h-5 w-5 shrink-0 place-items-center border-2 transition-all",
          isSingleSelect ? "rounded-full" : "rounded-md",
          isSelected ? "border-red-500 bg-red-500" : "border-zinc-600",
        ].join(" ")}
      >
        {isSelected && <Check size={10} strokeWidth={3} className="text-white" />}
      </span>
      <span className="flex-1 text-base font-medium text-zinc-100">{option.name}</span>
      {option.extraPrice > 0 && (
        <span className="shrink-0 text-sm font-bold text-red-400">
          +{formatCurrency(option.extraPrice)}
        </span>
      )}
    </button>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export function ProductOptionsModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) {
  const [selections, setSelections] = useState<Map<string, Set<string>>>(new Map());
  const [errors, setErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setSelections(new Map());
      setErrors(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function toggleOption(group: StorefrontOptionGroup, optionId: string) {
    setSelections((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(group.id) ?? []);
      if (group.maxSelections === 1) {
        next.set(group.id, new Set([optionId]));
      } else if (current.has(optionId)) {
        current.delete(optionId);
        next.set(group.id, current);
      } else if (current.size < group.maxSelections) {
        current.add(optionId);
        next.set(group.id, current);
      }
      return next;
    });
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete(group.id);
      return next;
    });
  }

  const extraPrice = product.optionGroups
    .flatMap((g) => g.options.filter((o) => selections.get(g.id)?.has(o.id)))
    .reduce((sum, o) => sum + o.extraPrice, 0);

  const totalPrice = (product.price ?? 0) + extraPrice;

  function handleConfirm() {
    const newErrors = new Set<string>();
    for (const group of product.optionGroups) {
      if (group.isRequired && (selections.get(group.id)?.size ?? 0) < group.minSelections) {
        newErrors.add(group.id);
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0f0f0f] md:flex-row">

      {/* ── Panel izquierdo: info del producto ───────────────────────────────── */}
      <div className="relative flex shrink-0 flex-col md:w-[42%]">

        {/* Imagen de fondo — panel completo en desktop */}
        <div className="relative h-56 overflow-hidden md:absolute md:inset-0 md:h-auto">
          <img
            src={product.imageUrl ?? PRODUCT_PLACEHOLDER}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent md:via-[#0f0f0f]/10" />
        </div>

        {/* Botón volver — mobile */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/70 md:hidden"
        >
          <ArrowLeft size={15} />
          Volver
        </button>

        {/* Info del producto — desktop: sobre la imagen al fondo */}
        <div className="relative z-10 px-7 pb-8 pt-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:pt-0">
          <p className="mb-2 hidden text-xs font-bold uppercase tracking-widest text-red-400 md:block">
            Personaliza tu pedido
          </p>
          <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
            {product.name}
          </h2>
          {product.price != null && (
            <p className="mt-1 text-base font-semibold text-white/60 md:text-lg">
              Desde {formatCurrency(product.price)}
            </p>
          )}
          {product.description && (
            <p className="mt-2 hidden text-sm leading-relaxed text-white/50 md:block md:text-base">
              {product.description}
            </p>
          )}
          {product.includes && (
            <div className="mt-3 hidden rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 backdrop-blur-sm md:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Incluye</p>
              <p className="mt-0.5 text-sm text-zinc-300">{product.includes}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Panel derecho: opciones ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden border-t border-white/8 bg-[#111111] md:border-l md:border-t-0">

        {/* Header del panel — desktop */}
        <div className="hidden shrink-0 items-center justify-between border-b border-white/8 px-8 py-5 md:flex">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              {product.optionGroups.length === 1
                ? "1 grupo de opciones"
                : `${product.optionGroups.length} grupos de opciones`}
            </p>
            <h3 className="mt-0.5 text-xl font-bold text-white">
              {product.optionGroups[0]?.name ?? "Opciones"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Opciones scrollables */}
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-7">
          <div className="flex flex-col gap-8">
            {product.optionGroups.map((group) => {
              const selectedIds = selections.get(group.id) ?? new Set<string>();
              const hasError = errors.has(group.id);
              const isSingleSelect = group.maxSelections === 1;
              const useCards = groupHasImages(group);

              return (
                <div key={group.id}>
                  {/* Cabecera del grupo */}
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-bold text-white md:text-lg">{group.name}</h4>
                      {group.isRequired ? (
                        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                          Requerido
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Opcional
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-zinc-500">{groupLabel(group)}</span>
                  </div>

                  {hasError && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                      <span>⚠</span>
                      <span>Selecciona al menos {group.minSelections} opción para continuar.</span>
                    </div>
                  )}

                  {/* Cards con imagen */}
                  {useCards ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {group.options.map((option) => {
                        const isSelected = selectedIds.has(option.id);
                        const isDisabled =
                          !isSingleSelect && !isSelected && selectedIds.size >= group.maxSelections;
                        return (
                          <OptionCard
                            key={option.id}
                            option={option}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            isSingleSelect={isSingleSelect}
                            onToggle={() => toggleOption(group, option.id)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    /* Filas sin imagen */
                    <div className="flex flex-col gap-2">
                      {group.options.map((option) => {
                        const isSelected = selectedIds.has(option.id);
                        const isDisabled =
                          !isSingleSelect && !isSelected && selectedIds.size >= group.maxSelections;
                        return (
                          <OptionRow
                            key={option.id}
                            option={option}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            isSingleSelect={isSingleSelect}
                            onToggle={() => toggleOption(group, option.id)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer sticky: precio + botón */}
        <div className="shrink-0 border-t border-white/8 bg-[#111111] px-5 pb-8 pt-4 md:px-8 md:pb-6">
          {extraPrice > 0 && (
            <div className="mb-3 flex items-center justify-center gap-3 text-sm text-zinc-500">
              <span>
                Base{" "}
                <span className="font-semibold text-zinc-300">
                  {formatCurrency(product.price ?? 0)}
                </span>
              </span>
              <span className="text-zinc-700">+</span>
              <span>
                Extras{" "}
                <span className="font-bold text-red-400">{formatCurrency(extraPrice)}</span>
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-base font-bold text-white shadow-xl shadow-red-900/30 transition hover:bg-red-500 active:scale-[0.98]"
          >
            <ShoppingCart size={19} />
            Agregar al carrito &mdash; {formatCurrency(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}
