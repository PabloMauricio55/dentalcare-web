'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function PreparationView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.preparacion;

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Preparación</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="preparation-patient-title">
        <h2 id="preparation-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('preparacion');
        }}
      >
        <h2>Checklist pre-atención</h2>
        <label htmlFor="consent-signed">Consentimiento firmado</label>
        <select
          id="consent-signed"
          value={data.consentSigned ? 'yes' : 'no'}
          onChange={(event) => updateSection('preparacion', { consentSigned: event.target.value === 'yes' })}
        >
          <option value="no">No</option>
          <option value="yes">Sí</option>
        </select>

        <label htmlFor="instruments-verified">Instrumental verificado</label>
        <select
          id="instruments-verified"
          value={data.instrumentsVerified ? 'yes' : 'no'}
          onChange={(event) => updateSection('preparacion', { instrumentsVerified: event.target.value === 'yes' })}
        >
          <option value="no">No</option>
          <option value="yes">Sí</option>
        </select>

        <label htmlFor="preparation-notes">Notas de preparación</label>
        <textarea
          id="preparation-notes"
          value={data.notes}
          onChange={(event) => updateSection('preparacion', { notes: event.target.value })}
          rows={5}
          required
        />

        <button type="submit">Guardar preparación</button>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </main>
  );
}