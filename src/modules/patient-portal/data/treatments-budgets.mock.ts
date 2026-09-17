export type TreatmentStatus = "En curso" | "Pendiente" | "Completado" | "Pausado";
export type BudgetStatus = "Pendiente" | "Aprobado" | "Rechazado" | "Vencido";

export type PatientTreatment = { id: string; name: string; professional: string; specialty: string; startedAt: string; status: TreatmentStatus; progress: number; nextAction: string; description: string; detail: string };
export type PatientBudget = { id: string; code: string; date: string; treatment: string; description: string; total: string; status: BudgetStatus; validUntil: string; concepts: { name: string; amount: string }[] };

export const mockTreatments: PatientTreatment[] = [
  { id: "orthodontics", name: "Ortodoncia con alineadores", professional: "Dra. Andrea López", specialty: "Ortodoncia", startedAt: "12 de enero de 2026", status: "En curso", progress: 60, nextAction: "Control el 18 de septiembre", description: "Seguimiento de alineación y ajuste periódico.", detail: "Plan de 12 meses con controles mensuales y entrega de alineadores según progreso." },
  { id: "implant", name: "Rehabilitación con implante", professional: "Dr. Carlos Méndez", specialty: "Rehabilitación oral", startedAt: "Pendiente de inicio", status: "Pendiente", progress: 0, nextAction: "Revisar presupuesto aprobado", description: "Reposición de pieza dental con corona sobre implante.", detail: "El tratamiento iniciará al completar la fase de planificación y disponibilidad clínica." },
  { id: "periodontal", name: "Terapia periodontal", professional: "Dra. Sofía Ramírez", specialty: "Periodoncia", startedAt: "04 de marzo de 2026", status: "Pausado", progress: 35, nextAction: "Agendar control de seguimiento", description: "Control de encías y limpieza especializada.", detail: "Tratamiento temporalmente pausado a solicitud del paciente." },
  { id: "cleaning", name: "Limpieza preventiva", professional: "Equipo de prevención", specialty: "Odontología preventiva", startedAt: "04 de agosto de 2026", status: "Completado", progress: 100, nextAction: "Próximo control en 6 meses", description: "Profilaxis y recomendaciones de higiene.", detail: "Atención completada sin observaciones pendientes." },
];

export const mockBudgets: PatientBudget[] = [
  { id: "budget-1032", code: "PRES-1032", date: "10 de septiembre de 2026", treatment: "Rehabilitación con implante", description: "Implante unitario y corona cerámica.", total: "Q 8,500.00", status: "Pendiente", validUntil: "10 de octubre de 2026", concepts: [{ name: "Planificación y estudios", amount: "Q 850.00" }, { name: "Implante dental", amount: "Q 4,950.00" }, { name: "Corona cerámica", amount: "Q 2,700.00" }] },
  { id: "budget-1019", code: "PRES-1019", date: "02 de agosto de 2026", treatment: "Ortodoncia con alineadores", description: "Plan de alineadores y controles de seguimiento.", total: "Q 12,400.00", status: "Aprobado", validUntil: "02 de septiembre de 2026", concepts: [{ name: "Estudio inicial", amount: "Q 1,200.00" }, { name: "Alineadores", amount: "Q 10,000.00" }, { name: "Controles", amount: "Q 1,200.00" }] },
  { id: "budget-1003", code: "PRES-1003", date: "14 de junio de 2026", treatment: "Blanqueamiento dental", description: "Sesiones de blanqueamiento supervisado.", total: "Q 2,100.00", status: "Rechazado", validUntil: "14 de julio de 2026", concepts: [{ name: "Kit y sesiones", amount: "Q 2,100.00" }] },
  { id: "budget-0988", code: "PRES-0988", date: "05 de abril de 2026", treatment: "Restauraciones", description: "Restauraciones estéticas en resina.", total: "Q 1,750.00", status: "Vencido", validUntil: "05 de mayo de 2026", concepts: [{ name: "Restauraciones", amount: "Q 1,750.00" }] },
];
