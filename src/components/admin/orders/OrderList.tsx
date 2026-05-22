import { OrderItem } from "@/types";

interface Props {
  orderDetail?: OrderItem[] | null;
}

export const OrderList = ({ orderDetail }: Props) => {
  return (
    <div className="text-[12px]">
      <p className="text-gray-700 font-bold py-1">DETALLE PEDIDO:</p>
      {orderDetail && orderDetail.length > 0 ? (
        orderDetail.map((item) => (
          <div
            key={item.id}
            className="bg-gray-600/20 rounded-lg border border-gray-800 mb-2 overflow-hidden"
          >
            {/* Product row */}
            <div className="flex justify-between items-start px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold leading-tight">{item.productName}</p>
                <p className="text-gray-600 font-normal mt-0.5">x{item.quantity}</p>
              </div>
              <p className="text-red-500 font-bold font-roboto-condensed text-sm shrink-0 pl-3">
                {item.subtotal} Bs.
              </p>
            </div>

            {/* Selected options */}
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="border-t border-gray-800 px-3 py-1.5 flex flex-col gap-0.5">
                {item.selectedOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <span className="text-gray-700">↳</span>
                      {opt.optionName}
                    </span>
                    {opt.extraPrice > 0 && (
                      <span className="text-red-700 font-semibold">
                        +{opt.extraPrice} Bs.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Item notes */}
            {item.notes && (
              <div className="border-t border-gray-800 px-3 py-1.5">
                <span className="text-gray-600 italic">{item.notes}</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-700">No hay artículos en el pedido.</p>
      )}
    </div>
  );
};
