"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ShoppingBag,
  Truck,
  Store,
  QrCode,
  Banknote,
  CreditCard,
  ChevronRight,
  Plus,
  Check,
  ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { useAuth } from "@/context/AuthContext";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";
import { addressService } from "@/services/address.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import type { Address, AddressPayload } from "@/types/address.types";
import type { CartItem } from "@/types/storefront.types";
import type { CreateOrderItemDto, PaymentMethod } from "@/types/order.types";

function cartItemToOrderItem({ product, quantity, selectedOptions }: CartItem): CreateOrderItemDto {
  return {
    productId: product.id,
    quantity,
    selectedOptions: selectedOptions.flatMap((group) =>
      group.items.map((opt) => ({
        optionId: opt.optionId,
        optionName: opt.name,
        extraPrice: opt.extraPrice,
      }))
    ),
  };
}

const AddressFormModal = dynamic(
  () =>
    import("@/components/client/addresses/address-form-modal").then(
      (m) => m.AddressFormModal,
    ),
  { ssr: false },
);

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const STORE_LAT = -17.392267;
const STORE_LNG = -66.069302;
const MAX_DELIVERY_KM = 14;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcDeliveryFee(km: number) {
  const d = km * 1.25;
  if (d <= 2) return 5;
  if (d <= 5) return 10;
  if (d <= 8) return 15;
  return 20;
}

function formatCurrency(v: number) {
  return `Bs. ${v.toFixed(0)}`;
}

// Niubiz solo disponible cuando el flag sandbox está activo explícitamente.
// Para habilitar: NEXT_PUBLIC_ENABLE_NIUBIZ_SANDBOX=true en .env.local
// Para deshabilitar (o en producción): eliminar o poner en false la variable.
const NIUBIZ_SANDBOX_ENABLED = process.env.NEXT_PUBLIC_ENABLE_NIUBIZ_SANDBOX === 'true';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "QR",   label: "Código QR", icon: <QrCode size={20} />,   desc: "Paga escaneando el QR" },
  { id: "CASH", label: "Efectivo",  icon: <Banknote size={20} />, desc: "Paga al recibir tu pedido" },
  ...(NIUBIZ_SANDBOX_ENABLED
    ? [{ id: "NIUBIZ" as PaymentMethod, label: "Tarjeta", icon: <CreditCard size={20} />, desc: "Visa / Mastercard — Niubiz" }]
    : []),
];

type Step = "checkout" | "payment" | "success";

