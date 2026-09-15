import type { CloseShiftDto, CreatePlanDto, OpenShiftDto, RegisterChargeDto, RegisterMovementDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { AccountSummary, Adjustment, CashMovement, CashShift, CashSummary, Charge, Payment } from "../models/billing";
import { billingAdapter } from "../adapters/billing.adapter";

const round = (value: number) => Math.round(value * 100) / 100;
const sum = (values: number[]) => round(values.reduce((total, value) => total + value, 0));
const statusOf = (charge: Charge): Charge["status"] => charge.paid >= charge.amount - charge.discount ? "Pagado" : charge.paid > 0 ? "Parcial" : "Pendiente";

export const billingService = {
  createCharge: (dto: RegisterChargeDto) => billingAdapter.chargeFromDto(dto),
  createPlan(dto: CreatePlanDto) { const plan = billingAdapter.planFromDto(dto); return { plan, installments: billingAdapter.installmentsFromPlan(plan) }; },
  requestAdjustment: (dto: RequestAdjustmentDto, requestedBy: string) => billingAdapter.adjustmentFromDto(dto, requestedBy),
  registerPayment(dto: RegisterPaymentDto, sequence: number, concept: string, shiftId: string) {
    const receipt = billingAdapter.receiptFromPayment(dto, sequence, concept);
    return { payment: billingAdapter.paymentFromDto(dto, receipt.id, shiftId), receipt };
  },
  applyPayment(charge: Charge, amount: number): Charge { const paid = round(charge.paid + amount); return { ...charge, paid, status: statusOf({ ...charge, paid }) }; },
  applyDiscount(charge: Charge, amount: number): Charge { const discount = round(charge.discount + amount); return { ...charge, discount, status: statusOf({ ...charge, discount }) }; },
  pendingOf: (charge: Charge) => round(charge.amount - charge.discount - charge.paid),
  summarize(charges: Charge[], payments: Payment[], adjustments: Adjustment[]): AccountSummary {
    const active = charges.filter((charge) => charge.status !== "Anulado");
    const charged = sum(active.map((charge) => charge.amount));
    const discounted = sum(active.map((charge) => charge.discount));
    const refundedOf = (kind: "advance" | "payment") => sum(adjustments.filter((item) => item.status === "Aplicada" && item.kind === "Devolución" && (payments.find((payment) => payment.id === item.originId)?.kind === "Anticipo") === (kind === "advance")).map((item) => item.amount));
    const paid = round(sum(payments.filter((payment) => payment.kind !== "Anticipo").map((payment) => payment.amount)) - refundedOf("payment"));
    const advances = round(sum(payments.filter((payment) => payment.kind === "Anticipo").map((payment) => payment.amount)) - refundedOf("advance"));
    return { charged, discounted, paid, advances, balance: round(charged - discounted - paid - advances) };
  },
  refundableOf: (payment: Payment, adjustments: Adjustment[]) => round(payment.amount - sum(adjustments.filter((item) => item.kind === "Devolución" && item.originId === payment.id && item.status !== "Rechazada").map((item) => item.amount))),
  hasPendingFor: (originId: string, adjustments: Adjustment[]) => adjustments.some((item) => item.originId === originId && item.status === "Por autorizar"),
  openShift: (dto: OpenShiftDto, openedBy: string) => billingAdapter.shiftFromDto(dto, openedBy),
  registerMovement: (dto: RegisterMovementDto, shiftId: string, registeredBy: string) => billingAdapter.movementFromDto(dto, shiftId, registeredBy),
  closeShift: (shift: CashShift, dto: CloseShiftDto, expectedAmount: number) => billingAdapter.closedShiftFromDto(shift, dto, expectedAmount),
  cashDifference: (counted: number, expected: number) => round(counted - expected),
  cashSummary(shift: CashShift, movements: CashMovement[], payments: Payment[]): CashSummary {
    const patientCash = sum(payments.filter((payment) => payment.method === "Efectivo").map((payment) => payment.amount));
    const otherMethods = sum(payments.filter((payment) => payment.method !== "Efectivo").map((payment) => payment.amount));
    const manualIn = sum(movements.filter((movement) => movement.kind === "Ingreso").map((movement) => movement.amount));
    const manualOut = sum(movements.filter((movement) => movement.kind === "Egreso").map((movement) => movement.amount));
    return { opening: shift.openingAmount, patientCash, otherMethods, manualIn, manualOut, expected: round(shift.openingAmount + patientCash + manualIn - manualOut) };
  },
};
