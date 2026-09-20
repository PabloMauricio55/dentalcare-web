'use client';

import { Check, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
import type { DentitionType, ToothStatus } from '@/modules/clinical-records/types/clinical-record-session.type';
import styles from './clinical-odontogram.module.css';
import colors from './odontogram-colors.module.css';

const dentitions: { value: DentitionType; label: string; count: number }[] = [
  { value: 'adult', label: 'Adulto', count: 32 },
  { value: 'mixed', label: 'Mixta', count: 24 },
  { value: 'child', label: 'Infantil', count: 20 },
];
const surfaces = ['Vestibular', 'Palatina', 'Mesial', 'Distal', 'Oclusal'];
const findings: { label: string; status: ToothStatus }[] = [
  { label: 'Sin hallazgos', status: 'healthy' },
  { label: 'Caries', status: 'carious' },
  { label: 'Restauración', status: 'treated' },
  { label: 'Pieza ausente', status: 'missing' },
  { label: 'Evaluar', status: 'to-treat' },
];

function ToothShape({ status }: { status: ToothStatus }) {
  const colorClass = status === 'to-treat' ? colors.toTreat : colors[status];
  return <svg className={styles.toothSvg} viewBox="0 0 44 58" aria-hidden="true">
    <path className={colorClass} d="M8 5C13 1 18 5 22 5s9-4 14 0c7 6 3 19 1 28-2 10-4 20-9 20-4 0-3-15-6-15s-2 15-6 15c-5 0-7-10-9-20C5 24 1 11 8 5Z" />
    <path className={styles.toothLine} d="M22 6v25M10 18c7 4 17 4 24 0" />
  </svg>;
}

function orderedRows(teeth: Record<string, ToothStatus>) {
  const entries = Object.entries(teeth);
  const take = (...prefixes: string[]) => entries.filter(([id]) => prefixes.includes(id[0]));
  return {
    upper: [...take('1', '5').sort((a, b) => Number(b[0]) - Number(a[0])), ...take('2', '6').sort((a, b) => Number(a[0]) - Number(b[0]))],
    lower: [...take('4', '8').sort((a, b) => Number(b[0]) - Number(a[0])), ...take('3', '7').sort((a, b) => Number(a[0]) - Number(b[0]))],
  };
}

function ToothRow({ title, items, selectedTooth, onSelect }: { title: string; items: [string, ToothStatus][]; selectedTooth: string | null; onSelect: (id: string, status: ToothStatus) => void }) {
  return <section className={styles.arch}>
    <h3>{title}</h3>
    <div className={styles.toothRow}>{items.map(([id, status]) => <button type="button" key={id} className={`${styles.toothButton} ${selectedTooth === id ? styles.selected : ''}`} onClick={() => onSelect(id, status)} aria-label={`Pieza ${id}`}>
      <ToothShape status={status} /><span>{id}</span>
    </button>)}</div>
  </section>;
}

export function ClinicalOdontogramView() {
  const { patient, sections, updateSection } = useClinicalRecord();
  const { data } = sections.odontograma;
  const teeth = data.teethByDentition[data.dentition];
  const rows = useMemo(() => orderedRows(teeth), [teeth]);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(Object.keys(teeth).find((id) => teeth[id] !== 'healthy') ?? Object.keys(teeth)[0] ?? null);
  const [surface, setSurface] = useState('Oclusal');
  const selectedStatus = selectedTooth ? teeth[selectedTooth] : 'healthy';
  const [finding, setFinding] = useState<ToothStatus>(selectedStatus);
  const [observation, setObservation] = useState('');
  const [notice, setNotice] = useState('');

  function changeDentition(value: DentitionType) {
    updateSection('odontograma', { dentition: value });
    const next = Object.keys(data.teethByDentition[value])[0] ?? null;
    setSelectedTooth(next);
    setFinding(next ? data.teethByDentition[value][next] : 'healthy');
  }
  function selectTooth(id: string, status: ToothStatus) { setSelectedTooth(id); setFinding(status); setNotice(''); }
  function applyFinding() {
    if (!selectedTooth) return;
    updateSection('odontograma', { teethByDentition: { ...data.teethByDentition, [data.dentition]: { ...teeth, [selectedTooth]: finding } } });
    setNotice(`Hallazgo aplicado a la pieza ${selectedTooth} en superficie ${surface}.`);
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><h1>Odontograma</h1><p>Selecciona una pieza para registrar superficies y hallazgos.</p></div>
      <div className={styles.actions}><div className={styles.dentitions}>{dentitions.map((item) => <button type="button" key={item.value} className={data.dentition === item.value ? styles.active : ''} onClick={() => changeDentition(item.value)}>{item.label} · {item.count}</button>)}</div><button type="button" className={styles.save} onClick={() => setNotice('Odontograma guardado localmente durante esta sesión.')}><Check size={17}/>Guardar</button></div>
    </header>
    <div className={styles.patient}><strong>{patient.fullName}</strong><span>{patient.recordNumber} · Nacimiento {patient.birthDate}</span>{patient.allergies.length > 0 && <b>Alergia: {patient.allergies.join(', ')}</b>}</div>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    <div className={styles.layout}>
      <section className={styles.chart}>
        <div className={styles.legend}><span className={styles.cariousDot}>Caries</span><span className={styles.treatedDot}>Restauración</span><span className={styles.toTreatDot}>Evaluar</span></div>
        <ToothRow title="Arcada superior" items={rows.upper} selectedTooth={selectedTooth} onSelect={selectTooth} />
        <div className={styles.axis}><span>Derecha</span><span>Izquierda</span></div>
        <ToothRow title="Arcada inferior" items={rows.lower} selectedTooth={selectedTooth} onSelect={selectTooth} />
      </section>
      <aside className={styles.detail}>
        <h2>{selectedTooth ? `Pieza ${selectedTooth}` : 'Selecciona una pieza'}</h2>
        {selectedTooth && <><div className={styles.summary}><ToothShape status={finding}/><div><b>{findings.find((item) => item.status === finding)?.label}</b><p>{observation || 'Registra el hallazgo y una observación clínica.'}</p></div></div>
        <h3>Superficies</h3><div className={styles.surfaceGrid}>{surfaces.map((item) => <button type="button" key={item} className={surface === item ? styles.surfaceActive : ''} onClick={() => setSurface(item)}>{item}</button>)}</div>
        <label>Hallazgo<select value={finding} onChange={(event) => setFinding(event.target.value as ToothStatus)}>{findings.map((item) => <option key={item.status} value={item.status}>{item.label}</option>)}</select></label>
        <label>Observación<input value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="Describe el hallazgo clínico" /></label>
        <div className={styles.detailActions}><button type="button" onClick={applyFinding}>Aplicar a pieza {selectedTooth}</button><button type="button" className={styles.secondary} onClick={() => setNotice(`Pieza ${selectedTooth} enviada a diagnóstico.`)}><Send size={15}/>Enviar a diagnóstico</button></div></>}
      </aside>
    </div>
  </main>;
}
