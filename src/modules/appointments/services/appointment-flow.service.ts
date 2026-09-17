import type { Appointment } from "../models/appointment";

export type AppointmentFlowAction = {
  label: string;
  route: string;
  nextStatus?: Appointment["status"];
  registerArrival?: boolean;
};

const flowActions: Partial<Record<Appointment["status"], AppointmentFlowAction>> = {
  Confirmada: {
    label: "Registrar llegada",
    route: "/agenda/sala-espera",
    nextStatus: "En espera",
    registerArrival: true,
  },
  "En espera": {
    label: "Iniciar preparación",
    route: "/expediente/:patientId/preparacion",
    nextStatus: "En preparación",
  },
  "En preparación": {
    label: "Pasar con odontólogo",
    route: "/expediente/:patientId",
    nextStatus: "En atención",
  },
  "En atención": {
    label: "Abrir expediente",
    route: "/expediente/:patientId",
  },
};

export const appointmentFlowService = {
  actionFor(appointment: Appointment): AppointmentFlowAction | null {
    const action = flowActions[appointment.status];
    if (!action) return null;
    return { ...action, route: action.route.replace(":patientId", appointment.patientId) };
  },

  advance(appointment: Appointment, action: AppointmentFlowAction, now = new Date()): Appointment {
    return {
      ...appointment,
      status: action.nextStatus ?? appointment.status,
      arrivedAt: action.registerArrival ? now.toISOString() : appointment.arrivedAt,
    };
  },

  waitLabel(arrivedAt?: string, now = new Date()): string {
    if (!arrivedAt) return "Hora de llegada no registrada";
    const minutes = Math.max(0, Math.floor((now.getTime() - new Date(arrivedAt).getTime()) / 60_000));
    if (minutes === 0) return "Llegó hace menos de 1 min";
    return `Espera: ${minutes} min`;
  },

  arrivalLabel(arrivedAt?: string): string {
    if (!arrivedAt) return "Sin hora de llegada";
    return `Llegó ${new Intl.DateTimeFormat("es-GT", { hour: "2-digit", minute: "2-digit" }).format(new Date(arrivedAt))}`;
  },
};
