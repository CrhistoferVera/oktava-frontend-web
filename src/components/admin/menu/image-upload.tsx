'use client';

import { DragEvent, useRef, useState } from 'react';
import { productService } from '@/services/product.service';

type ImageUploadProps = {
  value: string; // current imageUrl stored in form
  disabled?: boolean;
  onChange: (url: string) => void;
};

const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_MB = 5;

export function ImageUpload({ value, disabled = false, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadError(null);

    if (!ACCEPTED.includes(file.type)) {
      setUploadError('Solo se permiten imágenes JPG, PNG, GIF o WebP.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`El archivo supera el límite de ${MAX_MB} MB.`);
      return;
    }

    try {
      setIsUploading(true);
      const url = await productService.uploadImage(file);
      onChange(url);
    } catch {
      setUploadError('No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected if needed
    e.target.value = '';
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleRemove() {
    onChange('');
    setUploadError(null);
  }

  // ─── Preview state ─────────────────────────────────────────────────────────

  if (value) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-700">
          <img
            src={value}
            alt="Imagen del producto"
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-3 top-3 rounded-xl bg-black/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-black hover:text-white disabled:opacity-50"
          >
            Cambiar
          </button>
        </div>
        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
      </div>
    );
  }

  // ─── Drop zone ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        className={`flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition ${
          isDragging
            ? 'border-red-500 bg-red-500/10'
            : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/50'
        } ${disabled || isUploading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {isUploading ? (
          <>
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-600 border-t-red-500" />
            <p className="text-sm text-zinc-400">Subiendo imagen...</p>
          </>
        ) : (
          <>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-500"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-300">
                Arrastra una imagen aquí
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                o{' '}
                <span className="text-red-400 underline underline-offset-2">
                  selecciona un archivo
                </span>
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                JPG, PNG, WebP · máx. {MAX_MB} MB
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
    </div>
  );
}
