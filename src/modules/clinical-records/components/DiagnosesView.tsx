'use client';

import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function DiagnosesView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.diagnosticos;

  return (
    <>
      <PageHeader title="Diagnósticos" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="diagnoses-patient-title">
        <div className="card-heading"><div><h3 id="diagnoses-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('diagnosticos');
        }}
      >
        <div className="card-heading"><div><h3>Registro de diagnósticos</h3><p>Organiza los hallazgos y el plan de tratamiento sugerido.</p></div></div>
        <div className="form-grid">
          <div className="field full"><label htmlFor="primary-diagnosis">Diagnóstico principal</label><input id="primary-diagnosis" value={data.primary} onChange={(event) => updateSection('diagnosticos', { primary: event.target.value })} required /></div>
          <div className="field"><label htmlFor="secondary-diagnosis">Diagnósticos secundarios</label><textarea id="secondary-diagnosis" value={data.secondary} onChange={(event) => updateSection('diagnosticos', { secondary: event.target.value })} rows={3} /></div>
          <div className="field"><label htmlFor="treatment-plan">Plan de tratamiento sugerido</label><textarea id="treatment-plan" value={data.treatmentPlan} onChange={(event) => updateSection('diagnosticos', { treatmentPlan: event.target.value })} rows={5} required /></div>
        </div>
        <div className="form-submit"><Button type="submit">Guardar diagnósticos</Button></div>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </>
  );
}