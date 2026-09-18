'use client';

import { useState } from 'react';
import { Button, PageHeader } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
import styles from './OdontogramView.module.css';
import type {
  DentitionType,
  ToothStatus,
} from '@/modules/clinical-records/types/clinical-record-session.type';

const dentitionLabels: Record<DentitionType, string> = {
  adult: 'Adulto',
  mixed: 'Mixto',
  child: 'Infantil',
};

const statusLabels: Record<ToothStatus, string> = {
  healthy: 'Sano',
  carious: 'Cariado',
  missing: 'Ausente',
  treated: 'Tratado',
  'to-treat': 'A tratar',
};

const toothStatusClasses: Record<ToothStatus, string> = {
  healthy: styles.toothHealthy,
  carious: styles.toothCarious,
  missing: styles.toothMissing,
  treated: styles.toothTreated,
  'to-treat': styles.toothToTreat,
};

const dentitionOptions: DentitionType[] = ['adult', 'mixed', 'child'];
const statuses: ToothStatus[] = ['healthy', 'carious', 'missing', 'treated', 'to-treat'];
const quadrantOrder = [
  { key: 'upper-right', label: 'Superior derecho', digit: '1' },
  { key: 'upper-left', label: 'Superior izquierdo', digit: '2' },
  { key: 'lower-left', label: 'Inferior izquierdo', digit: '3' },
  { key: 'lower-right', label: 'Inferior derecho', digit: '4' },
] as const;

export function OdontogramView() {
  const { patient, sections, updateSection } = useClinicalRecord();
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const { data } = sections.odontograma;
  const teeth = data.teethByDentition[data.dentition];
  const toothEntries = Object.entries(teeth);

  function changeDentition(dentition: DentitionType) {
    updateSection('odontograma', { dentition });
    setSelectedTooth(null);
  }

  function handleDentitionChange(value: string) {
    const dentition = dentitionOptions.find((option) => option === value);
    if (dentition) changeDentition(dentition);
  }

  function assignStatus(status: ToothStatus) {
    if (!selectedTooth) return;

    updateSection('odontograma', {
      teethByDentition: {
        ...data.teethByDentition,
        [data.dentition]: {
          ...teeth,
          [selectedTooth]: status,
        },
      },
    });
  }

  return (
    <>
      <PageHeader title="Odontograma" description={`${patient.fullName} · ${patient.recordNumber}`} />

      <section className="card" aria-labelledby="odontogram-patient-title">
        <div className="card-heading"><div><h3 id="odontogram-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>

      <section className="card" aria-labelledby="dentition-title">
        <div className="card-heading"><div><h3 id="dentition-title">Tipo de dentición</h3><p>Selecciona la dentición que deseas revisar.</p></div></div>
        <div className="field"><label htmlFor="dentition-select">Mostrar dentición</label><select id="dentition-select" value={data.dentition} onChange={(event) => handleDentitionChange(event.target.value)}>{dentitionOptions.map((dentition) => <option key={dentition} value={dentition}>{dentitionLabels[dentition]}</option>)}</select></div>
      </section>

      <section className="card" aria-labelledby="teeth-title">
        <div className="card-heading"><div><h3 id="teeth-title">Dientes</h3><p>Selecciona una pieza para actualizar su estado.</p></div></div>
        <div className={styles.odontogramGrid}>
          {quadrantOrder.map((quadrant) => (
            <div className={styles.quadrant} key={quadrant.key}>
              <h4 className={styles.quadrantTitle}>{quadrant.label}</h4>
              <div className={styles.quadrantTeeth}>
                {toothEntries.filter(([tooth]) => tooth.startsWith(quadrant.digit)).map(([tooth, status]) => (
                  <button
                    className={`${styles.tooth} ${toothStatusClasses[status]} ${selectedTooth === tooth ? styles.selected : ''}`}
                    key={tooth}
                    type="button"
                    onClick={() => setSelectedTooth(tooth)}
                    aria-pressed={selectedTooth === tooth}
                    title={`${tooth}: ${statusLabels[status]}`}
                  >
                    <strong>{tooth}</strong>
                    <span>{statusLabels[status]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.legend} aria-label="Leyenda de estados dentales">
          {statuses.map((status) => (
            <div className={styles.legendItem} key={status}>
              <span className={`${styles.legendSwatch} ${styles[`legend${status === 'to-treat' ? 'ToTreat' : status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof styles]}`} aria-hidden="true" />
              <span>{statusLabels[status]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="tooth-status-title">
        <div className="card-heading"><div><h3 id="tooth-status-title">{selectedTooth ? `Estado del diente ${selectedTooth}` : 'Selecciona un diente'}</h3><p>Asigna el estado clínico de la pieza seleccionada.</p></div></div>
        <div className={styles.statusActions}>
          {statuses.map((status) => (
            <Button className={styles.statusButton} variant="secondary" key={status} type="button" disabled={!selectedTooth} onClick={() => assignStatus(status)}>
              {statusLabels[status]}
            </Button>
          ))}
        </div>
      </section>
    </>
  );
}