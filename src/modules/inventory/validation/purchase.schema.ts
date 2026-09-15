import type { CreatePurchaseDto } from "@/modules/inventory/dtos/create-purchase.dto";

export type PurchaseField = "code" | "supplierId" | "purchaseDate" | "items";
export type PurchaseItemField = "consumableId" | "quantity" | "unitCost";
export type PurchaseItemErrors = Partial<Record<PurchaseItemField, string>>;
export type PurchaseErrors = Partial<Record<PurchaseField, string>> & {
  itemErrors?: PurchaseItemErrors[];
};

export function validatePurchase(dto: CreatePurchaseDto): PurchaseErrors {
  const errors: PurchaseErrors = {};

  if (!dto.code.trim()) errors.code = "El código es obligatorio.";
  if (!dto.supplierId) errors.supplierId = "Selecciona un proveedor.";
  if (!dto.purchaseDate) errors.purchaseDate = "La fecha es obligatoria.";
  if (!dto.items.length) errors.items = "Agrega al menos un consumible.";

  const duplicateIds = new Set(
    dto.items
      .map((item) => item.consumableId)
      .filter((id, index, items) => id && items.indexOf(id) !== index),
  );
  const itemErrors = dto.items.map<PurchaseItemErrors>((item) => {
    const currentErrors: PurchaseItemErrors = {};
    if (!item.consumableId) currentErrors.consumableId = "Selecciona un consumible.";
    else if (duplicateIds.has(item.consumableId)) currentErrors.consumableId = "No puedes repetir un consumible.";
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      currentErrors.quantity = "La cantidad debe ser un entero mayor que cero.";
    }
    if (!Number.isFinite(item.unitCost) || item.unitCost < 0) {
      currentErrors.unitCost = "El costo debe ser mayor o igual a cero.";
    }
    return currentErrors;
  });

  if (itemErrors.some((item) => Object.keys(item).length)) errors.itemErrors = itemErrors;
  return errors;
}
