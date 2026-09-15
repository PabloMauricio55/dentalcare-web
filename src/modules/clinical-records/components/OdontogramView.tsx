'use client';

import { useState } from 'react';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
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

const statusColors: Record<ToothStatus, string> = {
  healthy: '#d9f7e6',
  carious: '#ffd9d5',
  missing: '#e7e7e7',
  treated: '#dce8ff',
  'to-treat': '#fff0c2',
};

const dentitionOptions: DentitionType[] = ['adult', 'mixed', 'child'];
const statuses: ToothStatus[] = ['healthy', 'carious', 'missing', 'treated', 'to-treat'];

export function OdontogramView() {
  const { patient, sections, updateSection } = useClinicalRecord();
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const { data } = sections.odontograma;
  const teeth = data.teethByDentition[data.dentition];

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
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Odontograma</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="odontogram-patient-title">
        <h2 id="odontogram-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <section aria-labelledby="dentition-title">
        <h2 id="dentition-title">Tipo de dentición</h2>
        <label htmlFor="dentition-select">Mostrar dentición</label>
        <select
          id="dentition-select"
          value={data.dentition}
          onChange={(event) => handleDentitionChange(event.target.value)}
        >
          {dentitionOptions.map((dentition) => (
            <option key={dentition} value={dentition}>{dentitionLabels[dentition]}</option>
          ))}
        </select>
      </section>

      <section aria-labelledby="teeth-title">
        <h2 id="teeth-title">Dientes</h2>
        <div className="odontogram-grid">
          {Object.entries(teeth).map(([tooth, status]) => (
            <button
              className={`tooth tooth-${status} ${selectedTooth === tooth ? 'selected' : ''}`}
              key={tooth}
              type="button"
              onClick={() => setSelectedTooth(tooth)}
              aria-pressed={selectedTooth === tooth}
              title={`${tooth}: ${statusLabels[status]}`}
              style={{ backgroundColor: statusColors[status] }}
            >
              <strong>{tooth}</strong>
              <span>{statusLabels[status]}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="tooth-status-title">
        <h2 id="tooth-status-title">
          {selectedTooth ? `Estado del diente ${selectedTooth}` : 'Selecciona un diente'}
        </h2>
        <div>
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              disabled={!selectedTooth}
              onClick={() => assignStatus(status)}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}