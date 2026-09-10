"use client";

import { ClipboardCheck, DoorOpen, UserCheck } from "lucide-react";
import { useState } from "react";
import { ActionNotice, Button, EmptyState, PageHeader, StatusBadge } from "@/shared/components";
import { useClinicSession } from "./ClinicSessionProvider";

export function WaitingRoomView() {
  const { appointments, patients, updateAppointmentStatus, selectPatient } = useClinicSession();
  const [notice, setNotice] = useState("");
  const entries = appointments.filter((item) => ["En espera", "En preparación", "En atención"].includes(item.status));
  const patientOf = (id: string) => patients.find((patient) => patient.id === id);
  const nextAction = (id: string, status: string, patientId: string) => {
    selectPatient(patientId);
    if (status === "En espera") { updateAppointmentStatus(id,"En preparación"); setNotice("Paciente enviado a preparación. El asistente ya puede abrir la atención."); }
    else if (status === "En preparación") { updateAppointmentStatus(id,"En atención"); setNotice("Preparación completada. La atención quedó disponible para el odontólogo."); }
    else setNotice("El expediente del paciente quedó seleccionado para continuar la consulta.");
  };
  return <><PageHeader title="Sala de espera" description="Muestra quién llegó y cuál es el siguiente paso de cada paciente." />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="waiting-board">{entries.length ? entries.map((item) => { const patient = patientOf(item.patientId); return <article className="card waiting-card" key={item.id}><div className="waiting-order"><span>{item.time}</span><small>Llegó 08 min antes</small></div><div className="waiting-person"><span className="patient-avatar large">{patient?.name.split(" ").slice(0,2).map((part) => part[0]).join("")}</span><div><strong>{patient?.name}</strong><small>{item.reason} · {item.professional}</small></div></div><StatusBadge status={item.status} /><Button onClick={() => nextAction(item.id,item.status,item.patientId)}>{item.status === "En espera" ? <><DoorOpen size={17} /> Iniciar preparación</> : item.status === "En preparación" ? <><UserCheck size={17} /> Pasar con odontólogo</> : <><ClipboardCheck size={17} /> Abrir expediente</>}</Button></article>; }) : <section className="card"><EmptyState title="Sala vacía" description="No hay pacientes registrados en espera o atención." /></section>}</section></>;
}
