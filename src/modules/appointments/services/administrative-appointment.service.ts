import { apiRequest } from "@/shared/lib/api-client";
import { toAdministrativeAppointment } from "../adapters/administrative-appointment.adapter";
import type {
  AdministrativeAppointmentDto,
  AdministrativeAppointmentPageDto,
  CreateAdministrativeAppointmentDto,
  RescheduleAdministrativeAppointmentDto,
  UpdateAdministrativeAppointmentStatusDto,
} from "../dtos/administrative-appointment.dto";
import type { AdministrativeAppointmentFilters } from "../models/administrative-appointment";

function queryString(filters: AdministrativeAppointmentFilters) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const administrativeAppointmentService = {
  async list(filters: AdministrativeAppointmentFilters, signal?: AbortSignal) {
    const page = await apiRequest<AdministrativeAppointmentPageDto>(
      `/api/v1/appointments${queryString(filters)}`,
      { signal },
    );
    return { ...page, content: page.content.map(toAdministrativeAppointment) };
  },

  async findById(appointmentId: string, signal?: AbortSignal) {
    const dto = await apiRequest<AdministrativeAppointmentDto>(
      `/api/v1/appointments/${appointmentId}`,
      { signal },
    );
    return toAdministrativeAppointment(dto);
  },

  async create(payload: CreateAdministrativeAppointmentDto) {
    const dto = await apiRequest<AdministrativeAppointmentDto>("/api/v1/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return toAdministrativeAppointment(dto);
  },

  async reschedule(appointmentId: string, payload: RescheduleAdministrativeAppointmentDto) {
    const dto = await apiRequest<AdministrativeAppointmentDto>(
      `/api/v1/appointments/${appointmentId}/schedule`,
      { method: "PATCH", body: JSON.stringify(payload) },
    );
    return toAdministrativeAppointment(dto);
  },

  async updateStatus(appointmentId: string, payload: UpdateAdministrativeAppointmentStatusDto) {
    const dto = await apiRequest<AdministrativeAppointmentDto>(
      `/api/v1/appointments/${appointmentId}/status`,
      { method: "PATCH", body: JSON.stringify(payload) },
    );
    return toAdministrativeAppointment(dto);
  },
};
