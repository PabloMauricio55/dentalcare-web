"use client";

import { FormEvent, useState } from "react";
import { CalendarCheck2, CalendarDays, CalendarPlus, CheckCircle2, ClipboardList, Clock3, Download, FileText, HeartPulse, LayoutDashboard, LogOut, MapPin, Menu, ReceiptText, ShieldCheck, Stethoscope, Timer, UserRound, WalletCards, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, EmptyState } from "@/shared/components";
import { AppointmentRequest, PatientAppointment } from "../data/appointments.mock";
import { usePatientAppointments } from "../hooks/usePatientAppointments";
import { BudgetsView, TreatmentsView } from "./TreatmentsBudgetsView";
import styles from "./patient-portal.module.css";

type Section = "summary" | "appointments" | "treatments" | "estimates" | "prescriptions" | "checkups" | "account" | "documents" | "health" | "profile";
type RequestMode = "new" | "reschedule";

const patient = { name: "María López", initials: "ML", since: "Paciente desde 2022" };
const navItems = [
  { id: "summary", label: "Resumen", icon: LayoutDashboard }, { id: "appointments", label: "Mis citas", icon: CalendarDays },
  { id: "treatments", label: "Tratamientos", icon: Stethoscope }, { id: "estimates", label: "Presupuestos", icon: ClipboardList },
  { id: "prescriptions", label: "Recetas", icon: ReceiptText }, { id: "checkups", label: "Próximos controles", icon: CalendarCheck2 },
  { id: "account", label: "Estado de cuenta", icon: WalletCards }, { id: "documents", label: "Documentos", icon: FileText }, { id: "health", label: "Mi salud", icon: HeartPulse },
] as const;

const summaries = [
  { label: "Tratamientos", value: "2 activos", detail: "Plan de ortodoncia en seguimiento", icon: Stethoscope, tone: "teal" },
  { label: "Presupuestos", value: "1 pendiente", detail: "Disponible para tu revisión", icon: ClipboardList, tone: "amber" },
  { label: "Recetas", value: "Sin recetas", detail: "No tienes indicaciones activas", icon: ReceiptText, tone: "blue" },
  { label: "Estado de cuenta", value: "Sin deuda", detail: "Tus pagos están al día", icon: WalletCards, tone: "green" },
];