export default function CheckoutClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useStorefrontCart();

  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QR");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("checkout");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ─── Niubiz ────────────────────────────────────────────────────────────────
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ─── Niubiz ────────────────────────────────────────────────────────────────
  const [niubizLoading, setNiubizLoading] = useState(false);
  // Verdadero mientras el modal del widget de Niubiz está abierto.
  // Bloquea el botón para impedir abrir una segunda sesión simultánea.
  const [niubizWidgetOpen, setNiubizWidgetOpen] = useState(false);
  // Ref estable para el callback del widget (evita closures estales con el estado de React).
  // La firma solo necesita transactionToken; orderId viaja en el closure de handleNiubizPay.
  const niubizCompleteRef = useRef<(transactionToken: string) => void>(() => {});

  useEffect(() => {
    addressService
      .getAll()
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const deliveryKm = useMemo(() => {
    if (orderType !== "DELIVERY" || !selectedAddress) return 0;
    return haversineKm(STORE_LAT, STORE_LNG, Number(selectedAddress.latitude), Number(selectedAddress.longitude));
  }, [orderType, selectedAddress]);

  const outOfRange = orderType === "DELIVERY" && deliveryKm > MAX_DELIVERY_KM;
  const deliveryFee =
    orderType === "DELIVERY" && !!selectedAddress && !outOfRange
      ? calcDeliveryFee(deliveryKm)
      : 0;

  const total = totalAmount + deliveryFee;

  async function handleSaveAddress(payload: AddressPayload) {
    setSavingAddress(true);
    try {
      const created = await addressService.create(payload);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressModal(false);
    } catch {
      // ignore
    } finally {
      setSavingAddress(false);
    }
  }

  function handleProceed() {
    setError(null);

    // 1. Sin sesión → modal (no redirige, no crea pedido, no limpia carrito)
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    // 2. Logueado pero sin teléfono verificado → flujo de verificación (no login)
    if (!user.phoneVerified) {
      router.push("/verify-phone?redirect=/checkout");
      return;
    }

    if (orderType === "DELIVERY" && !selectedAddressId) {
      setError("Selecciona una dirección de entrega.");
      return;
    }
    if (outOfRange) {
      setError(`La dirección está fuera del rango de entrega (máximo ${MAX_DELIVERY_KM} km).`);
      return;
    }
    if (items.length === 0) return;
    setStep("payment");
  }

  // ─── Helpers Niubiz ────────────────────────────────────────────────────────

  function loadNiubizScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.VisanetCheckout) { resolve(); return; }
      const existing = document.getElementById('niubiz-sdk');
      if (existing) { existing.addEventListener('load', () => resolve()); return; }
      const el = document.createElement('script');
      el.id = 'niubiz-sdk';
      el.src = scriptUrl;
      el.onload = () => resolve();
      el.onerror = (ev) => {
        // [DIAG] Loguear la URL exacta que falló y el evento de error
        console.error('[Niubiz][DIAG] Script load FAILED');
        console.error('[Niubiz][DIAG] scriptUrl intentada:', scriptUrl);
        console.error('[Niubiz][DIAG] Abre esa URL en el navegador para ver si da 404/403/CORS');
        console.error('[Niubiz][DIAG] ErrorEvent:', ev);
        reject(new Error('No se pudo cargar el script de Niubiz'));
      };
      document.head.appendChild(el);
    });
  }

  /**
   * Flujo seguro de pago con Niubiz:
   * 1. Llama al backend con el payload del checkout (sin amount).
   *    El backend crea Order→PENDING_PAYMENT + Payment→pending y devuelve sessionKey + orderId.
   * 2. Carga el script JS de Niubiz dinámicamente.
   * 3. Configura y abre el widget de captura de tarjeta.
   * 4. En el callback `complete`: llama a authorizeNiubizPayment(orderId, token).
   *    El backend actualiza Payment→paid y Order→PENDING atómicamente.
   *    El frontend NO crea la orden ni envía el monto.
   */
  async function handleNiubizPay() {
    setNiubizLoading(true);
    setError(null);
    try {
      // El backend calcula el monto y crea la orden (PENDING_PAYMENT) + Payment (pending).
      // El frontend NO envía `amount` ni crea la orden después de autorizar.
      const session = await paymentService.createNiubizSession({
        orderType,
        addressId: orderType === "DELIVERY" ? (selectedAddressId ?? undefined) : undefined,
        notes: notes.trim() || undefined,
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      });

      const { orderId, orderNumber, sessionKey, purchaseNumber, merchantId, amount } = session;

      // [DIAG] Diagnosticar URL del script de Niubiz
      const rawUrl = process.env.NEXT_PUBLIC_NIUBIZ_SCRIPT_URL ?? '';
      console.log('[Niubiz][DIAG] NEXT_PUBLIC_NIUBIZ_SCRIPT_URL:', rawUrl || '(vacío / no definido)');
      console.log('[Niubiz][DIAG] merchantId recibido del backend:', merchantId);

      // Reemplaza el placeholder AAAA con el merchantId real.
      const scriptUrl =
        rawUrl.replace('AAAA', merchantId) ||
        `https://static.niubiz.com.pe/apiform/${merchantId}/js/main.min.js`;

      console.log('[Niubiz][DIAG] scriptUrl final:', scriptUrl);
      if (scriptUrl.includes('AAAA')) {
        console.error('[Niubiz][DIAG] ERROR: scriptUrl todavía contiene "AAAA" — el reemplazo falló. ¿merchantId es undefined?');
      }
      if (!merchantId) {
        console.error('[Niubiz][DIAG] ERROR: merchantId es undefined/null — revisa NIUBIZ_MERCHANT_ID en el .env del backend.');
      }

      await loadNiubizScript(scriptUrl);

      if (!window.VisanetCheckout) {
        throw new Error('El widget de Niubiz no está disponible. Intenta recargando la página.');
      }

      // Captura orderId/orderNumber en el closure. El ref evita closures estales del estado.
      niubizCompleteRef.current = async (transactionToken: string) => {
        setNiubizWidgetOpen(false);
        setNiubizLoading(true);
        setError(null);
        try {
          // El backend busca el Payment por orderId, autoriza en Niubiz y actualiza
          // Payment→paid + Order→PENDING en una sola transacción.
          const result = await paymentService.authorizeNiubizPayment({
            orderId,
            transactionToken,
          });

          if (result.success) {
            setOrderNumber(orderNumber);
            clearCart();
            setStep("success");
          } else {
            setError('El pago fue rechazado por el banco. Puedes intentar con otra tarjeta.');
            setNiubizLoading(false);
          }
        } catch (e: any) {
          setError(e?.response?.data?.message ?? 'El pago fue rechazado. Puedes intentarlo nuevamente.');
          setNiubizLoading(false);
        }
      };

      window.VisanetCheckout.configure({
        sessiontoken: sessionKey,
        channel: 'web',
        merchantid: merchantId,
        purchasenumber: purchaseNumber,
        amount: amount.toFixed(2),
        currency: 'PEN',
        complete: (params) => {
          niubizCompleteRef.current(params.transactionToken);
        },
        cancel: () => {
          setNiubizWidgetOpen(false);
          setNiubizLoading(false);
          setError('Pago cancelado. La orden quedará en espera hasta que completes el pago.');
        },
      });

      setNiubizWidgetOpen(true);
      window.VisanetCheckout.open();
      // El widget es modal externo; resetear loading para no bloquear el botón.
      // niubizWidgetOpen permanece true hasta complete/cancel.
      setNiubizLoading(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'No se pudo iniciar el pago con Niubiz.');
      setNiubizLoading(false);
      setNiubizWidgetOpen(false);
    }
  }

  async function handleConfirmPayment() {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await orderService.createOrder({
        orderType,
        addressId: orderType === "DELIVERY" ? (selectedAddressId ?? undefined) : undefined,
        notes: notes.trim() || undefined,
        items: items.map(cartItemToOrderItem),
      });
      setOrderNumber(order.orderNumber);
      clearCart();
      setStep("success");
    } catch (e: any) {
      const code = e?.response?.data?.code;
      const message = e?.response?.data?.message ?? "Ocurrió un error al crear el pedido.";
      setError(
        code === 'PHONE_NOT_VERIFIED'
          ? "Debes verificar tu número de teléfono antes de realizar un pedido. Contacta con soporte o actualiza tu perfil."
          : message,
      );
      setStep("checkout");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10">
          <ShoppingBag size={36} className="text-zinc-600" />
        </div>
        <p className="font-semibold text-white">Tu carrito está vacío</p>
        <p className="text-sm text-zinc-500">Agrega productos desde el menú para continuar.</p>
        <button
          type="button"
          onClick={() => router.push("/menu")}
          className="mt-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
        >
          Ver menú
        </button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-green-500/10 border border-green-500/30">
          <Check size={36} className="text-green-400" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-white [font-family:var(--font-display)] uppercase tracking-wide">
            ¡Pedido confirmado!
          </p>
          <p className="text-zinc-400 text-sm">
            Tu pedido <span className="font-semibold text-white">{orderNumber}</span> fue recibido.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-red-500"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <button
          type="button"
          onClick={() => setStep("checkout")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Pago</p>
          <h1 className="text-3xl text-white [font-family:var(--font-display)] uppercase tracking-wide">
            Confirmar pago
          </h1>
        </div>

        {paymentMethod === "QR" && (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">Escanea el código QR para pagar</p>
            {/* Fake QR — grid pattern */}
            <div className="h-48 w-48 rounded-xl border border-white/10 bg-zinc-900 grid grid-cols-7 gap-0.5 p-3">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`}
                />
              ))}
            </div>
            <p className="text-lg font-bold text-white">{formatCurrency(total)}</p>
            <p className="text-xs text-zinc-500 text-center">
              Una vez realizado el pago presiona "Confirmar pago"
            </p>
          </div>
        )}

        {paymentMethod === "CASH" && (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col items-center gap-3 text-center">
            <Banknote size={48} className="text-green-400" />
            <p className="font-semibold text-white">Pago en efectivo</p>
            <p className="text-zinc-400 text-sm">
              Prepara exactamente <span className="font-bold text-white">{formatCurrency(total)}</span> al momento de la entrega.
            </p>
          </div>
        )}

        {paymentMethod === "NIUBIZ" && (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4">
            {/* Badge sandbox */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">Sandbox — sin cobro real</span>
            </div>

            <p className="text-xs text-yellow-400/80">
              Niubiz está en modo sandbox. Flujo temporal de desarrollo — no usar en producción.
            </p>

            <div className="flex items-center gap-3">
              <CreditCard size={28} className="text-blue-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Pago con tarjeta</p>
                <p className="text-xs text-zinc-500">Procesado por Niubiz (VisaNet Perú)</p>
              </div>
            </div>

            <p className="text-sm text-zinc-400">
              Al hacer clic en <span className="text-white font-medium">"Pagar con Niubiz"</span> se abrirá el
              formulario seguro de captura de tarjeta Visa / Mastercard.
            </p>

            <p className="text-xs text-zinc-600">
              El carrito se limpiará únicamente cuando el pago sea confirmado exitosamente.
            </p>
          </div>
        )}

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

        {paymentMethod === "NIUBIZ" ? (
          <button
            type="button"
            onClick={handleNiubizPay}
            disabled={niubizLoading || niubizWidgetOpen}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 disabled:opacity-60"
          >
            {niubizLoading ? "Conectando con Niubiz…" : niubizWidgetOpen ? "Formulario abierto…" : "Pagar con Niubiz"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 disabled:opacity-60"
          >
            {isSubmitting ? "Procesando…" : "Confirmar pago"}
          </button>
        )}
      </div>
    );
  }

  // ─── Step: checkout ───────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Checkout</p>
          <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl uppercase tracking-wide">
            Tu pedido
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-4">
            {/* Delivery / Pickup */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
              <p className="text-sm font-semibold text-white">¿Cómo quieres recibir tu pedido?</p>
              <div className="grid grid-cols-2 gap-3">
                {(["DELIVERY", "PICKUP"] as const).map((type) => {
                  const active = orderType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={[
                        "flex flex-col items-center gap-2 rounded-xl border p-4 transition",
                        active
                          ? "border-red-500 bg-red-500/10 text-red-300"
                          : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/20",
                      ].join(" ")}
                    >
                      {type === "DELIVERY" ? <Truck size={22} /> : <Store size={22} />}
                      <span className="text-sm font-semibold">
                        {type === "DELIVERY" ? "Delivery" : "Recoger en local"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Address selector — only if DELIVERY */}
            {orderType === "DELIVERY" && (
              <section className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin size={15} className="text-red-400" />
                  Dirección de entrega
                </p>

                {loadingAddresses ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <p className="text-sm text-zinc-500">No tienes direcciones guardadas.</p>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => {
                      const active = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={[
                            "w-full flex items-start gap-3 rounded-xl border p-3 text-left transition",
                            active
                              ? "border-red-500 bg-red-500/10"
                              : "border-white/8 bg-white/3 hover:border-white/20",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                              active ? "border-red-500 bg-red-500" : "border-zinc-600",
                            ].join(" ")}
                          >
                            {active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{addr.label}</p>
                            <p className="text-xs text-zinc-400 truncate">{addr.direction}</p>
                            <p className="text-xs text-zinc-500">{addr.departament}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-zinc-400 transition hover:border-white/40 hover:text-white"
                >
                  <Plus size={14} /> Agregar nueva dirección
                </button>

                {outOfRange && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    Esta dirección está fuera del rango de entrega (máximo {MAX_DELIVERY_KM} km desde el local).
                  </p>
                )}
              </section>
            )}

            {/* Payment method */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
              <p className="text-sm font-semibold text-white">Método de pago</p>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={[
                        "w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition",
                        active
                          ? "border-red-500 bg-red-500/10"
                          : "border-white/8 bg-white/3 hover:border-white/20",
                      ].join(" ")}
                    >
                      <span className={active ? "text-red-400" : "text-zinc-500"}>{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{opt.label}</p>
                        <p className="text-xs text-zinc-500">{opt.desc}</p>
                      </div>
                      {active && <Check size={16} className="text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-2">
              <p className="text-sm font-semibold text-white">Instrucciones especiales <span className="text-zinc-600 font-normal">(opcional)</span></p>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sin picante, sin cebolla, tocar el timbre…"
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500 transition"
              />
            </section>
          </div>

          {/* Right column — Order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
              <p className="text-sm font-semibold text-white">Resumen del pedido</p>

              {/* Items */}
              <div className="space-y-3">
                {items.map(({ _cartId, product, quantity }) => (
                  <div key={_cartId} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-xs font-bold text-red-300">
                      {quantity}
                    </span>
                    <p className="flex-1 text-sm text-zinc-300 truncate">{product.name}</p>
                    <p className="text-sm font-semibold text-white shrink-0">
                      {formatCurrency((product.price ?? 0) * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-400" : "text-white"}>
                    {orderType === "PICKUP" ? "—" : deliveryFee === 0 ? "Gratis" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-1 border-t border-white/8">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleProceed}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 hover:scale-[1.02] active:scale-100"
              >
                Ir a pagar
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <APIProvider apiKey={MAPS_API_KEY} libraries={["places"]}>
          <AddressFormModal
            isOpen={showAddressModal}
            initialData={null}
            isSaving={savingAddress}
            onClose={() => setShowAddressModal(false)}
            onSave={handleSaveAddress}
          />
        </APIProvider>
      )}

      {/* Modal de auth requerida al intentar pagar sin sesión */}
      <AuthRequiredModal
        open={authModalOpen}
        message="Necesitas iniciar sesión o registrarte para realizar un pedido."
        confirmHref="/sign-in?redirect=/checkout"
        onCancel={() => setAuthModalOpen(false)}
      />
    </>
  );
}
