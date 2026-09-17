import type { CreatePatientDto } from "../dtos/patient.dto";
import type { Patient } from "../models/patient";

export function normalizeDpi(value: string) {
  return value.replace(/\D/g, "");
}

export function isMinor(birthDate: string, today = new Date()) {
  if (!birthDate) return false;
  const birth = new Date(`${birthDate}T00:00:00`);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age < 18;
}

export function validatePatient(dto: CreatePatientDto, patients: Patient[], editingId?: string) {
  if (!dto.name.trim() || !dto.dpi.trim() || !dto.birthDate || !dto.phone.trim()) {
    return "Nombre, DPI, fecha de nacimiento y teléfono son obligatorios.";
  }
  if (dto.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }
  const duplicatedDpi = patients.some((patient) => patient.id !== editingId && normalizeDpi(patient.dpi) === normalizeDpi(dto.dpi));
  if (duplicatedDpi) return "Ya existe un paciente registrado con este DPI.";
  if (isMinor(dto.birthDate) && (!dto.guardianName.trim() || !dto.guardianRelationship.trim() || !dto.guardianPhone.trim())) {
    return "Para un paciente menor de edad debes registrar nombre, parentesco y teléfono del responsable.";
  }
  return "";
}
