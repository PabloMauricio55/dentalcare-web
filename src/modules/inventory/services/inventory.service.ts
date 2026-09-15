import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { Consumable, ExpirationState } from "@/modules/inventory/models/inventory.model";

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
