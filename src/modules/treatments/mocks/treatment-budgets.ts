import type { TreatmentBudget } from "@/modules/treatments/models/treatment.model";

export const initialTreatmentBudgets: TreatmentBudget[] = [
  {
    id: "budget-001",
    patientId: "p1",
    treatmentPlanId: "plan-002",
    status: "Aprobado",
    createdAt: "2026-08-21",
    approvedAt: "2026-08-22",
  },
];
