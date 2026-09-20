'use client';

import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
import styles from './clinical-records.module.css';

const attentionReasons = [
  'Evaluación odontológica de rutina',
  'Evaluación inicial para ortodoncia',
  'Control de tratamiento de ortodoncia',
  'Dolor dental agudo',
  'Caries dental y restauración',
  'Limpieza dental y profilaxis',
  'Revisión periodontal',
  'Tratamiento de conductos',
  'Extracción dental',
  'Consulta por sensibilidad dental',
  'Revisión de prótesis dental',
  'Urgencia odontológica',
];

export function CurrentAttentionView() {
  const { patient, attention, feedback, updateAttention, saveAttention } =
    useClinicalRecord();

  return (
    <main className={styles.page}>
      <header>
        <p>Expediente clínico</p>
        <h1>Atención actual</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="patient-summary-title">
        <h2 id="patient-summary-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
        <p>
          Alergias:{' '}
          {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Ninguna registrada'}
        </p>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          saveAttention();
        }}
      >
        <h2>Registro de atención</h2>
        <label htmlFor="attention-reason">Motivo de atención</label>
        <select
          id="attention-reason"
          value={attention.reason}
          onChange={(event) => updateAttention({ reason: event.target.value })}
          required
        >
          <option value="" disabled>Selecciona un motivo de atención</option>
          {attentionReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
        </select>

        <label htmlFor="attention-notes">Notas clínicas</label>
        <textarea
          id="attention-notes"
          value={attention.notes}
          onChange={(event) => updateAttention({ notes: event.target.value })}
          required
          rows={5}
        />

        <label htmlFor="attention-next-steps">Siguientes pasos</label>
        <textarea
          id="attention-next-steps"
          value={attention.nextSteps}
          onChange={(event) => updateAttention({ nextSteps: event.target.value })}
          rows={3}
        />

        <button type="submit">Guardar atención</button>
        {feedback && (
          <p role="status" aria-live="polite">
            {feedback.message}
          </p>
        )}
      </form>
    </main>
  );
}
