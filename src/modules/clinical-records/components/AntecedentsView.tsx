'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function AntecedentsView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.antecedentes;

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Antecedentes</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="antecedents-patient-title">
        <h2 id="antecedents-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('antecedentes');
        }}
      >
        <h2>Anamnesis básica</h2>
        <label htmlFor="known-allergies">Alergias conocidas</label>
        <textarea
          id="known-allergies"
          value={data.allergies}
          onChange={(event) => updateSection('antecedentes', { allergies: event.target.value })}
          rows={3}
          required
        />

        <label htmlFor="systemic-diseases">Enfermedades sistémicas relevantes</label>
        <textarea
          id="systemic-diseases"
          value={data.systemicDiseases}
          onChange={(event) => updateSection('antecedentes', { systemicDiseases: event.target.value })}
          rows={3}
          required
        />

        <label htmlFor="current-medication">Medicación actual</label>
        <textarea
          id="current-medication"
          value={data.currentMedication}
          onChange={(event) => updateSection('antecedentes', { currentMedication: event.target.value })}
          rows={3}
          required
        />

        <label htmlFor="relevant-habits">Hábitos relevantes</label>
        <input
          id="relevant-habits"
          value={data.relevantHabits}
          onChange={(event) => updateSection('antecedentes', { relevantHabits: event.target.value })}
          required
        />

        <button type="submit">Guardar antecedentes</button>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </main>
  );
}