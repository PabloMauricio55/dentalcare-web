"use client";

import { Ban, CalendarCheck, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button, EmptyState, LoadingState, PageHeader, RoleAccessNotice, StatCard, StatusBadge } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { useAdministrativeAppointments } from "../hooks/use-administrative-appointments";

function localDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeOf(value: string) {
  return new Intl.DateTimeFormat("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export function DashboardView() {
  const { role } = useApp();
  const today = localDate(new Date());
  const enabled = role !== "Cajero";
  const { appointments, total, loading, error, reload } = useAdministrativeAppointments({
    from: new Date(`${today}T00:00:00`).toISOString(),
    to: new Date(`${today}T23:59:59.999`).toISOString(),
    size: 100,
  }, enabled);
  const scheduled = appointments.filter((item) => item.status === "scheduled");
  const completed = appointments.filter((item) => item.status === "completed");
  const cancelled = appointments.filter((item) => item.status === "cancelled");
  const upcoming = [...scheduled].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt)).slice(0, 4);
  const dateLabel = new Intl.DateTimeFormat("es-GT", { dateStyle: "long" }).format(new Date(`${today}T12:00:00`));

  if (!enabled) return <div className="page-stack"><PageHeader title="Panel de inicio" description="Resumen operativo de la clínica" /><RoleAccessNotice role={role}>El backend no permite que Caja consulte la agenda administrativa.</RoleAccessNotice></div>;

  return <div className="page-stack">
    <PageHeader title="Buenos días, Daniel" description={`Resumen real de citas para ${dateLabel}.`} />
    {error && <div role="alert" className="role-access-notice"><span><RefreshCw size={21} /></span><div><strong>No se pudo cargar el resumen</strong><p>{error}</p><Button variant="secondary" onClick={reload}>Reintentar</Button></div></div>}
    <div className="stats-grid">
      <StatCard label="Citas del día" value={loading ? "—" : total} helper="Total devuelto por la API" icon={CalendarCheck} />
      <StatCard label="Programadas" value={loading ? "—" : scheduled.length} helper="Pendientes de realizar" icon={Clock3} tone="blue" />
      <StatCard label="Completadas" value={loading ? "—" : completed.length} helper="Finalizadas hoy" icon={CheckCircle2} tone="green" />
      <StatCard label="Canceladas" value={loading ? "—" : cancelled.length} helper="Canceladas hoy" icon={Ban} tone="amber" />
    </div>
    <div className="dashboard-columns">
      <section className="card">
        <div className="card-heading"><div><h3>Próximas atenciones programadas</h3><p>Información obtenida de dentalcare-api</p></div><Link className="button button-secondary" href="/agenda/general">Ver agenda</Link></div>
        {loading ? <LoadingState rows={4} /> : upcoming.length ? <div className="schedule-list">{upcoming.map((item) => <article key={item.id}><time>{timeOf(item.scheduledAt)}</time><span className="patient-avatar">{item.patient.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><strong>{item.patient.name}</strong><small>{item.professional.name}</small></div><StatusBadge status="Programada" /></article>)}</div> : !error && <EmptyState title="Sin citas programadas" description="No existen próximas atenciones para hoy." />}
      </section>
      <aside className="card priority-list"><div className="card-heading"><div><h3>Accesos rápidos</h3><p>Funciones disponibles con el contrato actual</p></div></div><Link href="/agenda/atenciones"><strong>{scheduled.length}</strong><span>Atenciones programadas</span></Link><Link href="/agenda/general"><strong>{completed.length}</strong><span>Citas completadas hoy</span></Link><Link href="/agenda/general"><strong>{cancelled.length}</strong><span>Citas canceladas hoy</span></Link></aside>
    </div>
  </div>;
}
