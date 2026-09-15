import type { InventoryMovement } from "@/modules/inventory/models/inventory.model";

// These movements are historical records. Their resulting stock is already
// represented by initialConsumables and must not be applied again on startup.
export const initialInventoryMovements: InventoryMovement[] = [
  {
    id: "movement-purchase-002-consumable-001",
    consumableId: "consumable-001",
    type: "purchase_receipt",
    quantity: 8,
    previousStock: 10,
    newStock: 18,
    occurredAt: "2026-09-09T15:30:00.000Z",
    reference: "COM-2026-002",
    description: "Recepción de compra COM-2026-002",
  },
  {
    id: "movement-purchase-002-consumable-004",
    consumableId: "consumable-004",
    type: "purchase_receipt",
    quantity: 5,
    previousStock: 2,
    newStock: 7,
    occurredAt: "2026-09-09T15:30:00.000Z",
    reference: "COM-2026-002",
    description: "Recepción de compra COM-2026-002",
  },
  {
    id: "movement-purchase-000-consumable-002",
    consumableId: "consumable-002",
    type: "purchase_receipt",
    quantity: 4,
    previousStock: 0,
    newStock: 4,
    occurredAt: "2026-08-28T14:15:00.000Z",
    reference: "COM-2026-000",
    description: "Recepción de compra COM-2026-000",
  },
  {
    id: "movement-purchase-000-consumable-003",
    consumableId: "consumable-003",
    type: "purchase_receipt",
    quantity: 6,
    previousStock: 3,
    newStock: 9,
    occurredAt: "2026-08-28T14:15:00.000Z",
    reference: "COM-2026-000",
    description: "Recepción de compra COM-2026-000",
  },
];
