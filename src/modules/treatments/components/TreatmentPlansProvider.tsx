"use client";

import { createContext, useContext, useState } from "react";
import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import type { CreateProcedureRecordDto } from "@/modules/treatments/dtos/create-procedure-record.dto";
import { initialTreatmentBudgets } from "@/modules/treatments/mocks/treatment-budgets";
import { initialTreatmentConsents } from "@/modules/treatments/mocks/treatment-consents";
import { initialTreatmentPlans } from "@/modules/treatments/mocks/treatment-plans";
import { initialTreatmentProcedureRecords } from "@/modules/treatments/mocks/treatment-procedure-records";
import type { TreatmentBudget, TreatmentConsent, TreatmentPlan, TreatmentProcedureRecord } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";

type TreatmentPlansContextValue = {
  plans: TreatmentPlan[];
  budgets: TreatmentBudget[];
  consents: TreatmentConsent[];
  procedureRecords: TreatmentProcedureRecord[];
  addPlan: (dto: CreateTreatmentPlanDto) => TreatmentPlan;
  approvePlan: (id: string) => void;
  generateBudget: (patientId: string, treatmentPlanId: string) => TreatmentBudget;
  approveBudget: (id: string) => void;
  ensureConsent: (patientId: string, treatmentPlanId: string) => TreatmentConsent;
  acceptConsent: (id: string) => void;
  addProcedureRecord: (dto: CreateProcedureRecordDto) => TreatmentProcedureRecord;
};

const TreatmentPlansContext = createContext<TreatmentPlansContextValue | null>(null);

export function TreatmentPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState(initialTreatmentPlans);
  const [budgets, setBudgets] = useState(initialTreatmentBudgets);
  const [consents, setConsents] = useState(initialTreatmentConsents);
  const [procedureRecords, setProcedureRecords] = useState(initialTreatmentProcedureRecords);
  const addPlan = (dto: CreateTreatmentPlanDto) => {
    const plan = treatmentService.create(dto);
    setPlans((current) => [plan, ...current]);
    return plan;
  };
  const approvePlan = (id: string) => {
    setPlans((current) => current.map((plan) => plan.id === id ? { ...plan, status: "Aprobado" } : plan));
  };
  const generateBudget = (patientId: string, treatmentPlanId: string) => {
    const existingBudget = budgets.find((budget) => budget.treatmentPlanId === treatmentPlanId);
    if (existingBudget) return existingBudget;
    const budget = treatmentService.createBudget(patientId, treatmentPlanId);
    setBudgets((current) => [budget, ...current]);
    return budget;
  };
  const approveBudget = (id: string) => {
    const approvedAt = new Intl.DateTimeFormat("en-CA").format(new Date());
    setBudgets((current) => current.map((budget) => budget.id === id ? { ...budget, status: "Aprobado", approvedAt } : budget));
  };
  const ensureConsent = (patientId: string, treatmentPlanId: string) => {
    const existingConsent = consents.find((consent) => consent.patientId === patientId && consent.treatmentPlanId === treatmentPlanId);
    if (existingConsent) return existingConsent;
    const consent = treatmentService.createConsent(patientId, treatmentPlanId);
    setConsents((current) => [consent, ...current]);
    return consent;
  };
  const acceptConsent = (id: string) => {
    const acceptedAt = new Intl.DateTimeFormat("en-CA").format(new Date());
    setConsents((current) => current.map((consent) => consent.id === id ? { ...consent, status: "Aceptado", acceptedAt } : consent));
  };
  const addProcedureRecord = (dto: CreateProcedureRecordDto) => {
    const record = treatmentService.createProcedureRecord(dto);
    setProcedureRecords((current) => [record, ...current]);
    return record;
  };
  return <TreatmentPlansContext.Provider value={{ plans, budgets, consents, procedureRecords, addPlan, approvePlan, generateBudget, approveBudget, ensureConsent, acceptConsent, addProcedureRecord }}>{children}</TreatmentPlansContext.Provider>;
}

export function useTreatmentPlans() {
  const context = useContext(TreatmentPlansContext);
  if (!context) throw new Error("useTreatmentPlans debe utilizarse dentro de TreatmentPlansProvider");
  return context;
}
