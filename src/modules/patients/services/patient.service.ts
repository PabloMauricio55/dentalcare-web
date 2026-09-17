import type { CreatePatientDto } from "../dtos/patient.dto";
import { patientFromDto } from "../adapters/patient.adapter";
import type { Patient } from "../models/patient";
import type { PatientAccessCredentials } from "../models/patient-access";

function accessTimestamp() {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

function createTemporaryPassword() {
  return `Dental-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export const patientService = {
  create(dto: CreatePatientDto, sequence: number) { return patientFromDto(dto, sequence); },
  createTemporaryPassword,
  createAccessCredentials(patient: Patient, operation: PatientAccessCredentials["operation"]): PatientAccessCredentials {
    return {
      patientId: patient.id,
      username: patient.code.toLowerCase(),
      temporaryPassword: createTemporaryPassword(),
      generatedAt: accessTimestamp(),
      operation,
    };
  },
};
