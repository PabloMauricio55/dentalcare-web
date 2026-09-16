'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function HistoryView() {
  const { patient, sections } = useClinicalRecord();

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Historial y trazabilidad</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="history-patient-title">
        <h2 id="history-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <section aria-labelledby="history-events-title">
        <h2 id="history-events-title">Eventos del expediente</h2>
        <ol>
          {sections.historial.data.entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.action}</strong>
              <span> · {new Date(entry.timestamp).toLocaleDateString('es-MX')}</span>
              <p>Registrado por {entry.author}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}