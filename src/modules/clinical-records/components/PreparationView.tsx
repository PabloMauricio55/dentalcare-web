'use client';

import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function PreparationView() {
  const { patient, sections, updateSection, saveSection } = useClinicalRecord();
  const { data, feedback } = sections.preparacion;

  return (
    <>
      <PageHeader title="Preparación" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="preparation-patient-title">
        <div className="card-heading"><div><h3 id="preparation-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          saveSection('preparacion');
        }}
      >
        <div className="card-heading"><div><h3>Checklist pre-atención</h3><p>Confirma las condiciones previas a la atención clínica.</p></div></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="consent-signed">Consentimiento firmado</label><select id="consent-signed" value={data.consentSigned ? 'yes' : 'no'} onChange={(event) => updateSection('preparacion', { consentSigned: event.target.value === 'yes' })}><option value="no">No</option><option value="yes">Sí</option></select></div>
          <div className="field"><label htmlFor="instruments-verified">Instrumental verificado</label><select id="instruments-verified" value={data.instrumentsVerified ? 'yes' : 'no'} onChange={(event) => updateSection('preparacion', { instrumentsVerified: event.target.value === 'yes' })}><option value="no">No</option><option value="yes">Sí</option></select></div>
          <div className="field full"><label htmlFor="preparation-notes">Notas de preparación</label><textarea id="preparation-notes" value={data.notes} onChange={(event) => updateSection('preparacion', { notes: event.target.value })} rows={5} required /></div>
        </div>
        <div className="form-submit"><Button type="submit">Guardar preparación</Button></div>
        {feedback && <p role="status" aria-live="polite">{feedback.message}</p>}
      </form>
    </>
  );
}