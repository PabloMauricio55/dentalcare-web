export type InstrumentStatus = 'contaminado' | 'pendiente' | 'en proceso' | 'disponible';
export type InstrumentStage = 'uso' | 'contaminado' | 'en carga' | 'esterilizando' | 'disponible';
export type SterilizationType = 'vapor' | 'calor seco' | 'químico';
export type LoadStatus = 'en proceso' | 'liberada';

export type Instrument = {
  id: string;
  name: string;
  status: InstrumentStatus;
  currentStage: InstrumentStage;
  updatedAt: string;
};

export type SterilizationLoad = {
  id: string;
  code: string;
  instrumentIds: string[];
  type: SterilizationType;
  notes: string;
  status: LoadStatus;
  createdAt: string;
};

export type SterilizationData = {
  instruments: Instrument[];
  loads: SterilizationLoad[];
};