import type { Appointment } from "../models/appointment";
import type { Patient } from "@/modules/patients/models/patient";

export function appointmentWithPatient(appointment: Appointment, patients: Patient[]) {
  return { ...appointment, patient: patients.find((patient) => patient.id === appointment.patientId) };
}
