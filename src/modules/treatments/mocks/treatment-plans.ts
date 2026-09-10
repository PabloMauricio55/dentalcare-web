import type { TreatmentPlan } from "@/modules/treatments/models/treatment.model";

export const initialTreatmentPlans: TreatmentPlan[] = [
  {
    id: "plan-001",
    patientId: "p1",
    name: "Rehabilitación sector superior",
    observations: "Resolver restauraciones antes de iniciar la fase estética.",
    date: "2026-09-08",
    professional: "Dra. Elena Castillo",
    status: "Borrador",
    procedures: [
      { id: "proc-001", name: "Restauración con resina", tooth: "16", quantity: 1, unitPrice: 350 },
      { id: "proc-002", name: "Profilaxis dental", tooth: "", quantity: 1, unitPrice: 275 },
    ],
  },
  {
    id: "plan-002",
    patientId: "p1",
    name: "Control preventivo semestral",
    observations: "Seguimiento preventivo y control radiográfico.",
    date: "2026-08-21",
    professional: "Dr. Mario Morales",
    status: "Aprobado",
    procedures: [
      { id: "proc-003", name: "Evaluación clínica", tooth: "", quantity: 1, unitPrice: 200 },
      { id: "proc-004", name: "Radiografía periapical", tooth: "26", quantity: 2, unitPrice: 125 },
    ],
  },
  {
    id: "plan-003",
    patientId: "p2",
    name: "Tratamiento restaurativo inferior",
    observations: "Plan sujeto a revisión del paciente.",
    date: "2026-09-05",
    professional: "Dra. Elena Castillo",
    status: "Borrador",
    procedures: [
      { id: "proc-005", name: "Restauración con resina", tooth: "36", quantity: 1, unitPrice: 350 },
    ],
  },
];
