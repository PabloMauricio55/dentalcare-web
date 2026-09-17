"use client";

import { createContext, useContext, useState } from "react";
import type { Appointment, AppointmentAuditEntry, AppointmentStatus } from "../models/appointment";
import type { ScheduleAppointmentDto } from "../dtos/appointment.dto";
import { initialAppointmentAudit, initialAppointments } from "../mocks/appointments";
import { appointmentService } from "../services/appointment.service";
import type { Patient } from "@/modules/patients/models/patient";
import type { CreatePatientDto } from "@/modules/patients/dtos/patient.dto";
import { initialPatients } from "@/modules/patients/mocks/patients";
import { patientService } from "@/modules/patients/services/patient.service";
import type { PatientAccessCredentials } from "@/modules/patients/models/patient-access";
import { appointmentScheduleService } from "../services/appointment-schedule.service";

export type AppointmentMutationResult = { ok: true } | { ok: false; conflicts: Appointment[] };

type ClinicContextValue = {
  patients: Patient[];
  appointments: Appointment[];
  appointmentAudit: AppointmentAuditEntry[];
  patientAccess: Record<string, PatientAccessCredentials>;
  selectedPatientId: string | null;
  selectPatient: (id: string | null) => void;
  addPatient: (dto: CreatePatientDto) => Patient;
  updatePatient: (patient: Patient) => void;
  createAccess: (patientId: string) => PatientAccessCredentials | null;
  resetAccess: (patientId: string) => PatientAccessCredentials | null;
  addAppointment: (dto: ScheduleAppointmentDto) => AppointmentMutationResult;
  updateAppointment: (appointment: Appointment) => AppointmentMutationResult;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  confirmAppointment: (id: string) => AppointmentMutationResult;
  proposeAppointment: (id: string, date: string, time: string, message: string) => AppointmentMutationResult;
  markProposalPending: (id: string) => void;
  respondToProposal: (id: string, response: "accept" | "reject" | "cancel") => AppointmentMutationResult;
  rescheduleAppointment: (id: string, date: string, time: string) => AppointmentMutationResult;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicSessionProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [appointmentAudit, setAppointmentAudit] = useState<AppointmentAuditEntry[]>(initialAppointmentAudit);
  const [patientAccess, setPatientAccess] = useState<Record<string, PatientAccessCredentials>>({});
  const [selectedPatientId, selectPatient] = useState<string | null>(null);
  const addPatient = (dto: CreatePatientDto) => {
    const patient = patientService.create(dto, patients.length + 124);
    setPatients((current) => [...current, patient]);
    selectPatient(patient.id);
    return patient;
  };
  const updatePatient = (next: Patient) => setPatients((current) => current.map((patient) => patient.id === next.id ? next : patient));
  const createAccess = (patientId: string) => {
    const patient = patients.find((item) => item.id === patientId);
    if (!patient || patient.accessStatus !== "Pendiente") return null;
    const credentials = patientService.createAccessCredentials(patient, "Creación");
    setPatients((current) => current.map((patient) => patient.id === patientId ? { ...patient, accessStatus: "Activo" } : patient));
    setPatientAccess((current) => ({ ...current, [patientId]: credentials }));
    return credentials;
  };
  const resetAccess = (patientId: string) => {
    const patient = patients.find((item) => item.id === patientId);
    if (!patient || patient.accessStatus === "Pendiente") return null;
    const credentials = patientService.createAccessCredentials(patient, "Restablecimiento");
    setPatients((current) => current.map((item) => item.id === patientId ? { ...item, accessStatus: "Activo" } : item));
    setPatientAccess((current) => ({ ...current, [patientId]: credentials }));
    return credentials;
  };
  const appendAudit = (appointment: Appointment, action: string, detail: string, toStatus?: AppointmentStatus) => {
    setAppointmentAudit((current) => [...current, {
      id: `audit-${Date.now()}-${current.length}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      occurredAt: new Date().toISOString(),
      action,
      fromStatus: appointment.status,
      toStatus,
      detail,
    }]);
  };
  const addAppointment = (dto: ScheduleAppointmentDto): AppointmentMutationResult => {
    const conflicts = appointmentScheduleService.conflicts(appointments, dto);
    if (conflicts.length) return { ok: false, conflicts };
    const appointment = appointmentService.create(dto);
    setAppointments((current) => [...current, appointment]);
    appendAudit(appointment, "Cita creada", `${appointment.date} ${appointment.time} · ${appointment.duration} min`, appointment.status);
    return { ok: true };
  };
  const updateAppointment = (next: Appointment): AppointmentMutationResult => {
    const conflicts = appointmentScheduleService.conflicts(appointments, next, next.id);
    if (conflicts.length && !["Solicitada", "Propuesta enviada", "Pendiente de respuesta", "Cancelada", "Rechazada", "No asistió"].includes(next.status)) {
      return { ok: false, conflicts };
    }
    const previous = appointments.find((item) => item.id === next.id);
    setAppointments((current) => current.map((item) => item.id === next.id ? next : item));
    if (previous && previous.status !== next.status) {
      appendAudit(previous, "Estado actualizado", `${previous.status} → ${next.status}`, next.status);
    } else if (previous && (previous.professional !== next.professional || previous.duration !== next.duration || previous.reason !== next.reason)) {
      appendAudit(previous, "Cita editada", `${next.professional} · ${next.duration} min · ${next.reason}`, next.status);
    }
    return { ok: true };
  };
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return;
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    appendAudit(appointment, "Estado actualizado", `${appointment.status} → ${status}`, status);
  };
  const confirmAppointment = (id: string): AppointmentMutationResult => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return { ok: true };
    const date = appointment.proposedDate ?? appointment.date;
    const time = appointment.proposedTime ?? appointment.time;
    const conflicts = appointmentScheduleService.conflicts(appointments, { ...appointment, date, time }, appointment.id);
    if (conflicts.length) return { ok: false, conflicts };
    setAppointments((current) => current.map((item) => item.id === id ? {
      ...item,
      date,
      time,
      status: "Confirmada",
      proposedDate: undefined,
      proposedTime: undefined,
      proposalMessage: undefined,
    } : item));
    appendAudit(appointment, "Cita confirmada", `${date} ${time}`, "Confirmada");
    return { ok: true };
  };
  const proposeAppointment = (id: string, date: string, time: string, message: string): AppointmentMutationResult => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return { ok: true };
    const conflicts = appointmentScheduleService.conflicts(appointments, { ...appointment, date, time }, appointment.id);
    if (conflicts.length) return { ok: false, conflicts };
    setAppointments((current) => current.map((item) => item.id === id ? {
      ...item,
      status: "Propuesta enviada",
      proposedDate: date,
      proposedTime: time,
      proposalMessage: message,
    } : item));
    appendAudit(appointment, "Propuesta enviada", `${date} ${time} · ${message}`, "Propuesta enviada");
    return { ok: true };
  };
  const markProposalPending = (id: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return;
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status: "Pendiente de respuesta" } : item));
    appendAudit(appointment, "Propuesta entregada", "Pendiente de respuesta del paciente", "Pendiente de respuesta");
  };
  const respondToProposal = (id: string, response: "accept" | "reject" | "cancel"): AppointmentMutationResult => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return { ok: true };
    if (response === "accept") return confirmAppointment(id);
    const status: AppointmentStatus = response === "reject" ? "Rechazada" : "Cancelada";
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    appendAudit(appointment, response === "reject" ? "Propuesta rechazada" : "Solicitud cancelada", "Respuesta simulada del paciente", status);
    return { ok: true };
  };
  const rescheduleAppointment = (id: string, date: string, time: string): AppointmentMutationResult => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return { ok: true };
    const conflicts = appointmentScheduleService.conflicts(appointments, { ...appointment, date, time }, id);
    if (conflicts.length) return { ok: false, conflicts };
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, date, time, status: "Confirmada" } : item));
    appendAudit(appointment, "Cita reprogramada", `${appointment.date} ${appointment.time} → ${date} ${time}`, "Confirmada");
    return { ok: true };
  };
  const value = { patients, appointments, appointmentAudit, patientAccess, selectedPatientId, selectPatient, addPatient, updatePatient, createAccess, resetAccess, addAppointment, updateAppointment, updateAppointmentStatus, confirmAppointment, proposeAppointment, markProposalPending, respondToProposal, rescheduleAppointment };
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinicSession() {
  const value = useContext(ClinicContext);
  if (!value) throw new Error("useClinicSession debe utilizarse dentro de ClinicSessionProvider");
  return value;
}
