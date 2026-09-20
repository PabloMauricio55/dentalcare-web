'use client';

import { useState } from 'react';
import { Button, DataTable, PageHeader, StatusBadge, type Column } from '@/shared/components';
import { useClinicalRecord } from '@/modules/clinical-records/hooks/useClinicalRecord';
import type { ClinicalFile } from '@/modules/clinical-records/types/clinical-record-session.type';

type UploadState = 'idle' | 'loading' | 'success' | 'error';

export function FilesView() {
  const { patient, sections, updateSection } = useClinicalRecord();
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [message, setMessage] = useState('');
  const files = sections.archivos.data.items;

  function simulateUpload() {
    if (!selectedFileName) {
      setUploadState('error');
      setMessage('Selecciona un archivo antes de simular la carga.');
      return;
    }

    setUploadState('loading');
    setMessage('Simulando carga del archivo...');

    window.setTimeout(() => {
      if (selectedFileName.toLowerCase().includes('error')) {
        setUploadState('error');
        setMessage('La carga simulada falló. Intenta con otro archivo.');
        return;
      }

      const newFile: ClinicalFile = {
        id: `file-${Date.now()}`,
        name: selectedFileName,
        type: 'Documento simulado',
        date: '2026-09-13',
        status: 'uploaded',
      };

      updateSection('archivos', { items: [...files, newFile] });
      setUploadState('success');
      setMessage('El archivo se cargó correctamente (simulación).');
      setSelectedFileName('');
    }, 350);
  }

  const columns: Column<ClinicalFile>[] = [
    { key: 'name', header: 'Archivo', cell: (file) => <strong>{file.name}</strong> },
    { key: 'type', header: 'Tipo', cell: (file) => file.type },
    { key: 'date', header: 'Fecha', cell: (file) => file.date },
    { key: 'status', header: 'Estado', cell: (file) => <StatusBadge status={file.status === 'uploaded' ? 'Cargado' : 'Error'} /> },
  ];

  return (
    <>
      <PageHeader title="Archivos" description={`${patient.fullName} · ${patient.recordNumber}`} />
      <section className="card" aria-labelledby="files-patient-title">
        <div className="card-heading"><div><h3 id="files-patient-title">Paciente seleccionado</h3><p>Información principal del expediente clínico.</p></div></div>
        <div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{patient.birthDate}</strong></div></div>
      </section>
      <section className="card" aria-labelledby="files-list-title">
        <div className="card-heading"><div><h3 id="files-list-title">Archivos del expediente</h3><p>Documentos asociados a la atención clínica.</p></div></div>
        <DataTable columns={columns} rows={files} />
      </section>
      <section className="card" aria-labelledby="upload-file-title">
        <div className="card-heading"><div><h3 id="upload-file-title">Simular carga</h3><p>Agrega un archivo ficticio al expediente en memoria.</p></div></div>
        <div className="field">
          <label htmlFor="file-upload">Seleccionar archivo</label>
          <input
            id="file-upload"
            type="file"
            onChange={(event) => {
              setSelectedFileName(event.target.files?.[0]?.name ?? '');
              setUploadState('idle');
              setMessage('');
            }}
          />
        </div>
        <div className="form-submit">
          <Button type="button" onClick={simulateUpload} disabled={uploadState === 'loading'}>
            {uploadState === 'loading' ? 'Cargando...' : 'Simular carga'}
          </Button>
        </div>
        {message && (
          <p className={uploadState === 'error' ? 'form-error' : 'action-notice'} role="status" aria-live="polite">
            {message}
          </p>
        )}
      </section>
    </>
  );
}