"use client";

import { ClipboardCheck, DoorOpen, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, EmptyState, PageHeader, StatusBadge } from "@/shared/components";
import { DEMO_TODAY } from "../services/agenda-date.service";
import { appointmentFlowService } from "../services/appointment-flow.service";
import { useClinicSession } from "./ClinicSessionProvider";
import styles from "./agenda.module.css";

export function WaitingRoomView() {
  const router = useRouter();
  const { appointments, patients, updateAppointment, selectPatient } = useClinicSession();
  const [selectedDate, setSelectedDate] = useState(DEMO_TODAY);
  const [professional, setProfessional] = useState("Todos");
  const professionals = useMemo(
    () => Array.from(new Set(appointments.map((item) => item.professional))).sort(),
    [appointments],
  );
  const entries = appointments
    .filter((item) => ["En espera", "En preparación", "En atención"].includes(item.status))
    .filter((item) => item.date === selectedDate)
    .filter((item) => professional === "Todos" || item.professional === professional)
    .sort((left, right) => left.time.localeCompare(right.time));
  const patientOf = (id: string) => patients.find((patient) => patient.id === id);
  const nextAction = (appointmentId: string) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;
    const action = appointmentFlowService.actionFor(appointment);
    if (!action) return;
    selectPatient(appointment.patientId);
    updateAppointment(appointmentFlowService.advance(appointment, action));
    router.push(action.route);
  };
  return <><PageHeader title="Sala de espera" description="Muestra quién llegó, cuánto tiempo lleva esperando y cuál es su siguiente paso." /><section className="card"><div className={styles.operationalFilters}><label className="compact-field"><span>Fecha</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label><label className="compact-field"><span>Profesional</span><select value={professional} onChange={(event) => setProfessional(event.target.value)}><option>Todos</option>{professionals.map((item) => <option key={item}>{item}</option>)}</select></label><p>{entries.length} pacientes en flujo clínico</p></div></section><section className="waiting-board">{entries.length ? entries.map((item) => { const patient = patientOf(item.patientId); const action = appointmentFlowService.actionFor(item); return <article className="card waiting-card" key={item.id}><div className="waiting-order"><span>{item.time}</span><small>{appointmentFlowService.arrivalLabel(item.arrivedAt)}</small><small>{appointmentFlowService.waitLabel(item.arrivedAt)}</small></div><div className="waiting-person"><span className="patient-avatar large">{patient?.name.split(" ").slice(0,2).map((part) => part[0]).join("")}</span><div><strong>{patient?.name}</strong><small>{item.reason} · {item.professional}</small></div></div><StatusBadge status={item.status} />{action && <Button onClick={() => nextAction(item.id)}>{item.status === "En espera" ? <><DoorOpen size={17} /> Iniciar preparación</> : item.status === "En preparación" ? <><UserCheck size={17} /> Pasar con odontólogo</> : <><ClipboardCheck size={17} /> Abrir expediente</>}</Button>}</article>; }) : <section className="card"><EmptyState title="Sala vacía" description="No hay pacientes en espera, preparación o atención para los filtros seleccionados." /></section>}</section></>;
}
