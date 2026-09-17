import type { Appointment } from "../models/appointment";

export type AppointmentSlot = {
  date: string;
  time: string;
  duration: number;
  professional: string;
};

const nonBlockingStatuses = ["Solicitada", "Propuesta enviada", "Pendiente de respuesta", "Cancelada", "Rechazada", "No asistió"];

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export const appointmentScheduleService = {
  conflicts(appointments: Appointment[], slot: AppointmentSlot, excludeId?: string) {
    const start = toMinutes(slot.time);
    const end = start + slot.duration;
    return appointments.filter((appointment) => {
      if (appointment.id === excludeId || appointment.date !== slot.date || appointment.professional !== slot.professional) return false;
      if (nonBlockingStatuses.includes(appointment.status)) return false;
      const appointmentStart = toMinutes(appointment.time);
      const appointmentEnd = appointmentStart + appointment.duration;
      return start < appointmentEnd && end > appointmentStart;
    });
  },

  alternatives(appointments: Appointment[], slot: AppointmentSlot, excludeId?: string, limit = 3) {
    const alternatives: AppointmentSlot[] = [];
    const requestedStart = toMinutes(slot.time);
    const opening = 8 * 60;
    const closing = 18 * 60;
    for (let offset = 15; offset <= 8 * 60 && alternatives.length < limit; offset += 15) {
      const candidates = [requestedStart + offset, requestedStart - offset];
      for (const candidate of candidates) {
        if (candidate < opening || candidate + slot.duration > closing) continue;
        const alternative = { ...slot, time: toTime(candidate) };
        if (!this.conflicts(appointments, alternative, excludeId).length && !alternatives.some((item) => item.time === alternative.time)) {
          alternatives.push(alternative);
          if (alternatives.length === limit) break;
        }
      }
    }
    return alternatives.sort((left, right) => left.time.localeCompare(right.time));
  },
};
