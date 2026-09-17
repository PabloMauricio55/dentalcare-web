"use client";

import { Download, LockKeyhole, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionNotice, Button, DataTable, PageHeader, SearchInput, StatCard, type Column } from "@/shared/components";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { AuditEntry } from "../models/settings";
import { settingsAuditExportService } from "../services/settings-audit-export.service";
import { useSettings } from "./SettingsProvider";

export function AuditView() {
  const { audit } = useSettings();
  const { appointmentAudit, patients } = useClinicSession();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const appointmentEntries: AuditEntry[] = useMemo(() => appointmentAudit.map((entry) => ({
    id: `appointment-${entry.id}`,
    date: new Date(entry.occurredAt).toLocaleString("es-GT"),
    user: "Personal de clínica",
    action: entry.action.toLocaleUpperCase("es"),
    module: "Agenda",
    detail: `${entry.appointmentId} · ${patients.find((patient) => patient.id === entry.patientId)?.name ?? "Paciente"} · ${entry.detail}`,
    origin: "Sesión clínica",
  })), [appointmentAudit, patients]);
  const combined = useMemo(() => [...appointmentEntries, ...audit], [appointmentEntries, audit]);
  const rows = useMemo(
    () => combined.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())),
    [combined, query],
  );
  const columns: Column<AuditEntry>[] = [
    { key: "date", header: "Fecha y hora", cell: (row) => <strong>{row.date}</strong> },
    { key: "user", header: "Usuario", cell: (row) => row.user },
    { key: "module", header: "Módulo", cell: (row) => row.module },
    { key: "action", header: "Acción", cell: (row) => <span className="audit-action">{row.action}</span> },
    { key: "detail", header: "Detalle", cell: (row) => row.detail },
    { key: "origin", header: "Origen", cell: (row) => row.origin },
  ];
  const exportCsv = () => {
    settingsAuditExportService.downloadCsv(rows, query);
    setNotice(`Se exportaron ${rows.length} eventos con el filtro visible.`);
  };

  return <>
    <PageHeader title="Seguridad y auditoría" description="Registro dinámico de usuarios, permisos, clínica, procedimientos, accesos de pacientes y citas." actions={<Button variant="secondary" onClick={exportCsv}><Download size={17} /> Exportar CSV</Button>} />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <div className="stats-grid"><StatCard label="Eventos visibles" value={rows.length} helper="Según la búsqueda actual" icon={LockKeyhole} /><StatCard label="Intentos bloqueados" value="1" helper="Dato simulado de seguridad" icon={ShieldAlert} tone="amber" /></div>
    <section className="card security-settings"><div><h3>Política de acceso del prototipo</h3><p>Contraseña temporal, cambio obligatorio al primer ingreso y bloqueo simulado después de cinco intentos fallidos.</p></div><div className="policy-grid"><label><span>Duración de sesión</span><select><option>8 horas</option><option>4 horas</option><option>12 horas</option></select></label><label><span>Intentos antes de bloqueo</span><select><option>5 intentos</option><option>3 intentos</option></select></label></div></section>
    <section className="card patient-search-card"><SearchInput value={query} onChange={setQuery} placeholder="Buscar por usuario, acción, módulo, detalle u origen..." /><span>{rows.length} eventos</span></section>
    <section className="card management-table-card"><DataTable columns={columns} rows={rows} /></section>
  </>;
}
