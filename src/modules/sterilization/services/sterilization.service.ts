import type { SterilizationData } from '@/modules/sterilization/types/sterilization.type';

export function getMockSterilizationData(): SterilizationData {
  return {
    instruments: [
      { id: 'instrument-001', name: 'Kit de exploración 01', status: 'contaminado', currentStage: 'contaminado', updatedAt: '2026-09-13' },
      { id: 'instrument-002', name: 'Pinza algodonera 02', status: 'pendiente', currentStage: 'uso', updatedAt: '2026-09-13' },
      { id: 'instrument-003', name: 'Espejo bucal 03', status: 'en proceso', currentStage: 'esterilizando', updatedAt: '2026-09-12' },
      { id: 'instrument-004', name: 'Kit de extracción 01', status: 'disponible', currentStage: 'disponible', updatedAt: '2026-09-12' },
      { id: 'instrument-005', name: 'Cureta periodontal 04', status: 'contaminado', currentStage: 'contaminado', updatedAt: '2026-09-13' },
    ],
    loads: [
      {
        id: 'load-001',
        code: 'CARGA-2026-001',
        instrumentIds: ['instrument-003'],
        type: 'vapor',
        notes: 'Ciclo estándar de instrumental clínico.',
        status: 'en proceso',
        createdAt: '2026-09-12',
      },
      {
        id: 'load-002',
        code: 'CARGA-2026-002',
        instrumentIds: ['instrument-004'],
        type: 'calor seco',
        notes: 'Carga liberada después de control simulado.',
        status: 'liberada',
        createdAt: '2026-09-11',
      },
    ],
  };
}