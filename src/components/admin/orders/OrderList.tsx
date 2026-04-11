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
                <div key={item.id} className="flex justify-between bg-gray-600/20 rounded-lg border border-gray-800 mb-2 py-0.5">
                    <div>
                        <p className="px-3  text-white font-bold">{item.productName}</p>
                        <p className="px-3  text-gray-600 font-normal">x{item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="px-3 py-1.5 text-red-500 font-bold font-roboto-condensed text-sm items-center">{item.subtotal} Bs.</p>
                    </div>
                    
                    
                </div>
            ))
        ):(
            <p className="text-gray-700">No hay artículos en el pedido.</p>
        )}
    </div>
  )
}
