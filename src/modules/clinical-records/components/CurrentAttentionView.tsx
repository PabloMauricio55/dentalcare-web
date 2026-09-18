'use client';

import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';

export function CurrentAttentionView() {
  const { patient, attention, feedback, updateAttention, saveAttention } =
    useClinicalRecord();

  return (
    <>
      <PageHeader
        title="Atención actual"
        description={`${patient.fullName} · ${patient.recordNumber}`}
      />

      <section className="card" aria-labelledby="patient-summary-title">
        <div className="card-heading">
          <div>
            <h3 id="patient-summary-title">Paciente seleccionado</h3>
            <p>Información principal del expediente clínico.</p>
          </div>
        </div>
        <div className="info-grid">
          <div>
            <span>Fecha de nacimiento</span>
            <strong>{patient.birthDate}</strong>
          </div>
          <div>
            <span>Alergias</span>
            <strong>{patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Ninguna registrada'}</strong>
          </div>
        </div>
      </section>

      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          saveAttention();
        }}
      >
        <div className="card-heading">
          <div>
            <h3>Registro de atención</h3>
            <p>Documenta el motivo, las notas clínicas y los siguientes pasos.</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="attention-reason">Motivo de atención</label>
            <input
              id="attention-reason"
              value={attention.reason}
              onChange={(event) => updateAttention({ reason: event.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="attention-notes">Notas clínicas</label>
            <textarea
              id="attention-notes"
              value={attention.notes}
              onChange={(event) => updateAttention({ notes: event.target.value })}
              required
              rows={5}
            />
          </div>

          <div className="field">
            <label htmlFor="attention-next-steps">Siguientes pasos</label>
            <textarea
              id="attention-next-steps"
              value={attention.nextSteps}
              onChange={(event) => updateAttention({ nextSteps: event.target.value })}
              rows={5}
            />
          </div>
        </div>

        <div className="form-submit">
          <Button type="submit">Guardar atención</Button>
        </div>
        {feedback && (
          <p role="status" aria-live="polite">
            {feedback.message}
          </p>
        )}
      </form>
    </>
  );
}