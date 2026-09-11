"use client";

import { createContext, useContext, useState } from "react";
import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import { initialTreatmentBudgets } from "@/modules/treatments/mocks/treatment-budgets";
import { initialTreatmentPlans } from "@/modules/treatments/mocks/treatment-plans";
import type { TreatmentBudget, TreatmentPlan } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";

type TreatmentPlansContextValue = {
  plans: TreatmentPlan[];
  budgets: TreatmentBudget[];
  addPlan: (dto: CreateTreatmentPlanDto) => TreatmentPlan;
  approvePlan: (id: string) => void;
  generateBudget: (patientId: string, treatmentPlanId: string) => TreatmentBudget;
  approveBudget: (id: string) => void;
};

const TreatmentPlansContext = createContext<TreatmentPlansContextValue | null>(null);

export function TreatmentPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState(initialTreatmentPlans);
  const [budgets, setBudgets] = useState(initialTreatmentBudgets);
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
  return <TreatmentPlansContext.Provider value={{ plans, budgets, addPlan, approvePlan, generateBudget, approveBudget }}>{children}</TreatmentPlansContext.Provider>;
}

export function useTreatmentPlans() {
  const context = useContext(TreatmentPlansContext);
  if (!context) throw new Error("useTreatmentPlans debe utilizarse dentro de TreatmentPlansProvider");
  return context;
}
