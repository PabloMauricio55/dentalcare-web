import type { CreatePlanDto, RegisterChargeDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { AccountSummary, Adjustment, Charge, Payment } from "../models/billing";
import { billingAdapter } from "../adapters/billing.adapter";

const round = (value: number) => Math.round(value * 100) / 100;
const statusOf = (charge: Charge): Charge["status"] => charge.paid >= charge.amount - charge.discount ? "Pagado" : charge.paid > 0 ? "Parcial" : "Pendiente";

export const billingService = {
  createCharge: (dto: RegisterChargeDto) => billingAdapter.chargeFromDto(dto),
  createPlan(dto: CreatePlanDto) { const plan = billingAdapter.planFromDto(dto); return { plan, installments: billingAdapter.installmentsFromPlan(plan) }; },
  requestAdjustment: (dto: RequestAdjustmentDto, requestedBy: string) => billingAdapter.adjustmentFromDto(dto, requestedBy),
  registerPayment(dto: RegisterPaymentDto, sequence: number, concept: string) {
    const receipt = billingAdapter.receiptFromPayment(dto, sequence, concept);
    return { payment: billingAdapter.paymentFromDto(dto, receipt.id), receipt };
  },
  applyPayment(charge: Charge, amount: number): Charge { const paid = round(charge.paid + amount); return { ...charge, paid, status: statusOf({ ...charge, paid }) }; },
  applyDiscount(charge: Charge, amount: number): Charge { const discount = round(charge.discount + amount); return { ...charge, discount, status: statusOf({ ...charge, discount }) }; },
  pendingOf: (charge: Charge) => round(charge.amount - charge.discount - charge.paid),
  summarize(charges: Charge[], payments: Payment[], adjustments: Adjustment[]): AccountSummary {
    const active = charges.filter((charge) => charge.status !== "Anulado");
    const charged = active.reduce((total, charge) => total + charge.amount, 0);
    const discounted = active.reduce((total, charge) => total + charge.discount, 0);
    const refunded = adjustments.filter((item) => item.status === "Aplicada" && item.kind === "Devolución").reduce((total, item) => total + item.amount, 0);
    const paid = round(payments.filter((payment) => payment.kind !== "Anticipo").reduce((total, payment) => total + payment.amount, 0) - refunded);
    const advances = payments.filter((payment) => payment.kind === "Anticipo").reduce((total, payment) => total + payment.amount, 0);
    return { charged: round(charged), discounted: round(discounted), paid, advances: round(advances), balance: round(charged - discounted - paid - advances) };
  },
};
