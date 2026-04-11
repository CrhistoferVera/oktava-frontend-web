interface OrderSummaryProps {
    subtotal: string;
    deliveryFee: string;
    total: string;
}

export const OrderSummary = ({ subtotal, deliveryFee, total }: OrderSummaryProps) => {
  return (
    <div className="bg-gray-600/20 rounded-lg border border-gray-800 text-sm  ">
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Subtotal:</p>
                <p className="px-3 py-1.5 text-white font-semibold font-roboto-condensed">{subtotal}</p>
              </div>
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Costo de Envío:</p>
                <p className="px-3 py-1.5 text-white font-semibold font-roboto-condensed">{deliveryFee}</p>
              </div>
              <div className="flex justify-between">
                <p className="px-3 py-1.5 text-white font-semibold">Total:</p>
                <p className="px-3 py-1.5 text-red-500 font-bold text-lg font-roboto-condensed">{total}</p>
              </div>
            </div>
  )
}
