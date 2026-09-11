import type { TreatmentConsent } from "@/modules/treatments/models/treatment.model";

export const initialTreatmentConsents: TreatmentConsent[] = [
  {
    id: "consent-001",
    patientId: "p1",
    treatmentPlanId: "plan-002",
    status: "Aceptado",
    createdAt: "2026-08-21",
    acceptedAt: "2026-08-22",
  },
];
