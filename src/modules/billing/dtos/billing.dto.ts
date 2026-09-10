import type { AdjustmentKind, PaymentKind, PaymentMethod } from "../models/billing";

export type RegisterChargeDto = { patientId: string; concept: string; amount: number };
export type RegisterPaymentDto = { patientId: string; kind: PaymentKind; amount: number; method: PaymentMethod; chargeId: string };
export type CreatePlanDto = { patientId: string; chargeId: string; total: number; downPayment: number; installmentCount: number; startDate: string };
export type RequestAdjustmentDto = { kind: AdjustmentKind; patientId: string; originId: string; originLabel: string; amount: number; reason: string };
