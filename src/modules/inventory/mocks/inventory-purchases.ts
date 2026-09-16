import type { Purchase } from "@/modules/inventory/models/inventory.model";

export const initialPurchases: Purchase[] = [
  {
    id: "purchase-001",
    code: "COM-2026-001",
    supplierId: "supplier-001",
    purchaseDate: "2026-09-12",
    status: "pending",
    items: [
      { consumableId: "consumable-002", quantity: 10, unitCost: 18.5 },
      { consumableId: "consumable-003", quantity: 4, unitCost: 95 },
    ],
  },
  {
    id: "purchase-002",
    code: "COM-2026-002",
    supplierId: "supplier-002",
    purchaseDate: "2026-09-08",
    status: "received",
    receivedAt: "2026-09-09T15:30:00.000Z",
    items: [
      { consumableId: "consumable-001", quantity: 8, unitCost: 62 },
      { consumableId: "consumable-004", quantity: 5, unitCost: 140 },
    ],
  },
];
