export type AppointmentStatus = "Solicitada" | "Confirmada" | "En espera" | "En preparación" | "En atención" | "Atendida" | "Rechazada" | "No asistió";

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
};
