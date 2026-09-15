import type { CreateProtocolDto } from "@/modules/inventory/dtos/create-protocol.dto";

export type ProtocolField = keyof CreateProtocolDto;
export type ProtocolErrors = Partial<Record<ProtocolField, string>>;

export function validateProtocol(dto: CreateProtocolDto): ProtocolErrors {
  const errors: ProtocolErrors = {};

  if (!dto.code.trim()) errors.code = "El código es obligatorio.";
  if (!dto.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!dto.category) errors.category = "La categoría es obligatoria.";
  if (!dto.responsible.trim()) errors.responsible = "El responsable es obligatorio.";
  if (!dto.description.trim()) errors.description = "La descripción es obligatoria.";

  return errors;
}
