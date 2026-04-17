"use client";

import dynamic from "next/dynamic";

const OrdersClient = dynamic(
  () => import("@/components/client/orders/orders-client"),
  { ssr: false, loading: () => <OrdersSkeleton /> },
);

function OrdersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default function ClientOrdersPage() {
  return <OrdersClient />;
}
