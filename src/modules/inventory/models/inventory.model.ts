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

export type Supplier = {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  active: boolean;
};

export type PurchaseStatus = "pending" | "received";

export type PurchaseItem = {
  consumableId: string;
  quantity: number;
  unitCost: number;
};

export type Purchase = {
  id: string;
  code: string;
  supplierId: string;
  purchaseDate: string;
  status: PurchaseStatus;
  items: PurchaseItem[];
  receivedAt?: string;
};

export type InventoryMovementType = "purchase_receipt";

export type InventoryMovement = {
  id: string;
  consumableId: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  occurredAt: string;
  reference: string;
  description: string;
};
