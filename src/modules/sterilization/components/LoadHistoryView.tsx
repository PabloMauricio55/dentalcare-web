'use client';

import { useState } from 'react';
import { DataTable, Modal, PageHeader, StatusBadge, type Column, Button } from '@/shared/components';
import { useSterilization } from '@/modules/sterilization/hooks/useSterilization';
import type { SterilizationLoad } from '@/modules/sterilization/types/sterilization.type';

export function LoadHistoryView() {
  const { loads, instruments } = useSterilization();
  const [selectedLoad, setSelectedLoad] = useState<SterilizationLoad | null>(null);
  const columns: Column<SterilizationLoad>[] = [
    { key: 'code', header: 'Carga', cell: (row) => row.code },
    { key: 'type', header: 'Método', cell: (row) => row.type },
    { key: 'status', header: 'Estado', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', header: 'Fecha', cell: (row) => row.createdAt },
    { key: 'detail', header: 'Detalle', cell: (row) => <Button variant="ghost" onClick={() => setSelectedLoad(row)}>Abrir</Button> },
  ];
  const selectedInstrumentNames = selectedLoad?.instrumentIds.map((id) => instruments.find((instrument) => instrument.id === id)?.name ?? id) ?? [];

  return <>
    <PageHeader title="Historial de cargas" description="Consulta las cargas simuladas y abre el detalle de cada una." />
    <section className="card"><DataTable columns={columns} rows={loads} /></section>
    <Modal open={Boolean(selectedLoad)} title={selectedLoad?.code ?? 'Detalle de carga'} description="Información simulada de la carga" onClose={() => setSelectedLoad(null)}>
      {selectedLoad && <div><p><strong>Instrumentos:</strong> {selectedInstrumentNames.join(', ')}</p><p><strong>Método:</strong> {selectedLoad.type}</p><p><strong>Notas:</strong> {selectedLoad.notes}</p><p><strong>Estado:</strong> {selectedLoad.status}</p></div>}
    </Modal>
  </>;
}