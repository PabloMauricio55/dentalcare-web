import type { ScheduleAppointmentDto } from "../dtos/appointment.dto";
import type { Appointment } from "../models/appointment";

export const appointmentService = {
  create(dto: ScheduleAppointmentDto): Appointment {
    return { ...dto, id: `c${Date.now()}`, duration: 45, source: "Clínica", status: "Confirmada" };
  },
};
