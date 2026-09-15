'use client';

import { useState, type ReactNode } from 'react';
import { SterilizationContext } from '@/modules/sterilization/hooks/useSterilization';
import { getMockSterilizationData } from '@/modules/sterilization/services/sterilization.service';
import type { SterilizationData, SterilizationType } from '@/modules/sterilization/types/sterilization.type';

export function SterilizationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SterilizationData>(getMockSterilizationData);

  function createLoad(instrumentIds: string[], type: SterilizationType, notes: string) {
    const load: SterilizationData['loads'][number] = {
      id: `load-${Date.now()}`,
      code: `CARGA-2026-${String(data.loads.length + 1).padStart(3, '0')}`,
      instrumentIds,
      type,
      notes,
      status: 'en proceso',
      createdAt: '2026-09-13',
    };

    setData((currentData) => ({
      instruments: currentData.instruments.map((instrument) => instrumentIds.includes(instrument.id)
        ? { ...instrument, status: 'en proceso', currentStage: 'en carga', updatedAt: '2026-09-13' }
        : instrument),
      loads: [load, ...currentData.loads],
    }));
  }

  return <SterilizationContext.Provider value={{ ...data, createLoad }}>{children}</SterilizationContext.Provider>;
}