import type { CreateProcedureRecordDto } from "@/modules/treatments/dtos/create-procedure-record.dto";

export type ProcedureRecordErrors = Partial<Record<"procedure" | "date" | "professional", string>>;

export function validateProcedureRecord(dto: CreateProcedureRecordDto): ProcedureRecordErrors {
  const errors: ProcedureRecordErrors = {};
  if (!dto.procedureId || !dto.procedureName.trim()) errors.procedure = "Selecciona un procedimiento del plan.";
  if (!dto.date) errors.date = "La fecha es obligatoria.";
  if (!dto.professional.trim()) errors.professional = "El profesional es obligatorio.";
  return errors;
}
