"use client";

import { useState } from "react";
import { CalendarCheck2, CalendarDays, CalendarPlus, CheckCircle2, ClipboardList, Clock3, Download, FileText, HeartPulse, LayoutDashboard, LogOut, MapPin, Menu, ReceiptText, Stethoscope, UserRound, WalletCards, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components";
import styles from "./patient-portal.module.css";

type Section = "summary" | "appointments" | "treatments" | "estimates" | "prescriptions" | "checkups" | "account" | "documents" | "health" | "profile";
type NavItem = { id: Section; label: string; icon: typeof LayoutDashboard };

const patient = { name: "María López", initials: "ML", since: "Paciente desde 2022" };
const navItems: NavItem[] = [
  { id: "summary", label: "Resumen", icon: LayoutDashboard }, { id: "appointments", label: "Mis citas", icon: CalendarDays },
  { id: "treatments", label: "Tratamientos", icon: Stethoscope }, { id: "estimates", label: "Presupuestos", icon: ClipboardList },
  { id: "prescriptions", label: "Recetas", icon: ReceiptText }, { id: "checkups", label: "Próximos controles", icon: CalendarCheck2 },
  { id: "account", label: "Estado de cuenta", icon: WalletCards }, { id: "documents", label: "Documentos", icon: FileText }, { id: "health", label: "Mi salud", icon: HeartPulse },
];
const summaries = [
  { label: "Tratamientos", value: "2 activos", detail: "Plan de ortodoncia en seguimiento", icon: Stethoscope, tone: "teal" },
  { label: "Presupuestos", value: "1 pendiente", detail: "Disponible para tu revisión", icon: ClipboardList, tone: "amber" },
  { label: "Recetas", value: "Sin recetas", detail: "No tienes indicaciones activas", icon: ReceiptText, tone: "blue" },
  { label: "Estado de cuenta", value: "Sin deuda", detail: "Tus pagos están al día", icon: WalletCards, tone: "green" },
];

export function PatientPortalDashboard() {
  const [section, setSection] = useState<Section>("summary");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const select = (item: Section) => { setSection(item); setMenuOpen(false); };
  const notify = (message: string) => setNotice(message);
  const isSummary = section === "summary";

  return <div className={styles.shell}>
    {menuOpen && <button className={styles.overlay} type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`} aria-label="Navegación del portal">
      <div className={styles.brandRow}><Link href="/" className={styles.brand}><HeartPulse size={21} aria-hidden="true" />DentalCare</Link><button type="button" className={styles.close} aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
      <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={section === id ? styles.active : ""} aria-current={section === id ? "page" : undefined} onClick={() => select(id)}><Icon size={18} aria-hidden="true" /><span>{label}</span>{id !== "summary" && <small>Próximamente</small>}</button>)}</nav>
      <div className={styles.sidebarFooter}><button type="button" onClick={() => select("profile")}><UserRound size={18} aria-hidden="true" /><span>Perfil</span><small>Próximamente</small></button><Link href="/login"><LogOut size={18} aria-hidden="true" />Cerrar sesión</Link></div>
    </aside>
    <div className={styles.body}><header><button type="button" className={styles.menu} aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div><small>Portal del paciente</small><strong>{isSummary ? "Resumen" : "Próximamente"}</strong></div><div className={styles.identity}><span><strong>{patient.name}</strong><small>{patient.since}</small></span><b aria-hidden="true">{patient.initials}</b></div></header>
      <main>{!isSummary ? <section className={styles.coming}><span><CalendarPlus size={30} aria-hidden="true" /></span><h1>Esta sección estará disponible próximamente</h1><p>Por ahora puedes consultar el resumen de tu atención.</p><Button type="button" onClick={() => select("summary")}>Volver al resumen</Button></section> : <div className={styles.dashboard}>
        <section className={styles.welcome}><div><p>Tu espacio de cuidado dental</p><h1>Hola, María</h1><span>Encuentra lo importante de tu atención sin demasiada información.</span></div><div className={styles.quick}><Button type="button" onClick={() => notify("La solicitud de cita se registró de forma simulada.")}><CalendarPlus size={17} aria-hidden="true" />Solicitar cita</Button><Button variant="secondary" type="button" onClick={() => notify("El formulario impreso de demostración está listo para prepararse.")}><Download size={17} aria-hidden="true" />Formulario impreso</Button></div></section>
        {notice && <div className={styles.notice} role="status"><CheckCircle2 size={18} aria-hidden="true" /><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Cerrar aviso">×</button></div>}
        <section className={styles.appointment} aria-labelledby="appointment-title"><div className={styles.appointmentLead}><div className={styles.date}><strong>18</strong><span>SEP</span></div><div><p>Próxima cita</p><h2 id="appointment-title">Ortodoncia</h2><span><Clock3 size={15} aria-hidden="true" />Jueves 18 de septiembre · 10:30 a. m.</span><span><Stethoscope size={15} aria-hidden="true" />Dra. Andrea López</span><span><MapPin size={15} aria-hidden="true" />Sucursal Central · Zona 10</span></div></div><div className={styles.appointmentActions}><small className={confirmed ? styles.confirmed : styles.pending}>{confirmed ? "Asistencia confirmada" : "Por confirmar"}</small><Button type="button" disabled={confirmed} onClick={() => { setConfirmed(true); notify("Tu asistencia fue confirmada de forma simulada."); }}><CalendarCheck2 size={17} aria-hidden="true" />Confirmar asistencia</Button><button type="button" className={styles.linkButton} onClick={() => notify("La solicitud de reprogramación fue registrada de forma simulada.")}>Solicitar reprogramación</button></div></section>
        <section><div className={styles.heading}><h2>Tu resumen</h2><p>Información principal de tu atención actual.</p></div><div className={styles.summary}>{summaries.map(({ label, value, detail, icon: Icon, tone }) => <article key={label} className={styles[tone]}><span><Icon size={20} aria-hidden="true" /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>)}</div></section>
        <section className={styles.bottom}><article><span><HeartPulse size={22} aria-hidden="true" /></span><div><p>Mi salud</p><h2>Información al día</h2><small>Cuestionario actualizado el 14 de septiembre de 2026.</small></div><button type="button" className={styles.linkButton} onClick={() => notify("La actualización de salud estará disponible próximamente.")}>Ver estado</button></article><article><span><FileText size={22} aria-hidden="true" /></span><div><h2>Documentos</h2><small>No tienes documentos pendientes por revisar.</small></div><b>Todo al día</b></article></section>
      </div>}</main>
    </div>
  </div>;
}
