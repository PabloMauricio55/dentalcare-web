"use client";

import { createContext, useContext, useState } from "react";
import type { CloseShiftDto, CreatePlanDto, OpenShiftDto, RegisterChargeDto, RegisterMovementDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { AccountSummary, Adjustment, AgreementPlan, CashMovement, CashShift, CashSummary, Charge, Installment, Payment, PaymentMethod, Receipt } from "../models/billing";
import { initialAdjustments, initialCharges, initialInstallments, initialMovements, initialPayments, initialPlans, initialReceipts, initialShifts, nextReceiptSequence } from "../mocks/billing";
import { billingService } from "../services/billing.service";

const operator = "Mario López";
const authorizer = "Daniel Sajche";

type Value = {
  chargesOf: (patientId: string) => Charge[];
  paymentsOf: (patientId: string) => Payment[];
  adjustmentsOf: (patientId: string) => Adjustment[];
  receiptsOf: (patientId: string) => Receipt[];
  receiptOf: (receiptId: string) => Receipt | undefined;
  chargeOf: (chargeId: string) => Charge | undefined;
  paymentOf: (paymentId: string) => Payment | undefined;
  allAdjustments: Adjustment[];
  allReceipts: Receipt[];
  planOf: (patientId: string) => AgreementPlan | undefined;
  installmentsOf: (planId: string) => Installment[];
  summaryOf: (patientId: string) => AccountSummary;
  addCharge: (dto: RegisterChargeDto) => void;
  registerPayment: (dto: RegisterPaymentDto, concept: string) => Receipt;
  createPlan: (dto: CreatePlanDto) => void;
  payInstallment: (installmentId: string, method: PaymentMethod) => Receipt | undefined;
  requestAdjustment: (dto: RequestAdjustmentDto) => void;
  authorizeAdjustment: (id: string) => void;
  rejectAdjustment: (id: string) => void;
  sendReceipt: (id: string, email: string) => void;
  reprintReceipt: (id: string) => void;
  currentShift: CashShift | undefined;
  closedShifts: CashShift[];
  movementsOf: (shiftId: string) => CashMovement[];
  shiftPaymentsOf: (shiftId: string) => Payment[];
  shiftSummaryOf: (shift: CashShift) => CashSummary;
  openShift: (dto: OpenShiftDto) => void;
  addMovement: (dto: RegisterMovementDto) => void;
  closeShift: (dto: CloseShiftDto) => CashShift | undefined;
};

const Context = createContext<Value | null>(null);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [charges, setCharges] = useState(initialCharges);
  const [payments, setPayments] = useState(initialPayments);
  const [plans, setPlans] = useState(initialPlans);
  const [installments, setInstallments] = useState(initialInstallments);
  const [adjustments, setAdjustments] = useState(initialAdjustments);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [sequence, setSequence] = useState(nextReceiptSequence);
  const [shifts, setShifts] = useState(initialShifts);
  const [movements, setMovements] = useState(initialMovements);

  const chargesOf = (patientId: string) => charges.filter((item) => item.patientId === patientId);
  const paymentsOf = (patientId: string) => payments.filter((item) => item.patientId === patientId);
  const adjustmentsOf = (patientId: string) => adjustments.filter((item) => item.patientId === patientId);
  const receiptsOf = (patientId: string) => receipts.filter((item) => item.patientId === patientId);
  const receiptOf = (receiptId: string) => receipts.find((item) => item.id === receiptId);
  const chargeOf = (chargeId: string) => charges.find((item) => item.id === chargeId);
  const paymentOf = (paymentId: string) => payments.find((item) => item.id === paymentId);
  const planOf = (patientId: string) => plans.find((item) => item.patientId === patientId);
  const installmentsOf = (planId: string) => installments.filter((item) => item.planId === planId);
  const summaryOf = (patientId: string) => billingService.summarize(chargesOf(patientId), paymentsOf(patientId), adjustmentsOf(patientId));

  const currentShift = shifts.find((item) => item.status === "Abierta");
  const closedShifts = shifts.filter((item) => item.status === "Cerrada");
  const movementsOf = (shiftId: string) => movements.filter((item) => item.shiftId === shiftId);
  const shiftPaymentsOf = (shiftId: string) => payments.filter((item) => item.shiftId === shiftId);
  const shiftSummaryOf = (shift: CashShift) => billingService.cashSummary(shift, movementsOf(shift.id), shiftPaymentsOf(shift.id));

  const addCharge = (dto: RegisterChargeDto) => setCharges((items) => [...items, billingService.createCharge(dto)]);

  const registerPayment = (dto: RegisterPaymentDto, concept: string) => {
    const { payment, receipt } = billingService.registerPayment(dto, sequence, concept, currentShift?.id ?? "");
    setSequence((value) => value + 1);
    setPayments((items) => [...items, payment]);
    setReceipts((items) => [...items, receipt]);
    if (dto.chargeId) setCharges((items) => items.map((charge) => charge.id === dto.chargeId ? billingService.applyPayment(charge, dto.amount) : charge));
    return receipt;
  };

  const createPlan = (dto: CreatePlanDto) => { const created = billingService.createPlan(dto); setPlans((items) => [...items, created.plan]); setInstallments((items) => [...items, ...created.installments]); };
  const payInstallment = (installmentId: string, method: PaymentMethod) => {
    const installment = installments.find((item) => item.id === installmentId);
    const plan = installment ? plans.find((item) => item.id === installment.planId) : undefined;
    if (!installment || !plan || installment.status === "Pagada") return undefined;
    const receipt = registerPayment({ patientId: plan.patientId, kind: "Abono", amount: installment.amount, method, chargeId: plan.chargeId }, `Cuota ${installment.number} de ${plan.installmentCount}`);
    const remaining = installments.filter((item) => item.planId === plan.id && item.id !== installment.id && item.status !== "Pagada").length;
    setInstallments((items) => items.map((item) => item.id === installmentId ? { ...item, status: "Pagada" } : item));
    if (!remaining) setPlans((items) => items.map((item) => item.id === plan.id ? { ...item, status: "Completado" } : item));
    return receipt;
  };

  const requestAdjustment = (dto: RequestAdjustmentDto) => setAdjustments((items) => [...items, billingService.requestAdjustment(dto, operator)]);

  const authorizeAdjustment = (id: string) => {
    const target = adjustments.find((item) => item.id === id);
    if (!target || target.status !== "Por autorizar") return;
    setAdjustments((items) => items.map((item) => item.id === id ? { ...item, status: "Aplicada", authorizedBy: authorizer } : item));
    if (target.kind === "Descuento") setCharges((items) => items.map((charge) => charge.id === target.originId ? billingService.applyDiscount(charge, target.amount) : charge));
    if (target.kind === "Anulación") setCharges((items) => items.map((charge) => charge.id === target.originId ? { ...charge, status: "Anulado" } : charge));
    if (target.kind === "Devolución") {
      const payment = payments.find((item) => item.id === target.originId);
      if (!payment) return;
      const receipt = receipts.find((item) => item.id === payment.receiptId);
      if (target.amount >= payment.amount) setReceipts((items) => items.map((item) => item.id === payment.receiptId ? { ...item, status: "Anulado" } : item));
      if (payment.chargeId) setCharges((items) => items.map((charge) => charge.id === payment.chargeId ? billingService.applyPayment(charge, -target.amount) : charge));
      if (payment.method === "Efectivo" && currentShift) setMovements((items) => [...items, billingService.registerMovement({ kind: "Egreso", concept: `Devolución · recibo ${receipt?.number ?? payment.id}`, amount: target.amount }, currentShift.id, authorizer)]);
    }
  };

  const rejectAdjustment = (id: string) => setAdjustments((items) => items.map((item) => item.id === id ? { ...item, status: "Rechazada", authorizedBy: authorizer } : item));
  const sendReceipt = (id: string, email: string) => setReceipts((items) => items.map((item) => item.id === id ? { ...item, sentTo: email } : item));
  const reprintReceipt = (id: string) => setReceipts((items) => items.map((item) => item.id === id ? { ...item, printCount: item.printCount + 1 } : item));

  const openShift = (dto: OpenShiftDto) => { if (!currentShift) setShifts((items) => [...items, billingService.openShift(dto, operator)]); };
  const addMovement = (dto: RegisterMovementDto) => { if (currentShift) setMovements((items) => [...items, billingService.registerMovement(dto, currentShift.id, operator)]); };
  const closeShift = (dto: CloseShiftDto) => {
    if (!currentShift) return undefined;
    const closed = billingService.closeShift(currentShift, dto, shiftSummaryOf(currentShift).expected);
    setShifts((items) => items.map((item) => item.id === closed.id ? closed : item));
    return closed;
  };

  const value = { chargesOf, paymentsOf, adjustmentsOf, receiptsOf, receiptOf, chargeOf, paymentOf, allAdjustments: adjustments, allReceipts: receipts, planOf, installmentsOf, summaryOf, addCharge, registerPayment, createPlan, payInstallment, requestAdjustment, authorizeAdjustment, rejectAdjustment, sendReceipt, reprintReceipt, currentShift, closedShifts, movementsOf, shiftPaymentsOf, shiftSummaryOf, openShift, addMovement, closeShift };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBilling() {
  const value = useContext(Context);
  if (!value) throw new Error("useBilling debe utilizarse dentro de BillingProvider");
  return value;
}
