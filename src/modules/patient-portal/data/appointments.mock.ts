export type AppointmentStatus = "Programado" | "Próximo" | "Pendiente" | "Completada" | "Reprogramada" | "Cancelada";

export type PatientAppointment = {
  id: string;
  title: string;
  dateLabel: string;
  professional: string;
  status: AppointmentStatus;
  detail: string;
};

export type AppointmentRequest = {
  service: string;
  branch: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

export const mockAppointments: PatientAppointment[] = [
  { id: "control-orthodontics", title: "Control de ortodoncia", dateLabel: "18 de septiembre · 10:30 a. m.", professional: "Dra. Andrea López", status: "Programado", detail: "Ajuste de alineadores y revisión del progreso." },
  { id: "preventive-cleaning", title: "Limpieza preventiva", dateLabel: "12 de octubre · Horario por confirmar", professional: "Equipo de prevención", status: "Próximo", detail: "Control recomendado cada seis meses." },
  { id: "periodontal-review", title: "Revisión periodontal", dateLabel: "Pendiente de programación", professional: "Dra. Sofía Ramírez", status: "Pendiente", detail: "Seguimiento sugerido por tu última evaluación." },
];

export const mockAppointmentHistory = [
  { id: "cleaning-2026-08", date: "04 AGO 2026", service: "Limpieza preventiva", professional: "Dra. Sofía Ramírez", status: "Completada", detail: "Profilaxis y recomendaciones de higiene." },
  { id: "assessment-2026-06", date: "16 JUN 2026", service: "Evaluación general", professional: "Dr. Carlos Méndez", status: "Reprogramada", detail: "Se movió por disponibilidad del paciente." },
  { id: "periodontal-2026-05", date: "08 MAY 2026", service: "Control periodontal", professional: "Dra. Andrea López", status: "Cancelada", detail: "Pendiente de nueva solicitud." },
];

export const createMockRequest = (request: AppointmentRequest) => ({
  id: `request-${Date.now()}`,
  ...request,
  status: "Pendiente" as const,
});
