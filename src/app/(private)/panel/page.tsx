import { CalendarCheck, Clock3, UserRoundCheck, UsersRound } from "lucide-react";
import { PageHeader, StatCard, StatusBadge } from "@/shared/components";

const activity = [
  { time: "08:00", patient: "María López García", service: "Evaluación inicial", status: "En atención" },
  { time: "09:00", patient: "Carlos Méndez Ruiz", service: "Restauración", status: "En espera" },
  { time: "10:30", patient: "Ana Lucía Pérez", service: "Control", status: "Confirmada" },
];

export default function DashboardPage() {
  return <div className="page-stack"><PageHeader title="Buenos días, Daniel" description="Esto es lo más importante de la clínica para hoy, 10 de septiembre." /><div className="stats-grid"><StatCard label="Citas de hoy" value="18" helper="15 confirmadas" icon={CalendarCheck} /><StatCard label="En sala de espera" value="3" helper="Espera media: 12 min" icon={Clock3} tone="amber" /><StatCard label="Atendidos" value="7" helper="39% de la jornada" icon={UserRoundCheck} tone="green" /><StatCard label="Pacientes activos" value="1,248" helper="+18 este mes" icon={UsersRound} tone="blue" /></div><section className="card"><div className="card-heading"><div><h3>Próximas atenciones</h3><p>Agenda inmediata de la sede central</p></div><button className="button button-secondary">Ver agenda completa</button></div><div className="schedule-list">{activity.map((item) => <article key={item.time}><time>{item.time}</time><span className="patient-avatar">{item.patient.split(" ").slice(0,2).map((part) => part[0]).join("")}</span><div><strong>{item.patient}</strong><small>{item.service}</small></div><StatusBadge status={item.status} /></article>)}</div></section></div>;
}
