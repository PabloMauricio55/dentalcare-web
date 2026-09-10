import type { CreatePatientDto } from "../dtos/patient.dto";
import { patientFromDto } from "../adapters/patient.adapter";

export const patientService = {
  create(dto: CreatePatientDto, sequence: number) { return patientFromDto(dto, sequence); },
  createTemporaryPassword() { return `Dental-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; },
};
