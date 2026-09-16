'use client';

import { Activity, AlertTriangle, Clock3 } from 'lucide-react';
import { DataTable, type Column, PageHeader, StatCard, StatusBadge } from '@/shared/components';
import { useSterilization } from '@/modules/sterilization/hooks/useSterilization';
import type { Instrument } from '@/modules/sterilization/types/sterilization.type';

export function SterilizationDashboardView() {
  const { instruments, loads } = useSterilization();
  const columns: Column<Instrument>[] = [
    { key: 'name', header: 'Instrumento', cell: (row) => row.name },
    { key: 'status', header: 'Estado', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'updatedAt', header: 'Actualizado', cell: (row) => row.updatedAt },
  ];
  const contaminated = instruments.filter((instrument) => instrument.status === 'contaminado').length;
  const pending = instruments.filter((instrument) => instrument.status === 'pendiente').length;
  const activeLoads = loads.filter((load) => load.status === 'en proceso').length;

  return <>
    <PageHeader title="Panel de esterilización" description="Control operativo del instrumental y las cargas de la clínica." />
    <div className="stats-grid">
      <StatCard label="Contaminados" value={contaminated} helper="Requieren procesamiento" icon={AlertTriangle} tone="amber" />
      <StatCard label="Pendientes" value={pending} helper="Listos para nueva carga" icon={Clock3} tone="blue" />
      <StatCard label="Cargas activas" value={activeLoads} helper="En proceso" icon={Activity} tone="teal" />
    </div>
    <section className="card"><div className="card-heading"><div><h3>Instrumental</h3><p>Estado actual del inventario de esterilización.</p></div></div><DataTable columns={columns} rows={instruments} /></section>
  </>;
}