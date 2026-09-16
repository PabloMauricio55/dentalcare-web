'use client';

import { createContext, useContext } from 'react';
import type { Instrument, SterilizationLoad, SterilizationType } from '@/modules/sterilization/types/sterilization.type';

export type SterilizationContextValue = {
  instruments: Instrument[];
  loads: SterilizationLoad[];
  createLoad: (instrumentIds: string[], type: SterilizationType, notes: string) => void;
};

export const SterilizationContext = createContext<SterilizationContextValue | undefined>(undefined);

export function useSterilization(): SterilizationContextValue {
  const context = useContext(SterilizationContext);
  if (!context) throw new Error('useSterilization debe utilizarse dentro de SterilizationProvider.');
  return context;
}