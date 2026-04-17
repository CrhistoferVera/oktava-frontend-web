"use client";

import dynamic from "next/dynamic";

const CheckoutClient = dynamic(
  () => import("@/components/client/checkout/checkout-client"),
  { ssr: false, loading: () => <CheckoutSkeleton /> },
);

function CheckoutSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-white/5" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="h-48 rounded-2xl bg-white/5" />
          <div className="h-48 rounded-2xl bg-white/5" />
          <div className="h-32 rounded-2xl bg-white/5" />
        </div>
        <div className="h-96 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
