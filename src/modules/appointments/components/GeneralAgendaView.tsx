"use client";

import { CalendarPlus, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, Modal, PageHeader, StatusBadge } from "@/shared/components";
import { useClinicSession } from "./ClinicSessionProvider";

export function GeneralAgendaView() {
  const { appointments, patients, addAppointment, updateAppointmentStatus } = useClinicSession();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const today = "2026-09-10";
  const items = useMemo(() => appointments.filter((item) => item.date === today && item.status !== "Solicitada"), [appointments]);
  const nameOf = (id: string) => patients.find((patient) => patient.id === id)?.name ?? "Paciente";
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dto = { patientId: String(data.get("patientId")), date: String(data.get("date")), time: String(data.get("time")), professional: String(data.get("professional")), reason: String(data.get("reason")) };
    if (Object.values(dto).some((value) => !value)) { setError("Completa todos los campos obligatorios."); return; }
    addAppointment(dto); setOpen(false); setError(""); setNotice("La cita fue agendada y confirmada.");
  };
  return <><PageHeader title="Agenda general" description="Jueves, 10 de septiembre de 2026" actions={<Button onClick={() => setOpen(true)}><CalendarPlus size={17} /> Agendar cita</Button>} />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="card"><div className="agenda-toolbar"><div className="date-switcher"><button aria-label="Día anterior"><ChevronLeft /></button><button className="today">Hoy</button><button aria-label="Día siguiente"><ChevronRight /></button></div><div className="view-switch"><button className="active">Día</button><button>Semana</button><button>Mes</button></div><label className="compact-field"><span>Profesional</span><select><option>Todos</option><option>Dra. Elena Castillo</option><option>Dr. Mario Morales</option></select></label></div><div className="timeline">{items.map((item) => <article className="timeline-item" key={item.id}><time>{item.time}</time><div className="timeline-line"><i /></div><div className="appointment-card"><div><strong>{nameOf(item.patientId)}</strong><span>{item.reason} · {item.duration} min</span><small>{item.professional}</small></div><div className="appointment-actions"><StatusBadge status={item.status} />{item.status === "Confirmada" && <Button variant="secondary" onClick={() => { updateAppointmentStatus(item.id,"En espera"); setNotice(`${nameOf(item.patientId)} fue registrado en sala de espera.`); }}>Registrar llegada</Button>}<button className="row-menu" aria-label="Opciones">•••</button></div></div></article>)}</div></section><Modal open={open} title="Agendar cita" description="La cita se registra directamente como confirmada por la clínica." onClose={() => setOpen(false)} footer={null}><form className="form-grid" onSubmit={submit}><label className="field full"><span>Paciente *</span><select name="patientId" defaultValue=""><option value="" disabled>Seleccionar paciente</option>{patients.map((patient) => <option value={patient.id} key={patient.id}>{patient.name} · {patient.code}</option>)}</select></label><label className="field"><span>Fecha *</span><input name="date" type="date" defaultValue={today} /></label><label className="field"><span>Hora *</span><input name="time" type="time" defaultValue="09:00" /></label><label className="field full"><span>Profesional *</span><select name="professional"><option>Dra. Elena Castillo</option><option>Dr. Mario Morales</option></select></label><label className="field full"><span>Motivo *</span><input name="reason" placeholder="Ej. Evaluación inicial" /></label>{error && <p className="form-error full">{error}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit"><Clock3 size={17} /> Guardar cita</Button></div></form></Modal></>;
}
