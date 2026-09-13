'use client';

import { useState } from 'react';
import { PageHeader, StatusBadge } from '@/shared/components';
import { useSterilization } from '@/modules/sterilization/hooks/useSterilization';
import type { InstrumentStage } from '@/modules/sterilization/types/sterilization.type';

const stages: InstrumentStage[] = ['uso', 'contaminado', 'en carga', 'esterilizando', 'disponible'];

export function TraceabilityView() {
  const { instruments } = useSterilization();
  const [selectedId, setSelectedId] = useState(instruments[0]?.id ?? '');
  const selectedInstrument = instruments.find((instrument) => instrument.id === selectedId) ?? instruments[0];
  const currentIndex = selectedInstrument ? stages.indexOf(selectedInstrument.currentStage) : -1;

  return <>
    <PageHeader title="Trazabilidad instrumental" description="Recorrido simulado desde el uso hasta la disponibilidad." />
    <section className="card">
      <label htmlFor="traceability-instrument">Instrumento</label>
      <select id="traceability-instrument" value={selectedInstrument?.id ?? ''} onChange={(event) => setSelectedId(event.target.value)}>
        {instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}
      </select>
      {selectedInstrument && <p>Estado actual: <StatusBadge status={selectedInstrument.status} /></p>}
    </section>
    <section className="card" aria-labelledby="traceability-stages-title">
      <h3 id="traceability-stages-title">Etapas del recorrido</h3>
      <ol>
        {stages.map((stage, index) => {
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          return <li className={isCurrent ? 'is-current' : isPast ? 'is-complete' : 'is-pending'} key={stage}>
            <strong>{stage}</strong>
            <StatusBadge status={isCurrent ? 'Actual' : isPast ? 'Completada' : 'Pendiente'} />
          </li>;
        })}
      </ol>
    </section>
  </>;
}