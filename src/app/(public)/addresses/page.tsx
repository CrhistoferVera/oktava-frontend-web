'use client';

import dynamic from 'next/dynamic';

const AddressesClient = dynamic(
  () => import('@/components/client/addresses/addresses-client'),
  { ssr: false, loading: () => <AddressesSkeleton /> },
);

function AddressesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 rounded-xl bg-white/5 animate-pulse" />
      <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
    </div>
  );
}

export default function AddressesPage() {
  return <AddressesClient />;
}
