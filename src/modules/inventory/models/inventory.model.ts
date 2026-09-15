export type ConsumableStatus = "active" | "inactive";

export type Consumable = {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  expirationDate?: string;
  status: ConsumableStatus;
};

export type ExpirationState = "expired" | "expiring-soon" | "current" | "not-applicable";

export type InventoryInstrument = {
  id: string;
  code: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  active: boolean;
};
