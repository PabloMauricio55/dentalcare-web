'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function DiagnosesView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.diagnosticos;

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Diagnósticos</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="diagnoses-patient-title">
        <h2 id="diagnoses-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('diagnosticos');
        }}
      >
        <h2>Registro de diagnósticos</h2>
        <label htmlFor="primary-diagnosis">Diagnóstico principal</label>
        <input
          id="primary-diagnosis"
          value={data.primary}
          onChange={(event) => updateSection('diagnosticos', { primary: event.target.value })}
          required
        />

        <label htmlFor="secondary-diagnosis">Diagnósticos secundarios</label>
        <textarea
          id="secondary-diagnosis"
          value={data.secondary}
          onChange={(event) => updateSection('diagnosticos', { secondary: event.target.value })}
          rows={3}
        />

        <label htmlFor="treatment-plan">Plan de tratamiento sugerido</label>
        <textarea
          id="treatment-plan"
          value={data.treatmentPlan}
          onChange={(event) => updateSection('diagnosticos', { treatmentPlan: event.target.value })}
          rows={5}
          required
        />

        <button type="submit">Guardar diagnósticos</button>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </main>
  );
}