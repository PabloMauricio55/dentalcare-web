"use client";

import {
  Ban,
  CalendarClock,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DoorOpen,
  Eye,
  MoreHorizontal,
  Pencil,
  UserX,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  ActionNotice,
  Button,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  StatusBadge,
} from "@/shared/components";
import type { Appointment, AppointmentStatus } from "../models/appointment";
import {
  DEMO_TODAY,
  formatLongDate,
  formatMonth,
  formatShortDate,
  isSameMonth,
  monthDates,
  shiftDate,
  weekDates,
} from "../services/agenda-date.service";
import { useClinicSession } from "./ClinicSessionProvider";
import styles from "./agenda.module.css";

type AgendaView = "day" | "week" | "month";
type AgendaModal = "schedule" | "actions" | "detail" | "edit" | "reschedule" | null;

const viewLabels: Record<AgendaView, string> = { day: "Día", week: "Semana", month: "Mes" };
const closedStatuses: AppointmentStatus[] = ["Cancelada", "No asistió", "Rechazada"];

export function GeneralAgendaView({ initialPatientId = "", openSchedule = false }: { initialPatientId?: string; openSchedule?: boolean }) {
  const {
    appointments,
    patients,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
  } = useClinicSession();
  const [selectedDate, setSelectedDate] = useState(DEMO_TODAY);
  const [view, setView] = useState<AgendaView>("day");
  const [professional, setProfessional] = useState("Todos");
  const [modal, setModal] = useState<AgendaModal>(openSchedule ? "schedule" : null);
  const [active, setActive] = useState<Appointment | null>(null);
  const [pendingStatus, setPendingStatus] = useState<AppointmentStatus | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const professionals = useMemo(
    () => Array.from(new Set(appointments.map((item) => item.professional))).sort(),
    [appointments],
  );
  const calendarAppointments = useMemo(
    () => appointments
      .filter((item) => !["Solicitada", "Rechazada"].includes(item.status))
      .filter((item) => professional === "Todos" || item.professional === professional)
      .sort((left, right) => `${left.date}${left.time}`.localeCompare(`${right.date}${right.time}`)),
    [appointments, professional],
  );
  const patientName = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const appointmentsFor = (date: string) => calendarAppointments.filter((item) => item.date === date);
  const selectedItems = appointmentsFor(selectedDate);
  const visibleDates = view === "week" ? weekDates(selectedDate) : monthDates(selectedDate);

  const description = view === "day"
    ? formatLongDate(selectedDate)
    : view === "week"
      ? `${formatShortDate(visibleDates[0])} – ${formatShortDate(visibleDates[6])}`
      : formatMonth(selectedDate);

  const moveDate = (direction: -1 | 1) => {
    setSelectedDate((current) => shiftDate(current, direction, view));
  };

  const openActions = (appointment: Appointment) => {
    setActive(appointment);
    setError("");
    setModal("actions");
  };

  const submitNew = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dto = {
      patientId: String(data.get("patientId")),
      date: String(data.get("date")),
      time: String(data.get("time")),
      duration: Number(data.get("duration")),
      professional: String(data.get("professional")),
      reason: String(data.get("reason")),
    };
    if (!dto.patientId.trim() || !dto.date.trim() || !dto.time.trim() || !dto.professional.trim() || !dto.reason.trim() || dto.duration < 5) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    addAppointment(dto);
    setSelectedDate(dto.date);
    setModal(null);
    setError("");
    setNotice("La cita fue agendada y confirmada.");
  };

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active) return;
    const data = new FormData(event.currentTarget);
    const reason = String(data.get("reason")).trim();
    const nextProfessional = String(data.get("professional"));
    const duration = Number(data.get("duration"));
    const notes = String(data.get("notes")).trim();
    if (!reason || !nextProfessional || duration < 5) {
      setError("Completa el motivo, profesional y una duración válida.");
      return;
    }
    updateAppointment({ ...active, reason, professional: nextProfessional, duration, notes });
    setModal(null);
    setError("");
    setNotice("Los datos de la cita fueron actualizados.");
  };

  const submitReschedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active) return;
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date"));
    const time = String(data.get("time"));
    if (!date || !time) {
      setError("Selecciona la nueva fecha y hora.");
      return;
    }
    rescheduleAppointment(active.id, date, time);
    setSelectedDate(date);
    setModal(null);
    setError("");
    setNotice("La cita fue reprogramada y permanece confirmada.");
  };

  const requestStatusChange = (status: AppointmentStatus) => {
    setPendingStatus(status);
    setModal(null);
  };

  const confirmStatusChange = () => {
    if (!active || !pendingStatus) return;
    updateAppointmentStatus(active.id, pendingStatus);
    const message = pendingStatus === "En espera"
      ? `${patientName(active.patientId)} fue registrado en sala de espera.`
      : pendingStatus === "Cancelada"
        ? "La cita fue cancelada y continúa visible en la agenda."
        : "La cita fue marcada como no asistida.";
    setNotice(message);
    setPendingStatus(null);
    setActive(null);
  };

  const renderCompactAppointment = (item: Appointment) => (
    <button
      className={`${styles.compactAppointment} ${closedStatuses.includes(item.status) ? styles.closedAppointment : ""}`}
      key={item.id}
      onClick={() => openActions(item)}
      title={`Abrir acciones de ${patientName(item.patientId)}`}
      type="button"
    >
      <strong>{item.time} · {patientName(item.patientId)}</strong>
      <span>{item.reason}</span>
      <span>{item.status}</span>
    </button>
  );

  return (
    <>
      <PageHeader
        title="Agenda general"
        description={`${viewLabels[view]} · ${description}`}
        actions={<Button onClick={() => { setActive(null); setError(""); setModal("schedule"); }}><CalendarPlus size={17} /> Agendar cita</Button>}
      />
      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
      <section className="card">
        <div className="agenda-toolbar">
          <div className="date-switcher">
            <button aria-label={`${viewLabels[view]} anterior`} onClick={() => moveDate(-1)}><ChevronLeft /></button>
            <button className={selectedDate === DEMO_TODAY ? "today" : ""} onClick={() => setSelectedDate(DEMO_TODAY)}>Hoy</button>
            <button aria-label={`${viewLabels[view]} siguiente`} onClick={() => moveDate(1)}><ChevronRight /></button>
          </div>
          <div className="view-switch" aria-label="Vista de agenda">
            {(["day", "week", "month"] as AgendaView[]).map((item) => (
              <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)} aria-pressed={view === item}>{viewLabels[item]}</button>
            ))}
          </div>
          <label className="compact-field">
            <span>Profesional</span>
            <select value={professional} onChange={(event) => setProfessional(event.target.value)}>
              <option>Todos</option>
              {professionals.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <p className={styles.summary}>{calendarAppointments.length} citas visibles · {professional === "Todos" ? "Todos los profesionales" : professional}</p>

        {view === "day" && (
          selectedItems.length ? <div className="timeline">{selectedItems.map((item) => (
            <article className="timeline-item" key={item.id}>
              <time>{item.time}</time>
              <div className="timeline-line"><i /></div>
              <div className="appointment-card">
                <div>
                  <strong>{patientName(item.patientId)}</strong>
                  <span>{item.reason} · {item.duration} min</span>
                  <small>{item.professional}</small>
                </div>
                <div className="appointment-actions">
                  <StatusBadge status={item.status} />
                  {item.status === "Confirmada" && <Button variant="secondary" onClick={() => { setActive(item); requestStatusChange("En espera"); }}>Registrar llegada</Button>}
                  <button className="row-menu" aria-label={`Opciones de ${patientName(item.patientId)}`} onClick={() => openActions(item)}><MoreHorizontal /></button>
                </div>
              </div>
            </article>
          ))}</div> : <EmptyState title="Sin citas" description="No hay citas para esta fecha y profesional." />
        )}

        {view === "week" && (
          <div className={styles.calendarScroll}>
            <div className={styles.weekGrid}>
              {visibleDates.map((date) => <div className={styles.dayHeader} key={`head-${date}`}>{formatShortDate(date)}</div>)}
              {visibleDates.map((date) => (
                <div className={`${styles.dayColumn} ${date === DEMO_TODAY ? styles.todayCell : ""}`} key={date}>
                  <div className={styles.compactList}>{appointmentsFor(date).map(renderCompactAppointment)}</div>
                  {!appointmentsFor(date).length && <div className={styles.emptyDay}>Sin citas</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className={styles.calendarScroll}>
            <div className={styles.monthGrid}>
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <div className={styles.monthHeader} key={day}>{day}</div>)}
              {visibleDates.map((date) => (
                <div className={`${styles.monthCell} ${!isSameMonth(date, selectedDate) ? styles.outsideMonth : ""} ${date === DEMO_TODAY ? styles.todayCell : ""}`} key={date}>
                  <div className={styles.dateNumber}>{Number(date.slice(-2))}{date === DEMO_TODAY && <span>Hoy</span>}</div>
                  <div className={styles.compactList}>{appointmentsFor(date).map(renderCompactAppointment)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Modal open={modal === "schedule"} title="Agendar cita" description="La cita se registra directamente como confirmada por la clínica." onClose={() => setModal(null)}>
        <form className="form-grid" onSubmit={submitNew}>
          <label className="field full"><span>Paciente *</span><select name="patientId" defaultValue={initialPatientId}><option value="" disabled>Seleccionar paciente</option>{patients.map((patient) => <option value={patient.id} key={patient.id}>{patient.name} · {patient.code}</option>)}</select></label>
          <label className="field"><span>Fecha *</span><input name="date" type="date" defaultValue={selectedDate} /></label>
          <label className="field"><span>Hora *</span><input name="time" type="time" defaultValue="09:00" /></label>
          <label className="field"><span>Duración *</span><select name="duration" defaultValue="45"><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">60 minutos</option><option value="90">90 minutos</option></select></label>
          <label className="field"><span>Profesional *</span><select name="professional" defaultValue={professional === "Todos" ? professionals[0] : professional}>{professionals.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field full"><span>Motivo *</span><input name="reason" placeholder="Ej. Evaluación inicial" /></label>
          {error && <p className="form-error full">{error}</p>}
          <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit"><Clock3 size={17} /> Guardar cita</Button></div>
        </form>
      </Modal>

      <Modal open={modal === "actions" && !!active} title="Acciones de la cita" description={active ? `${patientName(active.patientId)} · ${active.date} ${active.time}` : ""} onClose={() => setModal(null)}>
        {active && <div className={styles.actionList}>
          <button onClick={() => setModal("detail")}><Eye size={17} /> Ver detalle completo</button>
          <button onClick={() => { setError(""); setModal("edit"); }}><Pencil size={17} /> Editar información</button>
          <button onClick={() => { setError(""); setModal("reschedule"); }}><CalendarClock size={17} /> Reprogramar fecha y hora</button>
          {active.status === "Confirmada" && <button onClick={() => requestStatusChange("En espera")}><DoorOpen size={17} /> Registrar llegada</button>}
          {!closedStatuses.includes(active.status) && active.status !== "Atendida" && <button className={styles.dangerAction} onClick={() => requestStatusChange("No asistió")}><UserX size={17} /> Marcar inasistencia</button>}
          {!closedStatuses.includes(active.status) && active.status !== "Atendida" && <button className={styles.dangerAction} onClick={() => requestStatusChange("Cancelada")}><Ban size={17} /> Cancelar cita</button>}
        </div>}
      </Modal>

      <Modal open={modal === "detail" && !!active} title="Detalle de la cita" onClose={() => setModal("actions")}>
        {active && <div className={styles.detailGrid}>
          <div className={styles.fullDetail}><span>Paciente</span><strong>{patientName(active.patientId)}</strong></div>
          <div><span>Fecha</span><strong>{formatLongDate(active.date)}</strong></div>
          <div><span>Hora y duración</span><strong>{active.time} · {active.duration} min</strong></div>
          <div className={styles.fullDetail}><span>Profesional</span><strong>{active.professional}</strong></div>
          <div className={styles.fullDetail}><span>Motivo</span><strong>{active.reason}</strong></div>
          <div><span>Estado</span><StatusBadge status={active.status} /></div>
          <div><span>Origen</span><strong>{active.source}</strong></div>
          {active.notes && <div className={styles.fullDetail}><span>Notas</span><strong>{active.notes}</strong></div>}
        </div>}
      </Modal>

      <Modal open={modal === "edit" && !!active} title="Editar cita" description="Actualiza la información operativa sin cambiar la fecha ni hora." onClose={() => setModal("actions")}>
        {active && <form className="form-grid" key={`edit-${active.id}`} onSubmit={submitEdit}>
          <label className="field full"><span>Motivo *</span><input name="reason" defaultValue={active.reason} /></label>
          <label className="field"><span>Profesional *</span><select name="professional" defaultValue={active.professional}>{professionals.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field"><span>Duración (min) *</span><input name="duration" type="number" min="5" step="5" defaultValue={active.duration} /></label>
          <label className="field full"><span>Notas</span><textarea name="notes" rows={3} defaultValue={active.notes} /></label>
          {error && <p className="form-error full">{error}</p>}
          <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal("actions")}>Cancelar</Button><Button type="submit">Guardar cambios</Button></div>
        </form>}
      </Modal>

      <Modal open={modal === "reschedule" && !!active} title="Reprogramar cita" description={active ? `${patientName(active.patientId)} · ${active.reason}` : ""} onClose={() => setModal("actions")}>
        {active && <form className="form-grid" key={`reschedule-${active.id}`} onSubmit={submitReschedule}>
          <label className="field"><span>Nueva fecha *</span><input name="date" type="date" defaultValue={active.date} /></label>
          <label className="field"><span>Nueva hora *</span><input name="time" type="time" defaultValue={active.time} /></label>
          {error && <p className="form-error full">{error}</p>}
          <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal("actions")}>Cancelar</Button><Button type="submit">Confirmar reprogramación</Button></div>
        </form>}
      </Modal>

      <ConfirmDialog
        open={pendingStatus !== null}
        title={pendingStatus === "Cancelada" ? "Cancelar cita" : pendingStatus === "No asistió" ? "Marcar inasistencia" : "Registrar llegada"}
        message={pendingStatus === "En espera" ? "El paciente aparecerá inmediatamente en Sala de espera." : "La cita conservará su información e historial dentro de la agenda simulada."}
        confirmLabel={pendingStatus === "Cancelada" ? "Cancelar cita" : pendingStatus === "No asistió" ? "Marcar inasistencia" : "Registrar llegada"}
        danger={pendingStatus === "Cancelada" || pendingStatus === "No asistió"}
        onClose={() => setPendingStatus(null)}
        onConfirm={confirmStatusChange}
      />
    </>
  );
}
