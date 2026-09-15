import type { TreatmentProcedureRecord } from "@/modules/treatments/models/treatment.model";

export const initialTreatmentProcedureRecords: TreatmentProcedureRecord[] = [
  {
    id: "record-001",
    patientId: "p1",
    treatmentPlanId: "plan-002",
    procedureId: "proc-003",
    procedureName: "Evaluación clínica",
    tooth: "",
    professional: "Dr. Mario Morales",
    date: "2026-08-21",
    time: "09:30",
    notes: "Evaluación inicial registrada sin novedades.",
    status: "Registrado",
  },
];
