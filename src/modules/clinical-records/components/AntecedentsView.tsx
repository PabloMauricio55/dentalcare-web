'use client';

import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function AntecedentsView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.antecedentes;

  return (
    <>
      <PageHeader title="Antecedentes" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="antecedents-patient-title">
        <div className="card-heading"><div><h3 id="antecedents-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('antecedentes');
        }}
      >
        <div className="card-heading"><div><h3>Anamnesis básica</h3><p>Registra los antecedentes relevantes del paciente.</p></div></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="known-allergies">Alergias conocidas</label><textarea id="known-allergies" value={data.allergies} onChange={(event) => updateSection('antecedentes', { allergies: event.target.value })} rows={3} required /></div>
          <div className="field"><label htmlFor="systemic-diseases">Enfermedades sistémicas relevantes</label><textarea id="systemic-diseases" value={data.systemicDiseases} onChange={(event) => updateSection('antecedentes', { systemicDiseases: event.target.value })} rows={3} required /></div>
          <div className="field"><label htmlFor="current-medication">Medicación actual</label><textarea id="current-medication" value={data.currentMedication} onChange={(event) => updateSection('antecedentes', { currentMedication: event.target.value })} rows={3} required /></div>
          <div className="field"><label htmlFor="relevant-habits">Hábitos relevantes</label><input id="relevant-habits" value={data.relevantHabits} onChange={(event) => updateSection('antecedentes', { relevantHabits: event.target.value })} required /></div>
        </div>
        <div className="form-submit"><Button type="submit">Guardar antecedentes</Button></div>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </>
  );
}