import type { CreatePatientDto } from "../dtos/patient.dto";
import type { Patient } from "../models/patient";

export function patientFromDto(dto: CreatePatientDto, sequence: number): Patient {
  return { ...dto, id: `p${Date.now()}`, code: `PAC-${String(sequence).padStart(5, "0")}`, emergencyContact: "Pendiente", billingName: dto.name, nit: "CF", accessStatus: "Pendiente", lastVisit: "Sin visitas" };
}

export function matchesPatient(patient: Patient, query: string) {
  const searchable = [patient.name, patient.dpi, patient.phone, patient.code, patient.email, patient.city, patient.gender].join(" ").toLowerCase();
  return searchable.includes(query.trim().toLowerCase());
}
