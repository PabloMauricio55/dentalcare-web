import type { AdministrativeAppointmentDto, AdministrativeAppointmentStatusDto } from "../dtos/administrative-appointment.dto";
import type { AdministrativeAppointment, AdministrativeAppointmentStatus } from "../models/administrative-appointment";

const statusMap: Record<AdministrativeAppointmentStatusDto, AdministrativeAppointmentStatus> = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export function toAdministrativeAppointment(dto: AdministrativeAppointmentDto): AdministrativeAppointment {
  return {
    id: dto.id,
    patient: dto.patient,
    professional: { id: dto.professional.id, name: dto.professional.fullName },
    scheduledAt: dto.scheduledAt,
    status: statusMap[dto.status],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
