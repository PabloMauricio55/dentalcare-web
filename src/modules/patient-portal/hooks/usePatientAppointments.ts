"use client";

import { useState } from "react";
import { AppointmentRequest, PatientAppointment, mockAppointmentHistory, mockAppointments } from "../data/appointments.mock";
import { patientAppointmentsRepository } from "../data/appointments.repository";

const formatDate = (date: string, time: string) => new Intl.DateTimeFormat("es-GT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)) + ` · ${time}`;

export function usePatientAppointments() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>(mockAppointments);
  const [history] = useState(mockAppointmentHistory);

  const confirm = (id: string) => setAppointments((items) => items.map((item) => item.id === id ? { ...item, status: "Programado" } : item));

  const create = async (request: AppointmentRequest) => {
    const response = await patientAppointmentsRepository.createRequest(request);
    const appointment: PatientAppointment = { id: response.id, title: request.service, dateLabel: formatDate(request.preferredDate, request.preferredTime), professional: "Profesional por asignar", status: "Pendiente", detail: "Solicitud enviada. La clínica confirmará disponibilidad y especialista." };
    setAppointments((items) => [appointment, ...items]);
    return appointment;
  };

  const reschedule = async (id: string, request: AppointmentRequest) => {
    await patientAppointmentsRepository.createRequest(request);
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, dateLabel: formatDate(request.preferredDate, request.preferredTime), status: "Pendiente", detail: "Cambio solicitado. La clínica confirmará el nuevo horario." } : item));
  };

  return { appointments, history, confirm, create, reschedule };
}
