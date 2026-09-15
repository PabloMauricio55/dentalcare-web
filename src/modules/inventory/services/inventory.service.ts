import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";
import type { CreatePurchaseDto } from "@/modules/inventory/dtos/create-purchase.dto";
import type { CreateSupplierDto } from "@/modules/inventory/dtos/create-supplier.dto";
import type { Consumable, ExpirationState, InventoryInstrument, InventoryMovement, Purchase, Supplier } from "@/modules/inventory/models/inventory.model";

// A consumable is considered close to expiration during the 30 calendar days before its date.
export const EXPIRATION_WARNING_DAYS = 30;

function parseLocalDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export const inventoryService = {
  createConsumable(dto: CreateConsumableDto): Consumable {
    return {
      ...dto,
      expirationDate: dto.expirationDate || undefined,
      id: `consumable-${Date.now()}`,
      status: "active",
    };
  },

  createInstrument(dto: CreateInstrumentDto): InventoryInstrument {
    return {
      ...dto,
      id: `instrument-${Date.now()}`,
      active: true,
    };
  },

  createSupplier(dto: CreateSupplierDto): Supplier {
    return {
      ...dto,
      id: `supplier-${Date.now()}`,
      active: true,
    };
  },

  createPurchase(dto: CreatePurchaseDto): Purchase {
    return {
      ...dto,
      id: `purchase-${Date.now()}`,
      status: "pending",
    };
  },

  receivePurchase(purchase: Purchase, consumables: Consumable[], occurredAt = new Date().toISOString()) {
    if (purchase.status !== "pending") return null;

    const selectedConsumables = purchase.items.map((item) => (
      consumables.find((consumable) => consumable.id === item.consumableId)
    ));
    if (selectedConsumables.some((consumable) => !consumable || consumable.status !== "active")) return null;

    const quantities = new Map(purchase.items.map((item) => [item.consumableId, item.quantity]));
    const nextConsumables = consumables.map((consumable) => {
      const quantity = quantities.get(consumable.id);
      return quantity === undefined ? consumable : { ...consumable, currentStock: consumable.currentStock + quantity };
    });
    const movements: InventoryMovement[] = purchase.items.map((item, index) => {
      const consumable = selectedConsumables[index];
      if (!consumable) throw new Error("Purchase consumable was validated but is missing");
      return {
        id: `movement-${purchase.id}-${item.consumableId}-${occurredAt}`,
        consumableId: item.consumableId,
        type: "purchase_receipt",
        quantity: item.quantity,
        previousStock: consumable.currentStock,
        newStock: consumable.currentStock + item.quantity,
        occurredAt,
        reference: purchase.code,
        description: `Recepción de compra ${purchase.code}`,
      };
    });

    return {
      purchase: { ...purchase, status: "received" as const, receivedAt: occurredAt },
      consumables: nextConsumables,
      movements,
    };
  },

  getExpirationState(expirationDate?: string, today = new Date()): ExpirationState {
    if (!expirationDate) return "not-applicable";

    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const expiration = parseLocalDate(expirationDate);
    const warningLimit = new Date(currentDate);
    warningLimit.setDate(warningLimit.getDate() + EXPIRATION_WARNING_DAYS);

    if (expiration < currentDate) return "expired";
    if (expiration <= warningLimit) return "expiring-soon";
    return "current";
  },
};
