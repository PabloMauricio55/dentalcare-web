export type AppointmentStatus = "Solicitada" | "Propuesta enviada" | "Pendiente de respuesta" | "Confirmada" | "En espera" | "En preparación" | "En atención" | "Atendida" | "Cancelada" | "Rechazada" | "No asistió";

export type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  professional: string;
  reason: string;
  status: AppointmentStatus;
  source: "Portal" | "App" | "Clínica";
  requestedChange?: string;
  notes?: string;
  arrivedAt?: string;
  proposedDate?: string;
  proposedTime?: string;
  proposalMessage?: string;
};

export type AppointmentAuditEntry = {
  id: string;
  appointmentId: string;
  patientId: string;
  occurredAt: string;
  action: string;
  fromStatus?: AppointmentStatus;
  toStatus?: AppointmentStatus;
  detail: string;
};
