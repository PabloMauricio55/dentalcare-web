import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";

export type InstrumentField = keyof CreateInstrumentDto;
export type InstrumentErrors = Partial<Record<InstrumentField, string>>;

export function validateInstrument(dto: CreateInstrumentDto): InstrumentErrors {
  const errors: InstrumentErrors = {};

  if (!dto.code.trim()) errors.code = "El código es obligatorio.";
  if (!dto.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!dto.category.trim()) errors.category = "La categoría es obligatoria.";
  if (!dto.location.trim()) errors.location = "La ubicación es obligatoria.";

  if (!Number.isInteger(dto.totalQuantity) || dto.totalQuantity < 0) {
    errors.totalQuantity = "El total debe ser un número entero mayor o igual a cero.";
  }

  if (!Number.isInteger(dto.availableQuantity) || dto.availableQuantity < 0) {
    errors.availableQuantity = "Las unidades disponibles deben ser un número entero mayor o igual a cero.";
  } else if (Number.isInteger(dto.totalQuantity) && dto.availableQuantity > dto.totalQuantity) {
    errors.availableQuantity = "Las unidades disponibles no pueden superar el total.";
  }

  return errors;
}
