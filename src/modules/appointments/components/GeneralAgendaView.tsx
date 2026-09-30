"use client";

import { Ban, CalendarCheck, CalendarClock, CalendarPlus, ChevronLeft, ChevronRight, Eye, RefreshCw } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, EmptyState, LoadingState, Modal, PageHeader, RoleAccessNotice, StatusBadge } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { ApiError } from "@/shared/lib/api-client";
import type { AdministrativeAppointment, AdministrativeAppointmentStatus } from "../models/administrative-appointment";
import { administrativeAppointmentService } from "../services/administrative-appointment.service";
import { formatLongDate, formatMonth, formatShortDate, isSameMonth, monthDates, shiftDate, weekDates } from "../services/agenda-date.service";
import styles from "./agenda.module.css";

type AgendaView = "day" | "week" | "month";
type AgendaModal = "schedule" | "detail" | "reschedule" | null;
type PendingStatus = "COMPLETED" | "CANCELLED" | null;

const viewLabels: Record<AgendaView, string> = { day: "Día", week: "Semana", month: "Mes" };
const statusLabels: Record<AdministrativeAppointmentStatus, string> = { scheduled: "Programada", completed: "Completada", cancelled: "Cancelada" };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function localDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function appointmentDate(value: string) { return localDate(new Date(value)); }

