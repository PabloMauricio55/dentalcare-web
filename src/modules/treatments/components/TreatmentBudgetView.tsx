"use client";

import { FilePlus2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { TreatmentBudget, TreatmentProcedure } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { ActionNotice, Button, ConfirmDialog, DataTable, EmptyState, PageHeader, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

export function TreatmentBudgetView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, budgets, generateBudget, approveBudget } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [effectivePatientId, plans]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [approval, setApproval] = useState<TreatmentBudget | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const selectedPlan = patientPlans.find((plan) => plan.id === selectedPlanId);
  const selectedBudget = budgets.find((budget) => budget.patientId === effectivePatientId && budget.treatmentPlanId === selectedPlanId);
  const total = selectedPlan ? treatmentService.planTotal(selectedPlan.procedures) : 0;
  const columns: Column<TreatmentProcedure>[] = [
    { key: "procedure", header: "Procedimiento", cell: (row) => <strong>{row.name}</strong> },
    { key: "tooth", header: "Pieza", cell: (row) => row.tooth || "No aplica" },
    { key: "quantity", header: "Cantidad", cell: (row) => row.quantity },
    { key: "price", header: "Precio unitario", cell: (row) => formatCurrency(row.unitPrice) },
    { key: "subtotal", header: "Subtotal", cell: (row) => <strong>{formatCurrency(treatmentService.procedureSubtotal(row))}</strong> },
  ];

  const changePatient = (patientId: string) => {
    selectPatient(patientId);
    setSelectedPlanId("");
    setError("");
    setNotice("");
  };
  const changePlan = (planId: string) => {
    setSelectedPlanId(planId);
    setError("");
    setNotice("");
  };
  const createBudget = () => {
    if (!selectedPlan) {
      setError("Selecciona un plan de tratamiento para generar el presupuesto.");
      return;
    }
    generateBudget(effectivePatientId, selectedPlan.id);
    setError("");
    setNotice("El presupuesto fue generado en estado Borrador.");
  };
  const confirmApproval = () => {
    if (!approval) return;
    approveBudget(approval.id);
    setNotice("El presupuesto fue aprobado correctamente.");
    setApproval(null);
  };

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para generar presupuestos.</p></section>;

  return <>
    <PageHeader title="Presupuesto" description="Revisa y aprueba el presupuesto asociado al plan de tratamiento del paciente." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => changePatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className={`card ${styles.budgetSelector}`}>
      <div><h3>Plan de tratamiento</h3><p>Selecciona el plan que dará origen al presupuesto.</p></div>
      <label className="field"><span>Plan del paciente</span><select value={selectedPlanId} onChange={(event) => changePlan(event.target.value)}><option value="">Seleccionar plan</option>{patientPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.status} · {formatCurrency(treatmentService.planTotal(plan.procedures))}</option>)}</select></label>
      {error && <p className={`form-error ${styles.budgetError}`}>{error}</p>}
    </section>
    {!selectedPlan && <section className="card"><EmptyState title={patientPlans.length ? "Selecciona un plan" : "Sin planes disponibles"} description={patientPlans.length ? "El detalle y las acciones del presupuesto aparecerán aquí." : "Crea primero un plan de tratamiento para este paciente."} /></section>}
    {selectedPlan && <section className="card">
      <div className={styles.budgetHeader}>
        <div><span>Plan seleccionado</span><h3>{selectedPlan.name}</h3><p>{selectedPlan.professional} · {selectedPlan.date}</p></div>
        <div className={styles.budgetStatuses}><div><small>Plan</small><StatusBadge status={selectedPlan.status} /></div><div><small>Presupuesto</small>{selectedBudget ? <StatusBadge status={selectedBudget.status} /> : <span className={styles.notGenerated}>No generado</span>}</div></div>
      </div>
      <DataTable columns={columns} rows={selectedPlan.procedures} emptyMessage="El plan no contiene procedimientos para presupuestar." />
      <div className={styles.budgetFooter}>
        <div><span>Total del presupuesto</span><strong>{formatCurrency(total)}</strong></div>
        {!selectedBudget && <Button onClick={createBudget}><FilePlus2 size={17} /> Generar presupuesto</Button>}
        {selectedBudget?.status === "Borrador" && <Button onClick={() => setApproval(selectedBudget)}>Aprobar presupuesto</Button>}
      </div>
    </section>}
    <ConfirmDialog open={Boolean(approval)} title="Aprobar presupuesto" message={`¿Confirmas la aprobación del presupuesto ${approval?.id ?? "seleccionado"} asociado al plan “${selectedPlan?.name ?? ""}”?`} confirmLabel="Sí, aprobar presupuesto" onClose={() => setApproval(null)} onConfirm={confirmApproval} />
  </>;
}
