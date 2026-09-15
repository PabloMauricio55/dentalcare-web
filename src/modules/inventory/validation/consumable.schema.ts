import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";

export type ConsumableField = keyof CreateConsumableDto;
export type ConsumableErrors = Partial<Record<ConsumableField, string>>;

export function validateConsumable(dto: CreateConsumableDto): ConsumableErrors {
  const errors: ConsumableErrors = {};

  if (!dto.code.trim()) errors.code = "El código es obligatorio.";
  if (!dto.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!dto.category.trim()) errors.category = "La categoría es obligatoria.";
  if (!dto.unit.trim()) errors.unit = "La unidad es obligatoria.";
  if (!Number.isFinite(dto.currentStock) || dto.currentStock < 0) {
    errors.currentStock = "La existencia debe ser un número mayor o igual a cero.";
  }
  if (!Number.isFinite(dto.minimumStock) || dto.minimumStock < 0) {
    errors.minimumStock = "La existencia mínima debe ser un número mayor o igual a cero.";
  }

  return errors;
}
