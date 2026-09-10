import type { CreatePlanDto, RegisterChargeDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { AccountSummary, Charge, Payment } from "../models/billing";
import { billingAdapter } from "../adapters/billing.adapter";

export const billingService = {
  createCharge: (dto: RegisterChargeDto) => billingAdapter.chargeFromDto(dto),
  createPlan(dto: CreatePlanDto) { const plan = billingAdapter.planFromDto(dto); return { plan, installments: billingAdapter.installmentsFromPlan(plan) }; },
  requestAdjustment: (dto: RequestAdjustmentDto, requestedBy: string) => billingAdapter.adjustmentFromDto(dto, requestedBy),
  registerPayment(dto: RegisterPaymentDto, sequence: number, concept: string) {
    const receipt = billingAdapter.receiptFromPayment(dto, sequence, concept);
    return { payment: billingAdapter.paymentFromDto(dto, receipt.id), receipt };
  },
  summarize(charges: Charge[], payments: Payment[]): AccountSummary {
    const active = charges.filter((charge) => charge.status !== "Anulado");
    const charged = active.reduce((total, charge) => total + charge.amount, 0);
    const discounted = active.reduce((total, charge) => total + charge.discount, 0);
    const paid = payments.filter((payment) => payment.kind !== "Anticipo").reduce((total, payment) => total + payment.amount, 0);
    const advances = payments.filter((payment) => payment.kind === "Anticipo").reduce((total, payment) => total + payment.amount, 0);
    return { charged, discounted, paid, advances, balance: Math.round((charged - discounted - paid - advances) * 100) / 100 };
  },
};
