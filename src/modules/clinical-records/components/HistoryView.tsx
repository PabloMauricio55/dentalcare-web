'use client';

import { PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function HistoryView() {
  const { patient, sections } = useClinicalRecord();

  return (
    <>
      <PageHeader title="Historial y trazabilidad" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="history-patient-title">
        <div className="card-heading"><div><h3 id="history-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <section className="card" aria-labelledby="history-events-title">
        <div className="card-heading"><div><h3 id="history-events-title">Eventos del expediente</h3><p>Registro cronológico de las acciones realizadas.</p></div></div>
        <div className="timeline">
          {sections.historial.data.entries.map((entry) => (
            <article className="timeline-item" key={entry.id}>
              <time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleDateString('es-MX')}</time>
              <div className="timeline-line"><i /></div>
              <div className="appointment-card">
                <div><strong>{entry.action}</strong><small>Registrado por {entry.author}</small></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}