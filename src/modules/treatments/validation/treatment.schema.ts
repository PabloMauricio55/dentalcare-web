import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";

export type TreatmentPlanErrors = Partial<Record<"name" | "professional" | "procedures", string>>;

export function validateTreatmentPlan(dto: CreateTreatmentPlanDto): TreatmentPlanErrors {
  const errors: TreatmentPlanErrors = {};
  if (!dto.name.trim()) errors.name = "El nombre del plan es obligatorio.";
  if (!dto.professional.trim()) errors.professional = "Selecciona un profesional.";
  if (!dto.procedures.length) errors.procedures = "Agrega al menos un procedimiento.";
  else if (dto.procedures.some((item) => !item.name.trim() || item.quantity < 1 || item.unitPrice <= 0)) {
    errors.procedures = "Cada procedimiento necesita nombre, cantidad mínima de 1 y un precio mayor que cero.";
  }
  return errors;
}
