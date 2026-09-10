"use client";

import { createContext, useContext, useState } from "react";
import type { CreateTreatmentPlanDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import { initialTreatmentPlans } from "@/modules/treatments/mocks/treatment-plans";
import type { TreatmentPlan } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";

type TreatmentPlansContextValue = {
  plans: TreatmentPlan[];
  addPlan: (dto: CreateTreatmentPlanDto) => TreatmentPlan;
  approvePlan: (id: string) => void;
};

const TreatmentPlansContext = createContext<TreatmentPlansContextValue | null>(null);

export function TreatmentPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState(initialTreatmentPlans);
  const addPlan = (dto: CreateTreatmentPlanDto) => {
    const plan = treatmentService.create(dto);
    setPlans((current) => [plan, ...current]);
    return plan;
  };
  const approvePlan = (id: string) => {
    setPlans((current) => current.map((plan) => plan.id === id ? { ...plan, status: "Aprobado" } : plan));
  };
  return <TreatmentPlansContext.Provider value={{ plans, addPlan, approvePlan }}>{children}</TreatmentPlansContext.Provider>;
}

export function useTreatmentPlans() {
  const context = useContext(TreatmentPlansContext);
  if (!context) throw new Error("useTreatmentPlans debe utilizarse dentro de TreatmentPlansProvider");
  return context;
}
