"use client";

import { createContext, useContext, useState } from "react";
import type { Appointment, AppointmentStatus } from "../models/appointment";
import type { ScheduleAppointmentDto } from "../dtos/appointment.dto";
import { initialAppointments } from "../mocks/appointments";
import { appointmentService } from "../services/appointment.service";
import type { Patient } from "@/modules/patients/models/patient";
import type { CreatePatientDto } from "@/modules/patients/dtos/patient.dto";
import { initialPatients } from "@/modules/patients/mocks/patients";
import { patientService } from "@/modules/patients/services/patient.service";
import type { PatientAccessCredentials } from "@/modules/patients/models/patient-access";

type ClinicContextValue = {
  patients: Patient[];
  appointments: Appointment[];
  patientAccess: Record<string, PatientAccessCredentials>;
  selectedPatientId: string | null;
  selectPatient: (id: string | null) => void;
  addPatient: (dto: CreatePatientDto) => Patient;
  updatePatient: (patient: Patient) => void;
  createAccess: (patientId: string) => PatientAccessCredentials | null;
  resetAccess: (patientId: string) => PatientAccessCredentials | null;
  addAppointment: (dto: ScheduleAppointmentDto) => void;
  updateAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicSessionProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
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
  const addAppointment = (dto: ScheduleAppointmentDto) => setAppointments((current) => [...current, appointmentService.create(dto)]);
  const updateAppointment = (next: Appointment) => setAppointments((current) => current.map((item) => item.id === next.id ? next : item));
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  const rescheduleAppointment = (id: string, date: string, time: string) => setAppointments((current) => current.map((item) => item.id === id ? { ...item, date, time, status: "Confirmada" } : item));
  const value = { patients, appointments, patientAccess, selectedPatientId, selectPatient, addPatient, updatePatient, createAccess, resetAccess, addAppointment, updateAppointment, updateAppointmentStatus, rescheduleAppointment };
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinicSession() {
  const value = useContext(ClinicContext);
  if (!value) throw new Error("useClinicSession debe utilizarse dentro de ClinicSessionProvider");
  return value;
}
