"use client";

import { Check, Clock3, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, StatusBadge, type Column } from "@/shared/components";
import type { Appointment } from "../models/appointment";
import { useClinicSession } from "./ClinicSessionProvider";

export function RequestsView() {
  const { appointments, patients, updateAppointmentStatus, rescheduleAppointment } = useClinicSession();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [action, setAction] = useState<"reject" | "reschedule" | null>(null);
  const [notice, setNotice] = useState("");
  const rows = appointments.filter((item) => item.status === "Solicitada");
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const columns: Column<Appointment>[] = [
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{patientName(row.patientId)}</strong><small>{row.source}</small></div> },
    { key: "request", header: "Solicitud", cell: (row) => <div className="cell-stack"><span>{row.reason}</span><small>{row.requestedChange}</small></div> },
    { key: "schedule", header: "Horario solicitado", cell: (row) => <div className="cell-stack"><strong>{row.date}</strong><small>{row.time} · {row.professional}</small></div> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (row) => <div className="table-actions"><button title="Confirmar" onClick={() => { updateAppointmentStatus(row.id,"Confirmada"); setNotice("Solicitud confirmada. El paciente recibirá la cita definitiva."); }}><Check size={17} /></button><button title="Proponer horario" onClick={() => { setSelected(row); setAction("reschedule"); }}><Clock3 size={17} /></button><button className="danger-icon" title="Rechazar" onClick={() => { setSelected(row); setAction("reject"); }}><X size={17} /></button></div> },
  ];
  const submitSchedule = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); if (selected) { rescheduleAppointment(selected.id,String(data.get("date")),String(data.get("time"))); setAction(null); setSelected(null); setNotice("Se propuso y confirmó el nuevo horario."); } };
  return <><PageHeader title="Solicitudes de citas" description="La agenda solo cambia cuando la clínica confirma una solicitud." />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="card"><DataTable columns={columns} rows={rows} emptyMessage="No hay solicitudes pendientes." /></section><ConfirmDialog open={action === "reject"} title="Rechazar solicitud" message={`Se notificará a ${selected ? patientName(selected.patientId) : "la persona"} que la solicitud no pudo confirmarse.`} danger confirmLabel="Rechazar" onClose={() => setAction(null)} onConfirm={() => { if (selected) updateAppointmentStatus(selected.id,"Rechazada"); setAction(null); setNotice("Solicitud rechazada y notificación preparada."); }} /><Modal open={action === "reschedule"} title="Proponer otro horario" description={selected ? `${patientName(selected.patientId)} · ${selected.reason}` : ""} onClose={() => setAction(null)}><form className="form-grid" onSubmit={submitSchedule}><label className="field"><span>Nueva fecha *</span><input name="date" type="date" defaultValue={selected?.date} required /></label><label className="field"><span>Nueva hora *</span><input name="time" type="time" defaultValue={selected?.time} required /></label><label className="field full"><span>Mensaje al paciente</span><textarea rows={3} defaultValue="Te proponemos este nuevo horario. Confirma desde tu portal o aplicación." /></label><div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setAction(null)}>Cancelar</Button><Button type="submit">Enviar propuesta</Button></div></form></Modal></>;
}