function appointmentTime(value: string) {
  return new Intl.DateTimeFormat("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function toInstant(date: string, time: string) { return new Date(`${date}T${time}:00`).toISOString(); }

function rangeFor(view: AgendaView, selectedDate: string) {
  const dates = view === "day" ? [selectedDate] : view === "week" ? weekDates(selectedDate) : monthDates(selectedDate);
  return {
    from: new Date(`${dates[0]}T00:00:00`).toISOString(),
    to: new Date(`${dates[dates.length - 1]}T23:59:59.999`).toISOString(),
  };
}

function readableError(error: unknown) {
  if (!(error instanceof ApiError)) return "No fue posible completar la operación. Inténtalo nuevamente.";
  const details = Object.values(error.fieldErrors);
  return details.length ? `${error.message} ${details.join(" ")}` : error.message;
}

export function GeneralAgendaView({ initialPatientId = "", openSchedule = false }: { initialPatientId?: string; openSchedule?: boolean }) {
  const { role } = useApp();
  const [selectedDate, setSelectedDate] = useState(() => localDate(new Date()));
  const [view, setView] = useState<AgendaView>("day");
  const [patientId, setPatientId] = useState(initialPatientId);
  const [professionalId, setProfessionalId] = useState("");
  const [status, setStatus] = useState("");
  const [appointments, setAppointments] = useState<AdministrativeAppointment[]>([]);
  const [patientOptions, setPatientOptions] = useState<AdministrativeAppointment["patient"][]>([]);
  const [professionalOptions, setProfessionalOptions] = useState<AdministrativeAppointment["professional"][]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<AgendaModal>(openSchedule && (role === "Administrador" || role === "Secretaría") ? "schedule" : null);
  const [active, setActive] = useState<AdministrativeAppointment | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PendingStatus>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const canRead = role !== "Cajero";
  const canManageSchedule = role === "Administrador" || role === "Secretaría";
  const canUpdateStatus = role !== "Cajero";
  const visibleDates = useMemo(() => view === "week" ? weekDates(selectedDate) : monthDates(selectedDate), [selectedDate, view]);
  const invalidPatientFilter = patientId !== "" && !uuidPattern.test(patientId);
  const invalidProfessionalFilter = professionalId !== "" && !uuidPattern.test(professionalId);

  const loadAppointments = useCallback(async (signal?: AbortSignal) => {
    if (!canRead || invalidPatientFilter || invalidProfessionalFilter) {
      setAppointments([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const page = await administrativeAppointmentService.list({
        ...rangeFor(view, selectedDate),
        patientId: patientId || undefined,
        professionalId: professionalId || undefined,
        status: status ? status as "SCHEDULED" | "COMPLETED" | "CANCELLED" : undefined,
        page: 0,
        size: 100,
      }, signal);
      setAppointments(page.content);
      setTotal(page.totalElements);
      setPatientOptions((current) => mergeById(current, page.content.map((item) => item.patient)));
      setProfessionalOptions((current) => mergeById(current, page.content.map((item) => item.professional)));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setAppointments([]);
      setTotal(0);
      setLoadError(readableError(error));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [canRead, invalidPatientFilter, invalidProfessionalFilter, patientId, professionalId, selectedDate, status, view]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadAppointments(controller.signal), 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [loadAppointments, reloadKey]);

  const appointmentsFor = (date: string) => appointments.filter((item) => appointmentDate(item.scheduledAt) === date);
  const selectedItems = appointmentsFor(selectedDate);
  const description = view === "day" ? formatLongDate(selectedDate) : view === "week" ? `${formatShortDate(visibleDates[0])} – ${formatShortDate(visibleDates[6])}` : formatMonth(selectedDate);

  const closeModal = () => {
    if (busy) return;
    setModal(null);
    setFormError("");
  };

  const openDetail = async (appointment: AdministrativeAppointment) => {
    setActive(appointment);
    setModal("detail");
    setDetailLoading(true);
    setFormError("");
    try { setActive(await administrativeAppointmentService.findById(appointment.id)); }
    catch (error) { setFormError(readableError(error)); }
    finally { setDetailLoading(false); }
  };

  const submitNew = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const nextPatientId = String(data.get("patientId") ?? "").trim();
    const nextProfessionalId = String(data.get("professionalId") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    if (!uuidPattern.test(nextPatientId) || !uuidPattern.test(nextProfessionalId) || !date || !time) {
      setFormError("Ingresa identificadores UUID válidos y selecciona la fecha y hora.");
      return;
    }
    setBusy(true);
    setFormError("");
    try {
      const created = await administrativeAppointmentService.create({ patientId: nextPatientId, professionalId: nextProfessionalId, scheduledAt: toInstant(date, time) });
      setSelectedDate(appointmentDate(created.scheduledAt));
      setModal(null);
      setNotice("La cita se guardó correctamente en DentalCare API.");
      setReloadKey((key) => key + 1);
    } catch (error) { setFormError(readableError(error)); }
    finally { setBusy(false); }
  };

  const submitReschedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active || busy) return;
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    if (!date || !time) { setFormError("Selecciona la nueva fecha y hora."); return; }
    setBusy(true);
    setFormError("");
    try {
      const updated = await administrativeAppointmentService.reschedule(active.id, { scheduledAt: toInstant(date, time) });
      setSelectedDate(appointmentDate(updated.scheduledAt));
      setActive(updated);
      setModal(null);
      setNotice("La cita se reprogramó correctamente.");
      setReloadKey((key) => key + 1);
    } catch (error) { setFormError(readableError(error)); }
    finally { setBusy(false); }
  };

  const confirmStatusChange = async () => {
    if (!active || !pendingStatus || busy) return;
    setBusy(true);
    try {
      await administrativeAppointmentService.updateStatus(active.id, { status: pendingStatus });
      setPendingStatus(null);
      setActive(null);
      setNotice(pendingStatus === "COMPLETED" ? "La cita quedó completada." : "La cita quedó cancelada.");
      setReloadKey((key) => key + 1);
    } catch (error) { setPendingStatus(null); setLoadError(readableError(error)); }
    finally { setBusy(false); }
  };

  const renderCompactAppointment = (item: AdministrativeAppointment) => <button className={`${styles.compactAppointment} ${item.status !== "scheduled" ? styles.closedAppointment : ""}`} key={item.id} onClick={() => void openDetail(item)} title={`Ver detalle de ${item.patient.name}`} type="button"><strong>{appointmentTime(item.scheduledAt)} · {item.patient.name}</strong><span>{item.professional.name}</span><span>{statusLabels[item.status]}</span></button>;

  if (!canRead) return <><PageHeader title="Agenda general" description="Agenda administrativa de la clínica" /><RoleAccessNotice role={role}>El backend no permite que Caja consulte ni modifique la agenda. Cambia a un rol clínico o administrativo autorizado.</RoleAccessNotice></>;

  return <>
    <PageHeader title="Agenda general" description={`${viewLabels[view]} · ${description}`} actions={canManageSchedule ? <Button onClick={() => { setActive(null); setFormError(""); setModal("schedule"); }}><CalendarPlus size={17} /> Agendar cita</Button> : undefined} />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    {loadError && <div className={styles.errorNotice} role="alert"><span>{loadError}</span><Button variant="secondary" onClick={() => setReloadKey((key) => key + 1)}><RefreshCw size={16} /> Reintentar</Button></div>}
    <section className="card">
      <div className="agenda-toolbar"><div className="date-switcher"><button aria-label={`${viewLabels[view]} anterior`} onClick={() => setSelectedDate((date) => shiftDate(date, -1, view))}><ChevronLeft /></button><button className={selectedDate === localDate(new Date()) ? "today" : ""} onClick={() => setSelectedDate(localDate(new Date()))}>Hoy</button><button aria-label={`${viewLabels[view]} siguiente`} onClick={() => setSelectedDate((date) => shiftDate(date, 1, view))}><ChevronRight /></button></div><div className="view-switch" aria-label="Vista de agenda">{(["day", "week", "month"] as AgendaView[]).map((item) => <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)} aria-pressed={view === item}>{viewLabels[item]}</button>)}</div></div>
      <div className={styles.apiFilters}>
        <label className="compact-field"><span>Paciente</span><input list="agenda-patients" value={patientId} onChange={(event) => setPatientId(event.target.value.trim())} placeholder="Nombre sugerido o UUID" /><datalist id="agenda-patients">{patientOptions.map((patient) => <option value={patient.id} key={patient.id}>{patient.name} · {patient.code}</option>)}</datalist>{invalidPatientFilter && <small>Selecciona una sugerencia o escribe un UUID válido.</small>}</label>
        <label className="compact-field"><span>Profesional</span><input list="agenda-professionals" value={professionalId} onChange={(event) => setProfessionalId(event.target.value.trim())} placeholder="Nombre sugerido o UUID" /><datalist id="agenda-professionals">{professionalOptions.map((professional) => <option value={professional.id} key={professional.id}>{professional.name}</option>)}</datalist>{invalidProfessionalFilter && <small>Selecciona una sugerencia o escribe un UUID válido.</small>}</label>
        <label className="compact-field"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos</option><option value="SCHEDULED">Programada</option><option value="COMPLETED">Completada</option><option value="CANCELLED">Cancelada</option></select></label>
        <Button variant="ghost" onClick={() => { setPatientId(""); setProfessionalId(""); setStatus(""); }}>Limpiar filtros</Button>
      </div>
      <p className={styles.summary}>{total} citas encontradas · filtros aplicados automáticamente</p>
      {loading ? <LoadingState rows={5} /> : !loadError && view === "day" && (selectedItems.length ? <div className="timeline">{selectedItems.map((item) => <article className="timeline-item" key={item.id}><time>{appointmentTime(item.scheduledAt)}</time><div className="timeline-line"><i /></div><div className="appointment-card"><div><strong>{item.patient.name}</strong><span>{item.patient.code} · {item.patient.phone}</span><small>{item.professional.name}</small></div><div className="appointment-actions"><StatusBadge status={statusLabels[item.status]} /><Button variant="secondary" onClick={() => void openDetail(item)}><Eye size={16} /> Ver detalle</Button></div></div></article>)}</div> : <EmptyState title="Sin citas" description="No hay citas reales para la fecha y los filtros seleccionados." />)}
      {!loading && !loadError && view === "week" && <div className={styles.calendarScroll}><div className={styles.weekGrid}>{visibleDates.map((date) => <div className={styles.dayHeader} key={`head-${date}`}>{formatShortDate(date)}</div>)}{visibleDates.map((date) => <div className={`${styles.dayColumn} ${date === localDate(new Date()) ? styles.todayCell : ""}`} key={date}><div className={styles.compactList}>{appointmentsFor(date).map(renderCompactAppointment)}</div>{!appointmentsFor(date).length && <div className={styles.emptyDay}>Sin citas</div>}</div>)}</div></div>}
      {!loading && !loadError && view === "month" && <div className={styles.calendarScroll}><div className={styles.monthGrid}>{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <div className={styles.monthHeader} key={day}>{day}</div>)}{visibleDates.map((date) => <div className={`${styles.monthCell} ${!isSameMonth(date, selectedDate) ? styles.outsideMonth : ""} ${date === localDate(new Date()) ? styles.todayCell : ""}`} key={date}><div className={styles.dateNumber}>{Number(date.slice(-2))}{date === localDate(new Date()) && <span>Hoy</span>}</div><div className={styles.compactList}>{appointmentsFor(date).map(renderCompactAppointment)}</div></div>)}</div></div>}
    </section>

    <Modal open={modal === "schedule"} title="Agendar cita" description="Se guardará directamente en DentalCare API como una cita programada." onClose={closeModal}><form className="form-grid" onSubmit={submitNew} noValidate><label className="field full"><span>ID del paciente *</span><input name="patientId" list="create-patients" defaultValue={initialPatientId} placeholder="UUID del paciente" autoComplete="off" /><datalist id="create-patients">{patientOptions.map((patient) => <option value={patient.id} key={patient.id}>{patient.name} · {patient.code}</option>)}</datalist></label><label className="field full"><span>ID del profesional *</span><input name="professionalId" list="create-professionals" placeholder="UUID del profesional" autoComplete="off" /><datalist id="create-professionals">{professionalOptions.map((professional) => <option value={professional.id} key={professional.id}>{professional.name}</option>)}</datalist></label><label className="field"><span>Fecha *</span><input name="date" type="date" defaultValue={selectedDate} min={localDate(new Date())} /></label><label className="field"><span>Hora *</span><input name="time" type="time" defaultValue="09:00" /></label>{formError && <p className="form-error full" role="alert">{formError}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={closeModal} disabled={busy}>Cancelar</Button><Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar cita"}</Button></div></form></Modal>

    <Modal open={modal === "detail" && !!active} title="Detalle de la cita" onClose={closeModal}>{detailLoading ? <LoadingState rows={4} /> : active && <><div className={styles.detailGrid}><div className={styles.fullDetail}><span>Paciente</span><strong>{active.patient.name}</strong><small>{active.patient.code} · {active.patient.phone}</small></div><div><span>Fecha</span><strong>{formatLongDate(appointmentDate(active.scheduledAt))}</strong></div><div><span>Hora</span><strong>{appointmentTime(active.scheduledAt)}</strong></div><div className={styles.fullDetail}><span>Profesional</span><strong>{active.professional.name}</strong></div><div><span>Estado</span><StatusBadge status={statusLabels[active.status]} /></div><div><span>Última actualización</span><strong>{new Date(active.updatedAt).toLocaleString("es-GT")}</strong></div></div>{formError && <p className="form-error" role="alert">{formError}</p>}<div className={styles.detailActions}>{canManageSchedule && active.status === "scheduled" && <Button variant="secondary" onClick={() => { setFormError(""); setModal("reschedule"); }}><CalendarClock size={16} /> Reprogramar</Button>}{canUpdateStatus && active.status === "scheduled" && <><Button onClick={() => { setModal(null); setPendingStatus("COMPLETED"); }}><CalendarCheck size={16} /> Completar</Button><Button variant="danger" onClick={() => { setModal(null); setPendingStatus("CANCELLED"); }}><Ban size={16} /> Cancelar</Button></>}</div></>}</Modal>

    <Modal open={modal === "reschedule" && !!active} title="Reprogramar cita" description={active ? `${active.patient.name} · ${active.professional.name}` : ""} onClose={closeModal}>{active && <form className="form-grid" onSubmit={submitReschedule}><label className="field"><span>Nueva fecha *</span><input name="date" type="date" defaultValue={appointmentDate(active.scheduledAt)} min={localDate(new Date())} /></label><label className="field"><span>Nueva hora *</span><input name="time" type="time" defaultValue={appointmentTime(active.scheduledAt)} /></label>{formError && <p className="form-error full" role="alert">{formError}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal("detail")} disabled={busy}>Volver</Button><Button type="submit" disabled={busy}>{busy ? "Reprogramando…" : "Confirmar reprogramación"}</Button></div></form>}</Modal>

    <ConfirmDialog open={pendingStatus !== null} title={pendingStatus === "COMPLETED" ? "Completar cita" : "Cancelar cita"} message={pendingStatus === "COMPLETED" ? "Esta transición marcará la cita como completada en el backend y no podrá revertirse." : "Esta transición cancelará la cita en el backend y liberará el horario."} confirmLabel={pendingStatus === "COMPLETED" ? "Completar cita" : "Cancelar cita"} danger={pendingStatus === "CANCELLED"} onClose={() => { if (!busy) setPendingStatus(null); }} onConfirm={() => void confirmStatusChange()} />
  </>;
}

function mergeById<T extends { id: string }>(current: T[], incoming: T[]) {
  return Array.from(new Map([...current, ...incoming].map((item) => [item.id, item])).values());
}
