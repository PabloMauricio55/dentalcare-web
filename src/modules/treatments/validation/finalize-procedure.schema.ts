import type { FinalizeProcedureDto } from "@/modules/treatments/dtos/finalize-procedure.dto";

export type FinalizeProcedureErrors = Partial<Record<"procedure" | "materials", string>>;

export function validateFinalizeProcedure(dto: FinalizeProcedureDto): FinalizeProcedureErrors {
  const errors: FinalizeProcedureErrors = {};
  if (!dto.procedureRecordId) errors.procedure = "Selecciona un procedimiento registrado.";
  if (!dto.materials.length) errors.materials = "Agrega al menos un material utilizado.";
  else if (dto.materials.some((material) => !material.name.trim() || material.quantity <= 0 || !material.unit.trim())) {
    errors.materials = "Cada material necesita nombre, cantidad mayor que cero y unidad.";
  }
  return errors;
}
