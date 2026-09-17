"use client";

import { Ban, Check, Clock3, FileDown, Send, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, StatusBadge, type Column } from "@/shared/components";
import type { Appointment } from "../models/appointment";
import { appointmentExportService } from "../services/appointment-export.service";
import { appointmentScheduleService, type AppointmentSlot } from "../services/appointment-schedule.service";
import { useClinicSession } from "./ClinicSessionProvider";
import styles from "./agenda.module.css";

type RequestAction = "reject" | "propose" | "cancel" | null;
const requestStatuses = ["Solicitada", "Propuesta enviada", "Pendiente de respuesta"];

export function RequestsView() {
  const {
    appointments,
    appointmentAudit,
    patients,
    confirmAppointment,
    proposeAppointment,
    markProposalPending,
    respondToProposal,
  } = useClinicSession();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [action, setAction] = useState<RequestAction>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [professional, setProfessional] = useState("Todos");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [proposalMessage, setProposalMessage] = useState("Te proponemos este nuevo horario. Confirma desde tu portal o aplicación.");
  const [suggestions, setSuggestions] = useState<AppointmentSlot[]>([]);

  const professionals = useMemo(
    () => Array.from(new Set(appointments.map((item) => item.professional))).sort(),
    [appointments],
  );
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const rows = appointments
    .filter((item) => requestStatuses.includes(item.status))
    .filter((item) => statusFilter === "Todos" || item.status === statusFilter)
    .filter((item) => professional === "Todos" || item.professional === professional);
  const filteredAudit = appointmentAudit.filter((entry) => {
    const appointment = appointments.find((item) => item.id === entry.appointmentId);
    const matchesProfessional = professional === "Todos" || appointment?.professional === professional;
    const matchesStatus = statusFilter === "Todos" || appointment?.status === statusFilter;
    return matchesProfessional && matchesStatus;
  });

  const openProposal = (appointment: Appointment) => {
    const date = appointment.proposedDate ?? appointment.date;
    const time = appointment.proposedTime ?? appointment.time;
    setSelected(appointment);
    setProposedDate(date);
    setProposedTime(time);
    setProposalMessage(appointment.proposalMessage ?? "Te proponemos este nuevo horario. Confirma desde tu portal o aplicación.");
    setSuggestions(appointmentScheduleService.alternatives(appointments, { ...appointment, date, time }, appointment.id));
    setError("");
    setAction("propose");
  };

  const confirmRequest = (appointment: Appointment) => {
    const result = confirmAppointment(appointment.id);
    if (!result.ok) {
      setNotice("No se confirmó: el profesional ya tiene una cita en ese horario. Propón otra hora.");
      openProposal(appointment);
      return;
    }
    setNotice("Solicitud confirmada. El horario ya forma parte de la agenda definitiva.");
  };

  const submitProposal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !proposedDate || !proposedTime || !proposalMessage.trim()) {
      setError("Completa la fecha, hora y mensaje de la propuesta.");
      return;
    }
    const result = proposeAppointment(selected.id, proposedDate, proposedTime, proposalMessage.trim());
    if (!result.ok) {
      setError("Ese horario ya está ocupado. Selecciona una de las alternativas disponibles.");
      setSuggestions(appointmentScheduleService.alternatives(appointments, { ...selected, date: proposedDate, time: proposedTime }, selected.id));
      return;
    }
    setAction(null);
    setSelected(null);
    setNotice("Propuesta enviada. La cita todavía no está confirmada.");
  };

  const acceptProposal = (appointment: Appointment) => {
    const result = respondToProposal(appointment.id, "accept");
    if (!result.ok) {
      setNotice("La propuesta ya no está disponible porque el horario fue ocupado. Debe enviarse otra.");
      openProposal(appointment);
      return;
    }
    setNotice("Respuesta simulada: el paciente aceptó y la cita quedó confirmada.");
  };

  const columns: Column<Appointment>[] = [
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{patientName(row.patientId)}</strong><small>{row.source}</small></div> },
    { key: "request", header: "Solicitud", cell: (row) => <div className="cell-stack"><span>{row.reason}</span><small>{row.requestedChange}</small></div> },
    { key: "schedule", header: "Horario", cell: (row) => <div className="cell-stack"><strong>{row.date} · {row.time}</strong><small>{row.duration} min · {row.professional}</small>{row.proposedDate && <small>Propuesto: {row.proposedDate} · {row.proposedTime}</small>}</div> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "Acciones",
      className: "actions-cell",
      cell: (row) => <div className="table-actions">
        {row.status === "Solicitada" && <>
          <button title="Confirmar solicitud" onClick={() => confirmRequest(row)}><Check size={17} /></button>
          <button title="Proponer horario" onClick={() => openProposal(row)}><Clock3 size={17} /></button>
          <button className="danger-icon" title="Rechazar solicitud" onClick={() => { setSelected(row); setAction("reject"); }}><X size={17} /></button>
        </>}
        {row.status === "Propuesta enviada" && <button title="Marcar propuesta como entregada" onClick={() => { markProposalPending(row.id); setNotice("La propuesta fue entregada y queda pendiente de respuesta."); }}><Send size={17} /></button>}
        {row.status === "Pendiente de respuesta" && <>
          <button title="Simular aceptación" onClick={() => acceptProposal(row)}><Check size={17} /></button>
          <button title="Modificar propuesta" onClick={() => openProposal(row)}><Clock3 size={17} /></button>
          <button className="danger-icon" title="Simular rechazo" onClick={() => { respondToProposal(row.id, "reject"); setNotice("Respuesta simulada: propuesta rechazada."); }}><X size={17} /></button>
          <button className="danger-icon" title="Cancelar solicitud" onClick={() => { setSelected(row); setAction("cancel"); }}><Ban size={17} /></button>
        </>}
      </div>,
    },
  ];

  const exportAudit = () => {
    appointmentExportService.downloadAuditCsv(filteredAudit, patientName, { status: statusFilter, professional });
    setNotice(`Se exportaron ${filteredAudit.length} movimientos de auditoría con los filtros visibles.`);
  };

  return <>
    <PageHeader
      title="Solicitudes de citas"
      description="Una solicitud o propuesta solo entra en la agenda definitiva cuando queda confirmada."
      actions={<Button variant="secondary" onClick={exportAudit}><FileDown size={17} /> Exportar auditoría CSV</Button>}
    />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className="card">
      <div className={styles.operationalFilters}>
        <label className="compact-field"><span>Estado</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option>{requestStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="compact-field"><span>Profesional</span><select value={professional} onChange={(event) => setProfessional(event.target.value)}><option>Todos</option>{professionals.map((item) => <option key={item}>{item}</option>)}</select></label>
        <p>{rows.length} solicitudes visibles</p>
      </div>
      <DataTable columns={columns} rows={rows} emptyMessage="No hay solicitudes para los filtros seleccionados." />
    </section>

    <ConfirmDialog
      open={action === "reject" || action === "cancel"}
      title={action === "cancel" ? "Cancelar solicitud" : "Rechazar solicitud"}
      message={`Se registrará la decisión y se preparará la notificación para ${selected ? patientName(selected.patientId) : "el paciente"}.`}
      danger
      confirmLabel={action === "cancel" ? "Cancelar solicitud" : "Rechazar"}
      onClose={() => setAction(null)}
      onConfirm={() => {
        if (selected) respondToProposal(selected.id, action === "cancel" ? "cancel" : "reject");
        setAction(null);
        setNotice(action === "cancel" ? "Solicitud cancelada." : "Solicitud rechazada.");
      }}
    />

    <Modal open={action === "propose"} title="Proponer otro horario" description={selected ? `${patientName(selected.patientId)} · ${selected.reason}` : ""} onClose={() => setAction(null)}>
      <form className="form-grid" onSubmit={submitProposal}>
        <label className="field"><span>Nueva fecha *</span><input type="date" value={proposedDate} onChange={(event) => setProposedDate(event.target.value)} required /></label>
        <label className="field"><span>Nueva hora *</span><input type="time" value={proposedTime} onChange={(event) => setProposedTime(event.target.value)} required /></label>
        <label className="field full"><span>Mensaje al paciente *</span><textarea rows={3} value={proposalMessage} onChange={(event) => setProposalMessage(event.target.value)} required /></label>
        {error && <p className="form-error full">{error}</p>}
        {!!suggestions.length && <div className={`${styles.slotSuggestions} full`}><strong>Horarios alternativos disponibles</strong><div>{suggestions.map((slot) => <button type="button" key={`${slot.date}-${slot.time}`} onClick={() => { setProposedDate(slot.date); setProposedTime(slot.time); setError(""); }}>{slot.time}</button>)}</div><small>Selecciona una alternativa para completar automáticamente la hora.</small></div>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setAction(null)}>Cancelar</Button><Button type="submit">Enviar propuesta</Button></div>
      </form>
    </Modal>
  </>;
}
