export type AdministrativeAppointmentStatus = "scheduled" | "completed" | "cancelled";

export type AdministrativeAppointment = {
  id: string;
  patient: { id: string; code: string; name: string; phone: string };
  professional: { id: string; name: string };
  scheduledAt: string;
  status: AdministrativeAppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdministrativeAppointmentFilters = {
  from?: string;
  to?: string;
  patientId?: string;
  professionalId?: string;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  page?: number;
  size?: number;
};
