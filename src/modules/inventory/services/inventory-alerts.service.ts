import type { Consumable } from "@/modules/inventory/models/inventory.model";
import { inventoryService } from "@/modules/inventory/services/inventory.service";

export type InventoryAlertType = "low_stock" | "expired" | "expiring_soon";
export type InventoryAlertSeverity = "critical" | "warning" | "info";

export type InventoryAlert = {
  id: string;
  consumableId: string;
  type: InventoryAlertType;
  title: string;
  message: string;
  severity: InventoryAlertSeverity;
};

export function getInventoryAlerts(consumables: Consumable[], today = new Date()): InventoryAlert[] {
  return consumables
    .filter((consumable) => consumable.status === "active")
    .flatMap((consumable) => {
      const alerts: InventoryAlert[] = [];

      if (consumable.currentStock <= consumable.minimumStock) {
        alerts.push({
          id: `${consumable.id}-low-stock`,
          consumableId: consumable.id,
          type: "low_stock",
          title: "Existencia baja",
          message: `La existencia actual es ${consumable.currentStock} y el mínimo definido es ${consumable.minimumStock}.`,
          severity: "warning",
        });
      }

      const expirationState = inventoryService.getExpirationState(consumable.expirationDate, today);
      if (expirationState === "expired") {
        alerts.push({
          id: `${consumable.id}-expired`,
          consumableId: consumable.id,
          type: "expired",
          title: "Vencido",
          message: "La fecha de vencimiento del consumible ya pasó.",
          severity: "critical",
        });
      } else if (expirationState === "expiring-soon") {
        alerts.push({
          id: `${consumable.id}-expiring-soon`,
          consumableId: consumable.id,
          type: "expiring_soon",
          title: "Próximo a vencer",
          message: "El consumible vence durante los próximos 30 días calendario.",
          severity: "info",
        });
      }

      return alerts;
    });
}
