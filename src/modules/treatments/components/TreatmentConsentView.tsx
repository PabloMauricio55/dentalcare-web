"use client";

import { Eye, FileCheck2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { TreatmentConsent } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { ActionNotice, Button, ConfirmDialog, EmptyState, Modal, PageHeader, StatusBadge } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

export function TreatmentConsentView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, consents, ensureConsent, acceptConsent } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [effectivePatientId, plans]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<TreatmentConsent | null>(null);
  const [notice, setNotice] = useState("");
  const selectedPlan = patientPlans.find((plan) => plan.id === selectedPlanId);
  const selectedConsent = consents.find((consent) => consent.patientId === effectivePatientId && consent.treatmentPlanId === selectedPlanId);

  const changePatient = (patientId: string) => {
    selectPatient(patientId);
    setSelectedPlanId("");
    setPreviewOpen(false);
    setConfirmation(null);
    setNotice("");
  };
  const changePlan = (planId: string) => {
    setSelectedPlanId(planId);
    setPreviewOpen(false);
    setConfirmation(null);
    setNotice("");
    if (planId) ensureConsent(effectivePatientId, planId);
  };
  const confirmConsent = () => {
    if (!confirmation) return;
    acceptConsent(confirmation.id);
    setConfirmation(null);
    setNotice("El consentimiento fue aceptado correctamente.");
  };

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para gestionar consentimientos.</p></section>;

  return <>
    <PageHeader title="Consentimientos" description="Revisa el consentimiento informado asociado al plan de tratamiento del paciente." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => changePatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className={`card ${styles.budgetSelector}`}>
      <div><h3>Plan de tratamiento</h3><p>Selecciona el plan relacionado con el consentimiento.</p></div>
      <label className="field"><span>Plan del paciente</span><select value={selectedPlanId} onChange={(event) => changePlan(event.target.value)}><option value="">Seleccionar plan</option>{patientPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.status} · {formatCurrency(treatmentService.planTotal(plan.procedures))}</option>)}</select></label>
    </section>
    {!selectedPlan && <section className="card"><EmptyState title={patientPlans.length ? "Selecciona un plan" : "Sin planes disponibles"} description={patientPlans.length ? "El consentimiento y su previsualización aparecerán aquí." : "Crea primero un plan de tratamiento para este paciente."} /></section>}
    {selectedPlan && selectedConsent && <section className={`card ${styles.consentCard}`}>
      <div className={styles.consentHeader}>
        <div><span>Consentimiento informado</span><h3>Tratamiento odontológico</h3><p>Asociado al plan “{selectedPlan.name}”.</p></div>
        <StatusBadge status={selectedConsent.status} />
      </div>
      <div className={styles.consentSummary}>
        <div><span>Paciente</span><strong>{patient.name}</strong><small>{patient.code}</small></div>
        <div><span>Profesional</span><strong>{selectedPlan.professional}</strong><small>{selectedPlan.date}</small></div>
        <div><span>Procedimientos</span><strong>{selectedPlan.procedures.length}</strong><small>Incluidos en el plan</small></div>
      </div>
      <div className={styles.consentActions}>
        <Button variant="secondary" onClick={() => setPreviewOpen(true)}><Eye size={17} /> Previsualizar consentimiento</Button>
        {selectedConsent.status === "Pendiente" && <Button onClick={() => setConfirmation(selectedConsent)}><FileCheck2 size={17} /> Confirmar consentimiento</Button>}
      </div>
    </section>}
    <Modal open={previewOpen && Boolean(selectedPlan && selectedConsent)} title="Previsualización del consentimiento" description="Documento simulado para revisión dentro de DentalCare." onClose={() => setPreviewOpen(false)} footer={<Button variant="ghost" onClick={() => setPreviewOpen(false)}>Cerrar</Button>}>
      {selectedPlan && selectedConsent && <article className={styles.consentDocument}>
        <header><small>DentalCare · Clínica Central</small><h3>Consentimiento informado para tratamiento odontológico</h3><StatusBadge status={selectedConsent.status} /></header>
        <div className={styles.documentInfo}><div><span>Paciente</span><strong>{patient.name}</strong><small>{patient.code}</small></div><div><span>Plan</span><strong>{selectedPlan.name}</strong><small>{selectedPlan.date}</small></div><div><span>Profesional</span><strong>{selectedPlan.professional}</strong></div></div>
        <section><h4>Procedimientos incluidos</h4><ul>{selectedPlan.procedures.map((procedure) => <li key={procedure.id}>{procedure.name}{procedure.tooth ? ` — pieza ${procedure.tooth}` : ""}</li>)}</ul></section>
        <section><h4>Declaración</h4><p>El paciente declara haber recibido información sobre el plan de tratamiento seleccionado, los procedimientos incluidos y las indicaciones generales relacionadas con su atención.</p><p>La información presentada corresponde a una simulación académica del sistema DentalCare y no constituye un documento legal.</p></section>
        <div className={styles.acceptanceSpace}><span>Aceptación del paciente</span><div /><small>Espacio visual de aceptación. No representa una firma digital.</small></div>
      </article>}
    </Modal>
    <ConfirmDialog open={Boolean(confirmation)} title="Confirmar consentimiento" message="¿Confirmas que el consentimiento del paciente fue revisado y aceptado?" confirmLabel="Sí, confirmar consentimiento" onClose={() => setConfirmation(null)} onConfirm={confirmConsent} />
  </>;
}
