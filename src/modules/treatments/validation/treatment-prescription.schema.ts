import type { CreateTreatmentPrescriptionDto } from "@/modules/treatments/dtos/create-treatment-prescription.dto";

export type TreatmentPrescriptionErrors = Partial<Record<"procedure" | "medications", string>>;

export function validateTreatmentPrescription(dto: CreateTreatmentPrescriptionDto): TreatmentPrescriptionErrors {
  const errors: TreatmentPrescriptionErrors = {};
  if (!dto.procedureRecordId) errors.procedure = "Selecciona un procedimiento finalizado.";
  if (!dto.medications.length) errors.medications = "Agrega al menos un medicamento.";
  else if (dto.medications.some((medication) => !medication.name.trim() || !medication.dose.trim() || !medication.frequency.trim() || !medication.duration.trim())) {
    errors.medications = "Cada medicamento necesita nombre, dosis, frecuencia y duración.";
  }
  return errors;
}
