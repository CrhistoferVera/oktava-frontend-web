import { OrderItem } from "@/types";

interface Props {
  orderDetail?: OrderItem[] | null;
}

export const OrderList = ({ orderDetail }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
        Detalle del pedido
      </p>

      {orderDetail && orderDetail.length > 0 ? (
        orderDetail.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60"
          >
            {/* Fila del producto */}
            <div className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="flex items-start gap-3">
                {/* Cantidad badge */}
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-zinc-300">
                  {item.quantity}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug text-white">
                    {item.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    Bs. {item.unitPrice} c/u
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold text-red-400">
                Bs. {item.subtotal}
              </p>
            </div>

            {/* Opciones seleccionadas */}
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="border-t border-zinc-800 bg-zinc-950/50 px-4 py-2.5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Opciones elegidas
                </p>
                <div className="flex flex-col gap-1.5">
                  {item.selectedOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-zinc-200">
                          {opt.optionName}
                        </span>
                      </div>
                      {opt.extraPrice > 0 && (
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-400">
                          +Bs. {opt.extraPrice}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nota del ítem */}
            {item.notes && (
              <div className="border-t border-zinc-800 bg-amber-950/20 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Nota
                </p>
                <p className="mt-0.5 text-xs italic text-amber-300/80">{item.notes}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-zinc-700">No hay artículos en el pedido.</p>
      )}
    </div>
  );
};
