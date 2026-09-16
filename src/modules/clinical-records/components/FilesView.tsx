'use client';

import { useState } from 'react';
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

  return (
    <main>
      <header>
        <p>Expediente clínico</p>
        <h1>Archivos</h1>
        <p>{patient.fullName} · {patient.recordNumber}</p>
      </header>

      <section aria-labelledby="files-patient-title">
        <h2 id="files-patient-title">Paciente seleccionado</h2>
        <p>Fecha de nacimiento: {patient.birthDate}</p>
      </section>

      <section aria-labelledby="files-list-title">
        <h2 id="files-list-title">Archivos del expediente</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <strong>{file.name}</strong>
              <span> · {file.type} · {file.date} · {file.status === 'uploaded' ? 'Cargado' : 'Error'}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="upload-file-title">
        <h2 id="upload-file-title">Simular carga</h2>
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
        <button type="button" onClick={simulateUpload} disabled={uploadState === 'loading'}>
          {uploadState === 'loading' ? 'Cargando...' : 'Simular carga'}
        </button>
        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}