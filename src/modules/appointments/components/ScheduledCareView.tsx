"use client";

import { FileDown, PlayCircle, Printer } from "lucide-react";
import { useState } from "react";
import { ActionNotice, Button, DataTable, PageHeader, StatusBadge, type Column } from "@/shared/components";
import type { Appointment } from "../models/appointment";
import { useClinicSession } from "./ClinicSessionProvider";

export function ScheduledCareView() {
  const { appointments, patients, selectPatient, updateAppointmentStatus } = useClinicSession();
  const [notice, setNotice] = useState("");
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const today = appointments.filter((item) => item.date === "2026-09-10" && !["Solicitada","Rechazada"].includes(item.status));
  const columns: Column<Appointment>[] = [
    { key: "time", header: "Hora", cell: (row) => <strong>{row.time}</strong> },
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{patientName(row.patientId)}</strong><small>{patients.find((p) => p.id === row.patientId)?.code}</small></div> },
    { key: "attention", header: "Atención prevista", cell: (row) => <div className="cell-stack"><span>{row.reason}</span><small>{row.duration} min · {row.professional}</small></div> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "action", header: "Siguiente paso", cell: (row) => <Button variant="secondary" onClick={() => { selectPatient(row.patientId); if (row.status === "Confirmada") updateAppointmentStatus(row.id,"En espera"); setNotice(row.status === "Confirmada" ? "Llegada registrada; el paciente aparece en Sala de espera." : "Paciente seleccionado para continuar su atención."); }}><PlayCircle size={16} />{row.status === "Confirmada" ? "Registrar llegada" : "Continuar atención"}</Button> },
  ];
  const print = () => { window.print(); setNotice("Se abrió la impresión de la jornada actual."); };
  return <><PageHeader title="Atenciones programadas" description="Lista operativa de la jornada: paciente, motivo, profesional, estado y siguiente acción." actions={<><Button variant="ghost" onClick={print}><Printer size={17} /> Imprimir jornada</Button><Button variant="secondary" onClick={() => setNotice("Resumen de jornada preparado para exportación.")}><FileDown size={17} /> Exportar</Button></>} />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="card"><DataTable columns={columns} rows={today} /></section></>;
}
