import type { Appointment } from "../models/appointment";

export const initialAppointments: Appointment[] = [
  { id: "c1", patientId: "p1", date: "2026-09-10", time: "08:00", duration: 45, professional: "Dra. Elena Castillo", reason: "Evaluación inicial", status: "En atención", source: "Clínica" },
  { id: "c2", patientId: "p2", date: "2026-09-10", time: "09:00", duration: 60, professional: "Dr. Mario Morales", reason: "Restauración pieza 26", status: "En espera", source: "App" },
  { id: "c3", patientId: "p3", date: "2026-09-10", time: "10:30", duration: 30, professional: "Dra. Elena Castillo", reason: "Control", status: "Confirmada", source: "Portal" },
  { id: "c4", patientId: "p4", date: "2026-09-10", time: "11:30", duration: 45, professional: "Dra. Elena Castillo", reason: "Limpieza dental", status: "Confirmada", source: "Clínica" },
  { id: "c5", patientId: "p1", date: "2026-09-12", time: "14:00", duration: 45, professional: "Dra. Elena Castillo", reason: "Solicita control por dolor", status: "Solicitada", source: "App", requestedChange: "Prefiere horario después de las 14:00" },
  { id: "c6", patientId: "p3", date: "2026-09-13", time: "09:30", duration: 30, professional: "Dr. Mario Morales", reason: "Reprogramar control", status: "Solicitada", source: "Portal", requestedChange: "No puede asistir el viernes" },
];
