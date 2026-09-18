'use client';

import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function EvolutionView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.evolucion;

  return (
    <>
      <PageHeader title="Consultas y evolución" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="evolution-patient-title">
        <div className="card-heading"><div><h3 id="evolution-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('evolucion');
        }}
      >
        <div className="card-heading"><div><h3>Registro de evolución</h3><p>Documenta la consulta y el procedimiento realizado.</p></div></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="consultation-date">Fecha de consulta</label><input id="consultation-date" type="date" value={data.consultationDate} onChange={(event) => updateSection('evolucion', { consultationDate: event.target.value })} required /></div>
          <div className="field"><label htmlFor="evolution-procedure">Procedimiento realizado</label><input id="evolution-procedure" value={data.procedure} onChange={(event) => updateSection('evolucion', { procedure: event.target.value })} required /></div>
          <div className="field full"><label htmlFor="evolution-note">Nota de evolución</label><textarea id="evolution-note" value={data.note} onChange={(event) => updateSection('evolucion', { note: event.target.value })} rows={6} required /></div>
        </div>
        <div className="form-submit"><Button type="submit">Guardar evolución</Button></div>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </>
  );
}