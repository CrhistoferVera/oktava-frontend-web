'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AdvancedMarker,
  Map,
  useMap,
  type MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { X, Search, Loader2 } from 'lucide-react';
import type { Address, AddressPayload } from '@/types/address.types';

const DEFAULT_CENTER = { lat: -17.3895, lng: -66.1568 };
const DEFAULT_ZOOM = 14;

interface AddressFormModalProps {
  readonly isOpen: boolean;
  readonly initialData: Address | null;
  readonly isSaving: boolean;
  readonly onClose: () => void;
  readonly onSave: (payload: AddressPayload) => void;
}

interface FormState {
  label: string;
  direction: string;
  departament: string;
  reference: string;
  contact: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

const EMPTY: FormState = {
  label: '',
  direction: '',
  departament: '',
  reference: '',
  contact: '',
  latitude: DEFAULT_CENTER.lat,
  longitude: DEFAULT_CENTER.lng,
  placeId: '',
};

// ─── Imperatively pans the map when panTarget changes ─────────────────────────
function MapPanner({ panTarget }: { readonly panTarget: { lat: number; lng: number } | null }) {
  const map = useMap('addresses-map');
  useEffect(() => {
    if (map && panTarget) {
      map.panTo(panTarget);
      map.setZoom(16);
    }
  }, [map, panTarget]);
  return null;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function AddressFormModal({ isOpen, initialData, isSaving, onClose, onSave }: AddressFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [markerPos, setMarkerPos] = useState(DEFAULT_CENTER);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const lat = Number(initialData.latitude);
      const lng = Number(initialData.longitude);
      const pos = { lat, lng };
      setForm({
        label: initialData.label,
        direction: initialData.direction,
        departament: initialData.departament,
        reference: initialData.reference ?? '',
        contact: initialData.contact ?? '',
        latitude: lat,
        longitude: lng,
        placeId: initialData.placeId ?? '',
      });
      setMarkerPos(pos);
      setPanTarget(pos);
    } else {
      setForm(EMPTY);
      setMarkerPos(DEFAULT_CENTER);
      setPanTarget(DEFAULT_CENTER);
    }
    setErrors({});
  }, [initialData, isOpen]);

  function setField(key: keyof FormState, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.label.trim()) errs.label = 'Requerido';
    if (!form.direction.trim()) errs.direction = 'Requerido';
    if (!form.departament.trim()) errs.departament = 'Requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      label: form.label.trim(),
      direction: form.direction.trim(),
      departament: form.departament.trim(),
      reference: form.reference.trim() || undefined,
      contact: form.contact.trim() || undefined,
      latitude: form.latitude,
      longitude: form.longitude,
      placeId: form.placeId || undefined,
    });
  }

  function handleMapClick(e: MapMouseEvent) {
    const latLng = e.detail.latLng;
    if (!latLng) return;
    const { lat, lng } = latLng;
    setMarkerPos({ lat, lng });
    setField('latitude', lat);
    setField('longitude', lng);
    setField('placeId', '');
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setField('direction', results[0].formatted_address);
        setField('placeId', results[0].place_id ?? '');
      }
    });
  }

  function handleAutocompleteSelect(direction: string, lat: number, lng: number, placeId: string) {
    setField('direction', direction);
    setField('latitude', lat);
    setField('longitude', lng);
    setField('placeId', placeId);
    setMarkerPos({ lat, lng });
    setPanTarget({ lat, lng });
  }

  if (!isOpen) return null;

  const inputBase = 'w-full rounded-xl border bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 transition';
  const inputNormal = `${inputBase} border-zinc-800 focus:border-red-500`;
  const idleLabel = initialData ? 'Actualizar' : 'Guardar dirección';
  const submitLabel = isSaving ? 'Guardando…' : idleLabel;

  function fc(key: keyof FormState) {
    return errors[key] ? `${inputBase} border-red-500` : inputNormal;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop — button role for a11y */}
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 w-full md:max-w-2xl max-h-[95dvh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {initialData ? 'Editar dirección' : 'Nueva dirección'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 text-zinc-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Autocomplete */}
          <PlacesAutocomplete
            hasError={!!errors.direction}
            onSelect={handleAutocompleteSelect}
          />
          {errors.direction && <p className="text-xs text-red-400 -mt-3">{errors.direction}</p>}

          {/* Map */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">O hacé clic en el mapa para marcar tu ubicación exacta.</p>
            <div className="overflow-hidden rounded-2xl border border-white/10 h-60">
              <Map
                id="addresses-map"
                mapId="addresses-map"
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={handleMapClick}
                style={{ width: '100%', height: '100%' }}
              >
                <MapPanner panTarget={panTarget} />
                <AdvancedMarker position={markerPos} />
              </Map>
            </div>
          </div>

          {/* Label + Departamento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="addr-label" className="text-xs font-medium text-zinc-400">Etiqueta</label>
              <input
                id="addr-label"
                type="text"
                placeholder="Casa, Trabajo…"
                value={form.label}
                onChange={(e) => setField('label', e.target.value)}
                className={fc('label')}
              />
              {errors.label && <p className="text-xs text-red-400">{errors.label}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="addr-departament" className="text-xs font-medium text-zinc-400">Departamento / Piso</label>
              <input
                id="addr-departament"
                type="text"
                placeholder="Apto 3B, Casa 2…"
                value={form.departament}
                onChange={(e) => setField('departament', e.target.value)}
                className={fc('departament')}
              />
              {errors.departament && <p className="text-xs text-red-400">{errors.departament}</p>}
            </div>
          </div>

          {/* Referencia */}
          <div className="space-y-1.5">
            <label htmlFor="addr-reference" className="text-xs font-medium text-zinc-400">
              Referencia <span className="text-zinc-600">(opcional)</span>
            </label>
            <input
              id="addr-reference"
              type="text"
              placeholder="Ej: Frente al parque, portón gris"
              value={form.reference}
              onChange={(e) => setField('reference', e.target.value)}
              className={inputNormal}
            />
          </div>

          {/* Contacto */}
          <div className="space-y-1.5">
            <label htmlFor="addr-contact" className="text-xs font-medium text-zinc-400">
              Contacto <span className="text-zinc-600">(opcional)</span>
            </label>
            <input
              id="addr-contact"
              type="text"
              placeholder="Nombre o teléfono de quien recibe"
              value={form.contact}
              onChange={(e) => setField('contact', e.target.value)}
              className={inputNormal}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Places Search (geocode on Enter or button click) ────────────────────────
interface PlacesAutocompleteProps {
  readonly hasError: boolean;
  readonly onSelect: (direction: string, lat: number, lng: number, placeId: string) => void;
}

function PlacesAutocomplete({ hasError, onSelect }: PlacesAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function geocode() {
    const text = query.trim();
    if (!text || searching) return;
    setSearching(true);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: text }, (results, status) => {
      setSearching(false);
      if (status === 'OK' && results?.[0]) {
        const loc = results[0].geometry.location;
        onSelect(
          results[0].formatted_address,
          loc.lat(),
          loc.lng(),
          results[0].place_id ?? '',
        );
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-zinc-400">Buscar dirección</p>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), geocode())}
          placeholder="Escribe tu dirección y presiona Enter o busca…"
          className={`flex-1 rounded-xl border bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 transition ${
            hasError ? 'border-red-500' : 'border-zinc-800 focus:border-red-500'
          }`}
        />
        <button
          type="button"
          onClick={geocode}
          disabled={searching || !query.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-red-500 hover:text-red-400 disabled:opacity-40"
          aria-label="Buscar"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>
    </div>
  );
}
