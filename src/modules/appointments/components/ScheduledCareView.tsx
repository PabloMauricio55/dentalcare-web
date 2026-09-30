"use client";

import { FileDown, FolderOpen, Printer, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ActionNotice, Button, DataTable, LoadingState, PageHeader, RoleAccessNotice, StatusBadge, type Column } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import type { AdministrativeAppointment } from "../models/administrative-appointment";
import { useAdministrativeAppointments } from "../hooks/use-administrative-appointments";
import { appointmentExportService } from "../services/appointment-export.service";
import { formatLongDate } from "../services/agenda-date.service";
import styles from "./agenda.module.css";

function localDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeOf(value: string) {
  return new Intl.DateTimeFormat("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export function ScheduledCareView() {
  const router = useRouter();
  const { role } = useApp();
  const [notice, setNotice] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => localDate(new Date()));
  const [professionalId, setProfessionalId] = useState("");
  const [knownProfessionals, setKnownProfessionals] = useState<AdministrativeAppointment["professional"][]>([]);
  const enabled = role !== "Cajero";
  const canOpenClinicalRecord = role === "Administrador" || role === "Odontólogo" || role === "Asistente";
  const filters = useMemo(() => ({
    from: new Date(`${selectedDate}T00:00:00`).toISOString(),
    to: new Date(`${selectedDate}T23:59:59.999`).toISOString(),
    professionalId: professionalId || undefined,
    status: "SCHEDULED" as const,
    size: 100,
  }), [professionalId, selectedDate]);
  const { appointments, total, loading, error, reload } = useAdministrativeAppointments(filters, enabled);

  useEffect(() => {
    setKnownProfessionals((current) => Array.from(new Map([...current, ...appointments.map((item) => item.professional)].map((item) => [item.id, item])).values()));
  }, [appointments]);

  const columns: Column<AdministrativeAppointment>[] = [
    { key: "time", header: "Hora", cell: (row) => <strong>{timeOf(row.scheduledAt)}</strong> },
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{row.patient.name}</strong><small>{row.patient.code} · {row.patient.phone}</small></div> },
    { key: "professional", header: "Profesional", cell: (row) => <div className="cell-stack"><strong>{row.professional.name}</strong><small>ID: {row.professional.id}</small></div> },
    { key: "status", header: "Estado", cell: () => <StatusBadge status="Programada" /> },
    { key: "action", header: "Acción", cell: (row) => canOpenClinicalRecord ? <Button variant="secondary" onClick={() => router.push(`/expediente/${row.patient.id}`)}><FolderOpen size={16} /> Abrir expediente</Button> : <small>Consulta de agenda</small> },
  ];
  const print = () => { setNotice("Vista de impresión preparada con los datos reales visibles."); window.print(); };
  const exportCsv = () => { appointmentExportService.downloadAdministrativeCsv(appointments, { date: selectedDate, professional: knownProfessionals.find((item) => item.id === professionalId)?.name ?? "Todos" }); setNotice(`Se exportaron ${appointments.length} atenciones programadas.`); };

  if (!enabled) return <><PageHeader title="Atenciones programadas" description="Jornada obtenida desde la agenda real" /><RoleAccessNotice role={role}>El backend no permite que Caja consulte las citas administrativas.</RoleAccessNotice></>;

  return <>
    <div className={styles.screenOnly}>
      <PageHeader title="Atenciones programadas" description="Citas en estado SCHEDULED obtenidas directamente de dentalcare-api." actions={<><Button variant="ghost" onClick={print} disabled={!appointments.length}><Printer size={17} /> Imprimir jornada</Button><Button variant="secondary" onClick={exportCsv} disabled={!appointments.length}><FileDown size={17} /> Exportar CSV</Button></>} />
      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
      {error && <div className={styles.errorNotice} role="alert"><span>{error}</span><Button variant="secondary" onClick={reload}><RefreshCw size={16} /> Reintentar</Button></div>}
      <section className="card"><div className={styles.operationalFilters}><label className="compact-field"><span>Fecha</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label><label className="compact-field"><span>Profesional</span><select value={professionalId} onChange={(event) => setProfessionalId(event.target.value)}><option value="">Todos</option>{knownProfessionals.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><p>{total} atenciones programadas</p></div>{loading ? <LoadingState rows={5} /> : !error && <DataTable columns={columns} rows={appointments} emptyMessage="No hay atenciones programadas reales para los filtros seleccionados." />}</section>
    </div>

    <section className={styles.printSheet} aria-label="Jornada real filtrada para impresión">
      <header className={styles.printHeader}><div><span>DentalCare</span><strong>Clínica odontológica</strong></div><div><h1>Jornada de atenciones programadas</h1><p>{formatLongDate(selectedDate)}</p></div></header>
      <div className={styles.printSummary}><p><span>Profesional</span><strong>{knownProfessionals.find((item) => item.id === professionalId)?.name ?? "Todos"}</strong></p><p><span>Total de atenciones</span><strong>{appointments.length}</strong></p></div>
      {appointments.length ? <table className={styles.printTable}><thead><tr><th>Hora</th><th>Paciente</th><th>Código</th><th>Teléfono</th><th>Profesional</th><th>Estado</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td>{timeOf(appointment.scheduledAt)}</td><td><strong>{appointment.patient.name}</strong></td><td>{appointment.patient.code}</td><td>{appointment.patient.phone}</td><td>{appointment.professional.name}</td><td>Programada</td></tr>)}</tbody></table> : <div className={styles.printEmpty}><strong>Sin atenciones programadas</strong><p>No existen resultados reales para los filtros seleccionados.</p></div>}
      <footer className={styles.printFooter}>Documento operativo generado desde DentalCare · {formatLongDate(selectedDate)}</footer>
    </section>
  </>;
}
