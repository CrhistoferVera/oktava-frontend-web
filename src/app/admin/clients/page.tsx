'use client';

import { useMemo, useState } from 'react';
import { ClientsHeader } from '@/components/admin/clients/header';
import { ClientsMetrics } from '@/components/admin/clients/metrics';
import { ClientsSegmentSummary } from '@/components/admin/clients/segment-summary';
import { ClientsSearch } from '@/components/admin/clients/search';
import { ClientsGrid } from '@/components/admin/clients/clients-grid';
import { mockClients } from '@/components/admin/clients/mock-clients';
import { Client } from '@/types/client.types';

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (normalized === '') return clients;

    return clients.filter(
      (client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(normalized) ||
        client.email.toLowerCase().includes(normalized) ||
        client.phone.toLowerCase().includes(normalized),
    );
  }, [clients, searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <ClientsHeader />
      <ClientsMetrics clients={clients} />
      <ClientsSegmentSummary clients={clients} />
      <ClientsSearch value={searchTerm} onChange={setSearchTerm} />
      <ClientsGrid clients={filteredClients} />
    </div>
  );
}
