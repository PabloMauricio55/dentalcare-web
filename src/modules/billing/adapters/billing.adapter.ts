import type { CreatePlanDto, RegisterChargeDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { Adjustment, AgreementPlan, Charge, Installment, Payment, Receipt } from "../models/billing";

const today = () => new Date().toISOString().slice(0, 10);
const addMonths = (date: string, months: number) => { const value = new Date(`${date}T00:00:00`); value.setMonth(value.getMonth() + months); return value.toISOString().slice(0, 10); };

export const billingAdapter = {
  chargeFromDto(dto: RegisterChargeDto): Charge { return { ...dto, id: `cg${Date.now()}`, date: today(), discount: 0, paid: 0, status: "Pendiente" }; },
  paymentFromDto(dto: RegisterPaymentDto, receiptId: string): Payment { return { ...dto, id: `pg${Date.now()}`, date: today(), receiptId }; },
  adjustmentFromDto(dto: RequestAdjustmentDto, requestedBy: string): Adjustment { return { ...dto, id: `aj${Date.now()}`, date: today(), requestedBy, authorizedBy: "", status: "Por autorizar" }; },
  planFromDto(dto: CreatePlanDto): AgreementPlan { return { ...dto, id: `pl${Date.now()}`, status: "Vigente" }; },
  installmentsFromPlan(plan: AgreementPlan): Installment[] {
    const financed = Math.max(0, plan.total - plan.downPayment);
    const share = Math.round((financed / plan.installmentCount) * 100) / 100;
    return Array.from({ length: plan.installmentCount }, (_, index) => ({ id: `${plan.id}-${index + 1}`, planId: plan.id, number: index + 1, dueDate: addMonths(plan.startDate, index + 1), amount: index === plan.installmentCount - 1 ? Math.round((financed - share * (plan.installmentCount - 1)) * 100) / 100 : share, status: "Pendiente" }));
  },
  receiptFromPayment(dto: RegisterPaymentDto, sequence: number, concept: string): Receipt { return { id: `rc${Date.now()}`, number: `DC-${String(sequence).padStart(6, "0")}`, patientId: dto.patientId, date: today(), concept, amount: dto.amount, method: dto.method, status: "Emitido", sentTo: "" }; },
};
