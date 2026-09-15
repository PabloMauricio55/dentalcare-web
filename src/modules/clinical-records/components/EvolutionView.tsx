'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function EvolutionView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.evolucion;

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Consultas y evolución</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="evolution-patient-title">
        <h2 id="evolution-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('evolucion');
        }}
      >
        <h2>Registro de evolución</h2>
        <label htmlFor="consultation-date">Fecha de consulta</label>
        <input
          id="consultation-date"
          type="date"
          value={data.consultationDate}
          onChange={(event) => updateSection('evolucion', { consultationDate: event.target.value })}
          required
        />

        <label htmlFor="evolution-procedure">Procedimiento realizado</label>
        <input
          id="evolution-procedure"
          value={data.procedure}
          onChange={(event) => updateSection('evolucion', { procedure: event.target.value })}
          required
        />

        <label htmlFor="evolution-note">Nota de evolución</label>
        <textarea
          id="evolution-note"
          value={data.note}
          onChange={(event) => updateSection('evolucion', { note: event.target.value })}
          rows={6}
          required
        />

        <button type="submit">Guardar evolución</button>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </main>
  );
}