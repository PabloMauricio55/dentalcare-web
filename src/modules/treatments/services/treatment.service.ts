import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import type { CreateProcedureRecordDto } from "@/modules/treatments/dtos/create-procedure-record.dto";
import type { FinalizeProcedureDto } from "@/modules/treatments/dtos/finalize-procedure.dto";
import type { CreateTreatmentPrescriptionDto } from "@/modules/treatments/dtos/create-treatment-prescription.dto";
import type { ProcedureCompletion, TreatmentBudget, TreatmentCharge, TreatmentConsent, TreatmentPlan, TreatmentPrescription, TreatmentProcedure, TreatmentProcedureRecord } from "@/modules/treatments/models/treatment.model";

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
  createProcedureRecord(dto: CreateProcedureRecordDto): TreatmentProcedureRecord {
    return {
      ...dto,
      id: createId("record"),
      status: "Registrado",
    };
  },
  finalizeProcedure(dto: FinalizeProcedureDto): { completion: ProcedureCompletion; charge: TreatmentCharge } {
    const createdAt = new Intl.DateTimeFormat("en-CA").format(new Date());
    return {
      completion: {
        id: createId("completion"),
        patientId: dto.patientId,
        treatmentPlanId: dto.treatmentPlanId,
        procedureRecordId: dto.procedureRecordId,
        completedAt: createdAt,
        materials: dto.materials.map((material) => ({ ...material, id: createId("material") })),
      },
      charge: {
        id: createId("charge"),
        patientId: dto.patientId,
        treatmentPlanId: dto.treatmentPlanId,
        procedureRecordId: dto.procedureRecordId,
        description: dto.description,
        amount: dto.amount,
        status: "Generado",
        createdAt,
      },
    };
  },
  createPrescription(dto: CreateTreatmentPrescriptionDto, existingId?: string): TreatmentPrescription {
    return {
      ...dto,
      id: existingId ?? createId("prescription"),
      date: new Intl.DateTimeFormat("en-CA").format(new Date()),
      medications: dto.medications.map((medication) => ({ ...medication, id: createId("medication") })),
      status: "Registrada",
    };
  },
};
