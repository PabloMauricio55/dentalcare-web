"use client";

import { createContext, useContext, useState } from "react";
import type { CreatePlanDto, RegisterChargeDto, RegisterPaymentDto, RequestAdjustmentDto } from "../dtos/billing.dto";
import type { AccountSummary, Adjustment, AgreementPlan, Charge, Installment, Payment, Receipt } from "../models/billing";
import { initialAdjustments, initialCharges, initialInstallments, initialPayments, initialPlans, initialReceipts, nextReceiptSequence } from "../mocks/billing";
import { billingService } from "../services/billing.service";

const operator = "Mario López";
const authorizer = "Daniel Sajche";

type Value = {
  chargesOf: (patientId: string) => Charge[];
  paymentsOf: (patientId: string) => Payment[];
  adjustmentsOf: (patientId: string) => Adjustment[];
  receiptsOf: (patientId: string) => Receipt[];
  planOf: (patientId: string) => AgreementPlan | undefined;
  installmentsOf: (planId: string) => Installment[];
  summaryOf: (patientId: string) => AccountSummary;
  addCharge: (dto: RegisterChargeDto) => void;
  registerPayment: (dto: RegisterPaymentDto, concept: string) => Receipt;
  createPlan: (dto: CreatePlanDto) => void;
  requestAdjustment: (dto: RequestAdjustmentDto) => void;
  authorizeAdjustment: (id: string) => void;
  rejectAdjustment: (id: string) => void;
  sendReceipt: (id: string, email: string) => void;
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

  const chargesOf = (patientId: string) => charges.filter((item) => item.patientId === patientId);
  const paymentsOf = (patientId: string) => payments.filter((item) => item.patientId === patientId);
  const adjustmentsOf = (patientId: string) => adjustments.filter((item) => item.patientId === patientId);
  const receiptsOf = (patientId: string) => receipts.filter((item) => item.patientId === patientId);
  const planOf = (patientId: string) => plans.find((item) => item.patientId === patientId);
  const installmentsOf = (planId: string) => installments.filter((item) => item.planId === planId);
  const summaryOf = (patientId: string) => billingService.summarize(chargesOf(patientId), paymentsOf(patientId), adjustmentsOf(patientId));

  const addCharge = (dto: RegisterChargeDto) => setCharges((items) => [...items, billingService.createCharge(dto)]);

  const registerPayment = (dto: RegisterPaymentDto, concept: string) => {
    const { payment, receipt } = billingService.registerPayment(dto, sequence, concept);
    setSequence((value) => value + 1);
    setPayments((items) => [...items, payment]);
    setReceipts((items) => [...items, receipt]);
    if (dto.chargeId) setCharges((items) => items.map((charge) => charge.id === dto.chargeId ? billingService.applyPayment(charge, dto.amount) : charge));
    return receipt;
  };

  const createPlan = (dto: CreatePlanDto) => { const created = billingService.createPlan(dto); setPlans((items) => [...items, created.plan]); setInstallments((items) => [...items, ...created.installments]); };
  const requestAdjustment = (dto: RequestAdjustmentDto) => setAdjustments((items) => [...items, billingService.requestAdjustment(dto, operator)]);

  const authorizeAdjustment = (id: string) => {
    const target = adjustments.find((item) => item.id === id);
    if (!target || target.status !== "Por autorizar") return;
    setAdjustments((items) => items.map((item) => item.id === id ? { ...item, status: "Aplicada", authorizedBy: authorizer } : item));
    if (target.kind === "Descuento") setCharges((items) => items.map((charge) => charge.id === target.originId ? billingService.applyDiscount(charge, target.amount) : charge));
    if (target.kind === "Anulación") setCharges((items) => items.map((charge) => charge.id === target.originId ? { ...charge, status: "Anulado" } : charge));
    if (target.kind === "Devolución") setReceipts((items) => items.map((receipt) => receipt.id === payments.find((payment) => payment.id === target.originId)?.receiptId ? { ...receipt, status: "Anulado" } : receipt));
  };

  const rejectAdjustment = (id: string) => setAdjustments((items) => items.map((item) => item.id === id ? { ...item, status: "Rechazada", authorizedBy: authorizer } : item));
  const sendReceipt = (id: string, email: string) => setReceipts((items) => items.map((item) => item.id === id ? { ...item, sentTo: email } : item));

  const value = { chargesOf, paymentsOf, adjustmentsOf, receiptsOf, planOf, installmentsOf, summaryOf, addCharge, registerPayment, createPlan, requestAdjustment, authorizeAdjustment, rejectAdjustment, sendReceipt };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBilling() {
  const value = useContext(Context);
  if (!value) throw new Error("useBilling debe utilizarse dentro de BillingProvider");
  return value;
}
