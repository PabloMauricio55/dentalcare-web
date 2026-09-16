'use client';

import { useState } from 'react';
import { ActionNotice, Button, PageHeader, StatusBadge } from '@/shared/components';
import { useSterilization } from '@/modules/sterilization/hooks/useSterilization';
import { validateNewLoad } from '@/modules/sterilization/validation/sterilization.validation';
import type { SterilizationType } from '@/modules/sterilization/types/sterilization.type';

const sterilizationTypes: SterilizationType[] = ['vapor', 'calor seco', 'químico'];

export function NewLoadView() {
  const { instruments, createLoad } = useSterilization();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [type, setType] = useState<SterilizationType>('vapor');
  const [notes, setNotes] = useState('');
  const [notice, setNotice] = useState('');
  const availableInstruments = instruments.filter((instrument) => instrument.status === 'contaminado' || instrument.status === 'pendiente');

  function toggleInstrument(id: string) {
    setSelectedIds((currentIds) => currentIds.includes(id) ? currentIds.filter((currentId) => currentId !== id) : [...currentIds, id]);
  }

  function changeType(value: string) {
    const nextType = sterilizationTypes.find((option) => option === value);
    if (nextType) setType(nextType);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateNewLoad(selectedIds, type, notes);
    if (error) {
      setNotice(error);
      return;
    }
    createLoad(selectedIds, type, notes);
    setSelectedIds([]);
    setNotes('');
    setNotice('La carga se creó correctamente (simulación).');
  }

  return <>
    <PageHeader title="Nueva carga" description="Selecciona instrumental contaminado o pendiente para iniciar una carga simulada." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice('')} />}
    <form className="card" onSubmit={submit}>
      <div className="form-section-title"><div><h3>Instrumentos</h3><p>Seleccionados: {selectedIds.length}</p></div></div>
      <div>{availableInstruments.map((instrument) => <label key={instrument.id}><input type="checkbox" checked={selectedIds.includes(instrument.id)} onChange={() => toggleInstrument(instrument.id)} /> {instrument.name} <StatusBadge status={instrument.status} /></label>)}</div>
      <label htmlFor="sterilization-type">Tipo de esterilización</label>
      <select id="sterilization-type" value={type} onChange={(event) => changeType(event.target.value)}>{sterilizationTypes.map((option) => <option key={option} value={option}>{option}</option>)}</select>
      <label htmlFor="load-notes">Notas</label>
      <textarea id="load-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Describe la carga simulada" />
      <Button type="submit">Crear carga</Button>
    </form>
  </>;
}