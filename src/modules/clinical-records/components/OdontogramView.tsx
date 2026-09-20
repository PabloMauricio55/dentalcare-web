'use client';

import { CheckCircle2, CircleAlert, CircleDashed, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
import type { DentitionType, ToothStatus } from '@/modules/clinical-records/types/clinical-record-session.type';
import styles from './odontogram.module.css';

const dentitionLabels: Record<DentitionType, string> = { adult: 'Adulto', mixed: 'Mixto', child: 'Infantil' };
const statusLabels: Record<ToothStatus, string> = { healthy: 'Sano', carious: 'Cariado', missing: 'Ausente', treated: 'Tratado', 'to-treat': 'A tratar' };
const statusDescriptions: Record<ToothStatus, string> = { healthy: 'Sin hallazgos', carious: 'Requiere valoración', missing: 'Pieza ausente', treated: 'Tratamiento registrado', 'to-treat': 'Pendiente de tratar' };
const statusIcons: Record<ToothStatus, typeof CheckCircle2> = { healthy: CheckCircle2, carious: CircleAlert, missing: CircleDashed, treated: Stethoscope, 'to-treat': CircleAlert };
const dentitionOptions: DentitionType[] = ['adult', 'mixed', 'child'];
const statuses: ToothStatus[] = ['healthy', 'carious', 'missing', 'treated', 'to-treat'];

function toothGroups(teeth: Record<string, ToothStatus>) {
  const groups = [
    { label: 'Superior derecho', position: 'upperRight', teeth: [] as [string, ToothStatus][] },
    { label: 'Superior izquierdo', position: 'upperLeft', teeth: [] as [string, ToothStatus][] },
    { label: 'Inferior derecho', position: 'lowerRight', teeth: [] as [string, ToothStatus][] },
    { label: 'Inferior izquierdo', position: 'lowerLeft', teeth: [] as [string, ToothStatus][] },
  ];
  Object.entries(teeth).forEach(([tooth, status]) => {
    const quadrant = Number(tooth.charAt(0));
    const index = quadrant === 1 || quadrant === 5 ? 0 : quadrant === 2 || quadrant === 6 ? 1 : quadrant === 4 || quadrant === 8 ? 2 : 3;
    groups[index].teeth.push([tooth, status]);
  });
  groups.forEach((group) => group.teeth.sort(([a], [b]) => Number(a) - Number(b)));
  return groups;
}

function statusClass(status: ToothStatus) {
  return `status${status.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())}`;
}

export function OdontogramView() {
  const { patient, sections, updateSection } = useClinicalRecord();
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const { data } = sections.odontograma;
  const teeth = data.teethByDentition[data.dentition];
  const selectedStatus = selectedTooth ? teeth[selectedTooth] : null;

  function changeDentition(dentition: DentitionType) {
    updateSection('odontograma', { dentition });
    setSelectedTooth(null);
  }

  function assignStatus(status: ToothStatus) {
    if (!selectedTooth) return;
    updateSection('odontograma', { teethByDentition: { ...data.teethByDentition, [data.dentition]: { ...teeth, [selectedTooth]: status } } });
  }

  return <main className={styles.page}>
    <header className={styles.pageHeader}>
      <div><p>Expediente clínico</p><h1>Odontograma</h1><span>{patient.fullName} · {patient.recordNumber}</span></div>
      <div className={styles.patientBadge}><Stethoscope size={20} /><div><small>Paciente seleccionado</small><strong>{patient.fullName}</strong><span>Nacimiento: {patient.birthDate}</span></div></div>
    </header>

    <section className={styles.workspace}>
      <div className={styles.toolbar}>
        <div><span className={styles.eyebrow}>Tipo de dentición</span><h2>Mapa dental</h2></div>
        <label className={styles.dentitionSelect}><span>Mostrar</span><select value={data.dentition} onChange={(event) => changeDentition(event.target.value as DentitionType)}>{dentitionOptions.map((type) => <option key={type} value={type}>{dentitionLabels[type]}</option>)}</select></label>
      </div>
      <p className={styles.help}>Selecciona una pieza para consultar o actualizar su estado clínico simulado.</p>

      <div className={styles.chart} aria-label="Mapa de dientes por cuadrantes">
        {toothGroups(teeth).map((group) => <section className={`${styles.quadrant} ${styles[group.position]}`} key={group.position} aria-label={group.label}>
          <span className={styles.quadrantLabel}>{group.label}</span>
          <div className={styles.teethRow}>{group.teeth.map(([tooth, status]) => {
            const Icon = statusIcons[status];
            return <button className={`${styles.tooth} ${styles[statusClass(status)]} ${selectedTooth === tooth ? styles.selected : ''}`} key={tooth} type="button" onClick={() => setSelectedTooth(tooth)} aria-pressed={selectedTooth === tooth} aria-label={`Diente ${tooth}, ${statusLabels[status]}`}>
              <span className={styles.toothNumber}>{tooth}</span><Icon size={15} aria-hidden="true" /><span className={styles.toothStatus}>{statusLabels[status]}</span>
            </button>;
          })}</div>
        </section>)}
      </div>
    </section>

    <section className={styles.bottomGrid}>
      <section className={styles.legend} aria-label="Leyenda de estados"><h2>Leyenda clínica</h2><div>{statuses.map((status) => { const Icon = statusIcons[status]; return <span className={`${styles.legendItem} ${styles[statusClass(status)]}`} key={status}><Icon size={15} /><b>{statusLabels[status]}</b><small>{statusDescriptions[status]}</small></span>; })}</div></section>
      <section className={styles.editor} aria-live="polite"><div><span className={styles.eyebrow}>Pieza seleccionada</span><h2>{selectedTooth ? `Diente ${selectedTooth}` : 'Selecciona un diente'}</h2><p>{selectedStatus ? `${statusLabels[selectedStatus]} · ${statusDescriptions[selectedStatus]}` : 'Elige una pieza en el mapa para editar su estado.'}</p></div><div className={styles.statusActions}>{statuses.map((status) => <button className={`${styles.statusButton} ${styles[statusClass(status)]}`} key={status} type="button" disabled={!selectedTooth} onClick={() => assignStatus(status)}>{statusLabels[status]}</button>)}</div></section>
    </section>
  </main>;
}
