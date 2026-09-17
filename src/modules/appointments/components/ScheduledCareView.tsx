"use client";

import { FileDown, PlayCircle, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ActionNotice, Button, DataTable, PageHeader, StatusBadge, type Column } from "@/shared/components";
import type { Appointment } from "../models/appointment";
import { DEMO_TODAY } from "../services/agenda-date.service";
import { appointmentExportService } from "../services/appointment-export.service";
import { appointmentFlowService } from "../services/appointment-flow.service";
import { useClinicSession } from "./ClinicSessionProvider";
import styles from "./agenda.module.css";

export function ScheduledCareView() {
  const router = useRouter();
  const { appointments, patients, selectPatient, updateAppointment } = useClinicSession();
  const [notice, setNotice] = useState("");
  const [selectedDate, setSelectedDate] = useState(DEMO_TODAY);
  const [professional, setProfessional] = useState("Todos");
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const professionals = useMemo(
    () => Array.from(new Set(appointments.map((item) => item.professional))).sort(),
    [appointments],
  );
  const filteredAppointments = appointments
    .filter((item) => item.date === selectedDate && !["Solicitada", "Rechazada"].includes(item.status))
    .filter((item) => professional === "Todos" || item.professional === professional)
    .sort((left, right) => left.time.localeCompare(right.time));
  const continueFlow = (appointment: Appointment) => {
    const action = appointmentFlowService.actionFor(appointment);
    if (!action) return;
    selectPatient(appointment.patientId);
    updateAppointment(appointmentFlowService.advance(appointment, action));
    router.push(action.route);
  };
  const columns: Column<Appointment>[] = [
    { key: "time", header: "Hora", cell: (row) => <strong>{row.time}</strong> },
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{patientName(row.patientId)}</strong><small>{patients.find((p) => p.id === row.patientId)?.code}</small></div> },
    { key: "attention", header: "Atención prevista", cell: (row) => <div className="cell-stack"><span>{row.reason}</span><small>{row.duration} min · {row.professional}</small></div> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "action", header: "Siguiente paso", cell: (row) => { const action = appointmentFlowService.actionFor(row); return action ? <Button variant="secondary" onClick={() => continueFlow(row)}><PlayCircle size={16} />{action.label}</Button> : <span className="cell-stack"><small>Sin acción operativa</small></span>; } },
  ];
  const print = () => { window.print(); setNotice("Se abrió la impresión de la jornada actual."); };
  const exportCsv = () => { appointmentExportService.downloadCsv(filteredAppointments, patientName, selectedDate); setNotice(`Se exportaron ${filteredAppointments.length} atenciones de la jornada.`); };
  return <><PageHeader title="Atenciones programadas" description="Lista operativa de la jornada: paciente, motivo, profesional, estado y siguiente acción." actions={<><Button variant="ghost" onClick={print}><Printer size={17} /> Imprimir jornada</Button><Button variant="secondary" onClick={exportCsv} disabled={!filteredAppointments.length}><FileDown size={17} /> Exportar CSV</Button></>} />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="card"><div className={styles.operationalFilters}><label className="compact-field"><span>Fecha</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label><label className="compact-field"><span>Profesional</span><select value={professional} onChange={(event) => setProfessional(event.target.value)}><option>Todos</option>{professionals.map((item) => <option key={item}>{item}</option>)}</select></label><p>{filteredAppointments.length} atenciones visibles</p></div><DataTable columns={columns} rows={filteredAppointments} emptyMessage="No hay atenciones para los filtros seleccionados." /></section></>;
}