export function PatientPortalDashboard() {
  const pathname = usePathname();
  const [preview, setPreview] = useState<Section>("summary");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const appointmentStore = usePatientAppointments();
  const section: Section = pathname.endsWith("/citas") ? "appointments" : pathname.endsWith("/controles") ? "checkups" : pathname.endsWith("/tratamientos") ? "treatments" : pathname.endsWith("/presupuestos") ? "estimates" : preview;
  const isSummary = section === "summary";
  const title = section === "appointments" ? "Mis citas" : section === "checkups" ? "Próximos controles" : section === "treatments" ? "Tratamientos" : section === "estimates" ? "Presupuestos" : isSummary ? "Resumen" : "Próximamente";
  const notify = (message: string) => setNotice(message);
  const select = (item: Section) => { setPreview(item); setMenuOpen(false); };

  return <div className={styles.shell}>
    {menuOpen && <button className={styles.overlay} type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`} aria-label="Navegación del portal">
      <div className={styles.brandRow}><Link href="/" className={styles.brand}><HeartPulse size={21} aria-hidden="true" />DentalCare</Link><button type="button" className={styles.close} aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
      <nav>{navItems.map(({ id, label, icon: Icon }) => id === "summary" || id === "appointments" || id === "checkups" || id === "treatments" || id === "estimates" ? <Link key={id} href={id === "summary" ? "/portal" : id === "appointments" ? "/portal/citas" : id === "checkups" ? "/portal/controles" : id === "treatments" ? "/portal/tratamientos" : "/portal/presupuestos"} className={section === id ? styles.active : ""} aria-current={section === id ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link> : <button key={id} type="button" className={section === id ? styles.active : ""} onClick={() => select(id)}><Icon size={18} aria-hidden="true" /><span>{label}</span><small>Próximamente</small></button>)}</nav>
      <div className={styles.sidebarFooter}><button type="button" onClick={() => select("profile")}><UserRound size={18} aria-hidden="true" /><span>Perfil</span><small>Próximamente</small></button><Link href="/login"><LogOut size={18} aria-hidden="true" />Cerrar sesión</Link></div>
    </aside>
    <div className={styles.body}>
      <header><button type="button" className={styles.menu} aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div><small>Portal del paciente</small><strong>{title}</strong></div><div className={styles.identity}><span><strong>{patient.name}</strong><small>{patient.since}</small></span><b aria-hidden="true">{patient.initials}</b></div></header>
      <main>
        {notice && <div className={styles.notice} role="status"><CheckCircle2 size={18} aria-hidden="true" /><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Cerrar aviso">×</button></div>}
        {section === "appointments" ? <Appointments notify={notify} store={appointmentStore} /> : section === "checkups" ? <Controls notify={notify} store={appointmentStore} /> : section === "treatments" ? <TreatmentsView /> : section === "estimates" ? <BudgetsView notify={notify} /> : !isSummary ? <section className={styles.coming}><span><CalendarPlus size={30} aria-hidden="true" /></span><h1>Esta sección estará disponible próximamente</h1><p>Por ahora puedes consultar el resumen de tu atención.</p><Button type="button" onClick={() => select("summary")}>Volver al resumen</Button></section> : <Summary appointment={appointmentStore.appointments[0]} confirmed={confirmed} notify={notify} onConfirm={() => setConfirmed(true)} />}
      </main>
    </div>
  </div>;
}

function Summary({ appointment, confirmed, notify, onConfirm }: { appointment: PatientAppointment; confirmed: boolean; notify: (message: string) => void; onConfirm: () => void }) {
  return <div className={styles.dashboard}>
    <section className={styles.welcome}><div><p>Tu espacio de cuidado dental</p><h1>Hola, María</h1><span>Encuentra lo importante de tu atención sin demasiada información.</span></div><div className={styles.quick}><Link href="/portal/citas" className={styles.primaryLink}><CalendarPlus size={17} aria-hidden="true" />Solicitar cita</Link><Button variant="secondary" type="button" onClick={() => notify("El formulario impreso estará disponible próximamente.")}><Download size={17} aria-hidden="true" />Formulario impreso</Button></div></section>
    <AppointmentCard appointment={appointment} confirmed={confirmed} notify={notify} onConfirm={onConfirm} />
    <section><div className={styles.heading}><h2>Tu resumen</h2><p>Información principal de tu atención actual.</p></div><div className={styles.summary}>{summaries.map(({ label, value, detail, icon: Icon, tone }) => <article key={label} className={styles[tone]}><span><Icon size={20} aria-hidden="true" /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>)}</div></section>
  </div>;
}

function AppointmentCard({ appointment, confirmed, notify, onConfirm, onReschedule }: { appointment: PatientAppointment; confirmed: boolean; notify: (message: string) => void; onConfirm: () => void; onReschedule?: () => void }) {
  const status = confirmed ? "Asistencia confirmada" : appointment.status === "Pendiente" ? "Pendiente de confirmación" : appointment.status;
  return <article className={styles.appointment}><div className={styles.appointmentLead}><div className={styles.date}><strong>18</strong><span>SEP</span></div><div><p>Próxima cita</p><h2>{appointment.title}</h2><span><Clock3 size={15} aria-hidden="true" />{appointment.dateLabel} · 40 min</span><span><Stethoscope size={15} aria-hidden="true" />{appointment.professional} · Consultorio por confirmar</span><span><MapPin size={15} aria-hidden="true" />Sucursal Central, Zona 10</span></div></div><div className={styles.appointmentActions}><small className={confirmed ? styles.confirmed : styles.pending}>{status}</small><Button type="button" disabled={confirmed} onClick={() => { onConfirm(); notify("Tu asistencia fue confirmada. Recibirás un recordatorio antes de la cita."); }}>Confirmar asistencia</Button>{onReschedule && <button type="button" className={styles.linkButton} onClick={onReschedule}>Reprogramar cita</button>}</div></article>;
}

function AppointmentRequestForm({ mode, onClose, onSubmit }: { mode: RequestMode; onClose: () => void; onSubmit: (request: AppointmentRequest) => void }) {
  const [service, setService] = useState(mode === "reschedule" ? "Control de ortodoncia" : "Limpieza preventiva");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ service, branch: "Sucursal Central", preferredDate: date, preferredTime: time });
  };
  return <section className={styles.requestForm} aria-labelledby="request-title"><div><p>Solicitud de cita</p><h2 id="request-title">{mode === "reschedule" ? "Reprograma tu cita" : "Agenda una nueva cita"}</h2><span>Elige tu preferencia. Te confirmaremos la disponibilidad antes de reservar.</span></div><form onSubmit={submit}><label>Servicio<select value={service} onChange={(event) => setService(event.target.value)}><option>Control de ortodoncia</option><option>Limpieza preventiva</option><option>Evaluación general</option><option>Revisión periodontal</option></select></label><label>Sucursal<select defaultValue="Sucursal Central"><option>Sucursal Central</option><option>Sucursal Norte</option></select></label><label>Fecha preferida<input type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Horario preferido<select required value={time} onChange={(event) => setTime(event.target.value)}><option value="" disabled>Selecciona un horario</option><option>8:30 a. m.</option><option>10:30 a. m.</option><option>2:00 p. m.</option><option>4:30 p. m.</option></select></label><label className={styles.notes}>Motivo o comentario<textarea rows={3} placeholder="Ej. prefiero atención después de las 2:00 p. m." /></label><div className={styles.formActions}><button type="button" className={styles.linkButton} onClick={onClose}>Cancelar</button><Button type="submit">{mode === "reschedule" ? "Solicitar reprogramación" : "Enviar solicitud"}</Button></div></form></section>;
}

function Appointments({ notify, store }: { notify: (message: string) => void; store: ReturnType<typeof usePatientAppointments> }) {
  const [mode, setMode] = useState<RequestMode | null>(null);
  const [confirmedAppointmentId, setConfirmedAppointmentId] = useState<string | null>(null);
  const appointment = store.appointments[0];
  const confirmed = confirmedAppointmentId === appointment?.id;
  const setConfirmed = (_value = true) => setConfirmedAppointmentId(appointment?.id ?? null);
  const submitRequest = async (request: AppointmentRequest) => { if (mode === "reschedule") { await store.reschedule(appointment.id, request); notify("Reprogramación solicitada. La nueva fecha ya aparece como pendiente de confirmación."); } else { await store.create(request); notify("Solicitud creada. Ya aparece en tus citas como pendiente de confirmación."); } setMode(null); };
  return <section className={styles.view}><div className={styles.viewHead}><div><h1>Mis citas</h1><p>Gestiona tus visitas y revisa las atenciones anteriores.</p></div><Button type="button" onClick={() => setMode("new")}><CalendarPlus size={17} aria-hidden="true" />Agendar nueva cita</Button></div>{mode && <AppointmentRequestForm mode={mode} onClose={() => setMode(null)} onSubmit={submitRequest} />}{!appointment ? <EmptyState title="No tienes citas próximas" description="Cuando envíes una solicitud aparecerá aquí." /> : <><AppointmentCard appointment={appointment} confirmed={confirmed} notify={notify} onConfirm={() => { setConfirmed(true); store.confirm(appointment.id); }} onReschedule={() => setMode("reschedule")} /><section className={styles.appointmentMeta}><article><Clock3 size={19} aria-hidden="true" /><div><strong>Antes de asistir</strong><span>Llega 10 minutos antes y trae tus alineadores.</span></div></article><article><MapPin size={19} aria-hidden="true" /><div><strong>Cómo llegar</strong><span>Edificio DentalCare, nivel 2 · Parqueo disponible.</span></div></article><article><ReceiptText size={19} aria-hidden="true" /><div><strong>Pago estimado</strong><span>Tu plan actual cubre este control.</span></div></article></section><section className={styles.history}><div className={styles.sectionHeading}><div><h2>Historial de citas</h2><p>Últimas atenciones registradas.</p></div><span>{store.history.length} registros</span></div>{store.history.map((item) => <article key={item.id}><time>{item.date}</time><div><strong>{item.service}</strong><span>{item.professional} · {item.detail}</span></div><small className={item.status === "Completada" ? styles.confirmed : styles.pending}>{item.status}</small></article>)}</section></>}</section>;
}

function Controls({ notify, store }: { notify: (message: string) => void; store: ReturnType<typeof usePatientAppointments> }) {
  const [mode, setMode] = useState<RequestMode | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const isEmpty = store.appointments.length === 0;
  const nextControl = store.appointments[0];
  const controls = store.appointments;
  const submitRequest = async (request: AppointmentRequest) => { if (mode === "reschedule") { await store.reschedule(nextControl.id, request); notify("Reprogramación solicitada. El cronograma ya muestra la nueva fecha pendiente de confirmación."); } else { await store.create(request); notify("Solicitud creada. El nuevo control aparece en el cronograma como pendiente."); } setMode(null); };

  return <section className={styles.view}><div className={styles.viewHead}><div><h1>Próximos controles</h1><p>Mantén tu sonrisa saludable: revisa tus controles y programa los pendientes.</p></div><Button type="button" onClick={() => setMode("new")}><CalendarPlus size={17} aria-hidden="true" />Programar control</Button></div>{mode && <AppointmentRequestForm mode={mode} onClose={() => setMode(null)} onSubmit={submitRequest} />}{isEmpty ? <EmptyState title="No tienes controles próximos" description="Tu equipo dental te avisará cuando debas programar uno." /> : <><section className={styles.controlHero}><article className={styles.nextControl}><div className={styles.controlEyebrow}><span><i />Próxima cita</span><small><Clock3 size={15} aria-hidden="true" />En 14 días</small></div><h2>{nextControl.title}</h2><p>{nextControl.detail} Te recomendamos llegar 10 minutos antes.</p><div className={styles.controlFacts}><span><CalendarDays size={18} aria-hidden="true" /><b>Fecha</b><em>{nextControl.dateLabel}</em></span><span><Clock3 size={18} aria-hidden="true" /><b>Duración</b><em>40 minutos</em></span><span><Stethoscope size={18} aria-hidden="true" /><b>Especialista</b><em>{nextControl.professional}</em></span></div><div className={styles.controlActions}><Button type="button" disabled={confirmed} onClick={() => { setConfirmed(true); notify("Asistencia confirmada. Te enviaremos un recordatorio 24 horas antes."); }}>{confirmed ? "Asistencia confirmada" : "Confirmar asistencia"}</Button><Button variant="secondary" type="button" onClick={() => setMode("reschedule")}>Reprogramar</Button></div></article><aside className={styles.countdown}><Timer size={42} aria-hidden="true" /><span>Faltan</span><strong>14 : 08 : 45</strong><small>Días&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Hrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Min</small><p>Te recordaremos esta cita antes de tu visita.</p></aside></section><div className={styles.controlLayout}><section className={styles.timeline}><div className={styles.sectionHeading}><div><h2>Cronograma anual</h2><p>Tus revisiones preventivas y de seguimiento.</p></div></div>{controls.map((item, index) => <article key={item.id}><i className={index === 0 ? styles.timelineActive : ""} /><div><small>{item.status === "Pendiente" ? "Por programar" : item.dateLabel}</small><h3>{item.title}</h3><p>{item.detail}</p><span><Stethoscope size={15} aria-hidden="true" />{item.professional}</span>{item.status === "Pendiente" ? <button type="button" className={styles.linkButton} onClick={() => setMode("new")}>Solicitar cita</button> : <button type="button" className={styles.linkButton} onClick={() => notify("Las indicaciones de " + item.title + " están disponibles para revisión.")}>Ver indicaciones</button>}</div></article>)}</section><aside className={styles.prevention}><span><ShieldCheck size={24} aria-hidden="true" /></span><p>Salud preventiva</p><h2>La importancia del control</h2><div>Los controles semestrales permiten detectar señales tempranas y evitar tratamientos más complejos.</div><ul><li>Prevención de caries incipientes</li><li>Detección de gingivitis y placa oculta</li><li>Seguimiento de tus tratamientos activos</li></ul><section><strong>75%</strong><span>Constancia</span><p>Has asistido a 3 de 4 controles recomendados este año.</p></section></aside></div></>}</section>;
}
