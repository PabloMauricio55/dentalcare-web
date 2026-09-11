import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import type { TreatmentBudget, TreatmentConsent, TreatmentPlan, TreatmentProcedure } from "@/modules/treatments/models/treatment.model";

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const treatmentService = {
  create(dto: CreateTreatmentPlanDto): TreatmentPlan {
    return {
      ...dto,
      id: createId("plan"),
      date: new Intl.DateTimeFormat("en-CA").format(new Date()),
      status: "Borrador",
      procedures: dto.procedures.map((procedure) => ({ ...procedure, id: createId("proc") })),
    };
  },
  procedureSubtotal(procedure: Pick<TreatmentProcedure, "quantity" | "unitPrice">) {
    return procedure.quantity * procedure.unitPrice;
  },
  planTotal(procedures: Pick<TreatmentProcedure, "quantity" | "unitPrice">[]) {
    return procedures.reduce((total, procedure) => total + this.procedureSubtotal(procedure), 0);
  },
  createBudget(patientId: string, treatmentPlanId: string): TreatmentBudget {
    return {
      id: createId("budget"),
      patientId,
      treatmentPlanId,
      status: "Borrador",
      createdAt: new Intl.DateTimeFormat("en-CA").format(new Date()),
    };
  },
  createConsent(patientId: string, treatmentPlanId: string): TreatmentConsent {
    return {
      id: createId("consent"),
      patientId,
      treatmentPlanId,
      status: "Pendiente",
      createdAt: new Intl.DateTimeFormat("en-CA").format(new Date()),
    };
  },
};
