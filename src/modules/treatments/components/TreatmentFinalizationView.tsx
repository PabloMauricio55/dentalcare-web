"use client";

import { CheckCircle2, PlusCircle, Trash2, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { FinalizeProcedureMaterialDto } from "@/modules/treatments/dtos/finalize-procedure.dto";
import { treatmentMaterialCatalog, treatmentMaterialUnits } from "@/modules/treatments/mocks/treatment-materials";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { validateFinalizeProcedure } from "@/modules/treatments/validation/finalize-procedure.schema";
import { ActionNotice, Button, ConfirmDialog, EmptyState, PageHeader, StatusBadge } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

type MaterialDraft = FinalizeProcedureMaterialDto & { key: number };

const emptyMaterial = (key: number): MaterialDraft => ({ key, name: "", quantity: 1, unit: "unidad", notes: "" });

export function TreatmentFinalizationView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, procedureRecords, procedureCompletions, treatmentCharges, finalizeProcedure } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [effectivePatientId, plans]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [materials, setMaterials] = useState<MaterialDraft[]>([emptyMaterial(1)]);
  const [nextMaterialKey, setNextMaterialKey] = useState(2);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const selectedPlan = patientPlans.find((plan) => plan.id === selectedPlanId);
  const planRecords = procedureRecords.filter((record) => record.patientId === effectivePatientId && record.treatmentPlanId === selectedPlanId);
  const availableRecords = planRecords.filter((record) => record.status === "Registrado");
  const selectedRecord = planRecords.find((record) => record.id === selectedRecordId);
  const selectedProcedure = selectedPlan?.procedures.find((procedure) => procedure.id === selectedRecord?.procedureId);
  const completion = procedureCompletions.find((item) => item.procedureRecordId === selectedRecordId);
  const charge = treatmentCharges.find((item) => item.procedureRecordId === selectedRecordId);
  const materialDtos = materials.map((material) => ({
    name: material.name,
    quantity: material.quantity,
    unit: material.unit,
    notes: material.notes,
  }));
  const draft = {
    patientId: effectivePatientId,
    treatmentPlanId: selectedPlanId,
    procedureRecordId: selectedRecordId,
    description: selectedRecord?.procedureName ?? "",
    amount: selectedProcedure ? treatmentService.procedureSubtotal(selectedProcedure) : 0,
    materials: materialDtos,
  };
  const errors = hasAttemptedSubmit ? validateFinalizeProcedure(draft) : {};

  const resetSelection = () => {
    setSelectedRecordId("");
    setMaterials([emptyMaterial(1)]);
    setNextMaterialKey(2);
    setHasAttemptedSubmit(false);
    setConfirmationOpen(false);
    setNotice("");
  };
  const changePatient = (patientId: string) => {
    selectPatient(patientId);
    setSelectedPlanId("");
    resetSelection();
  };
  const changePlan = (planId: string) => {
    setSelectedPlanId(planId);
    resetSelection();
  };
  const changeRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setMaterials([emptyMaterial(1)]);
    setNextMaterialKey(2);
    setHasAttemptedSubmit(false);
    setConfirmationOpen(false);
    setNotice("");
  };
  const updateMaterial = (key: number, field: keyof FinalizeProcedureMaterialDto, value: string) => {
    setMaterials((current) => current.map((material) => material.key === key ? {
      ...material,
      [field]: field === "quantity" ? Number(value) : value,
    } : material));
  };
  const addMaterial = () => {
    setMaterials((current) => [...current, emptyMaterial(nextMaterialKey)]);
    setNextMaterialKey((current) => current + 1);
  };
  const requestFinalization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (!selectedRecord || selectedRecord.status !== "Registrado" || Object.keys(validateFinalizeProcedure(draft)).length) return;
    setConfirmationOpen(true);
  };
  const confirmFinalization = () => {
    if (!selectedRecord || selectedRecord.status !== "Registrado" || completion || charge) {
      setConfirmationOpen(false);
      return;
    }
    finalizeProcedure(draft);
    setConfirmationOpen(false);
    setHasAttemptedSubmit(false);
    setNotice("El procedimiento fue finalizado y el cargo fue generado correctamente.");
  };

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para finalizar procedimientos.</p></section>;

  return <>
    <PageHeader title="Finalizar y materiales" description="Registra los materiales utilizados y finaliza procedimientos realizados." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => changePatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className={`card ${styles.finalizationSelectors}`}>
      <label className="field"><span>Plan de tratamiento</span><select value={selectedPlanId} onChange={(event) => changePlan(event.target.value)}><option value="">Seleccionar plan</option>{patientPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.status} · {formatCurrency(treatmentService.planTotal(plan.procedures))}</option>)}</select></label>
      <label className="field"><span>Procedimiento registrado</span><select value={selectedRecordId} disabled={!selectedPlan} aria-invalid={Boolean(errors.procedure)} onChange={(event) => changeRecord(event.target.value)}><option value="">Seleccionar procedimiento</option>{planRecords.map((record) => <option key={record.id} value={record.id}>{record.procedureName}{record.tooth ? ` · Pieza ${record.tooth}` : ""} · {record.status}</option>)}</select>{errors.procedure && <small className={styles.fieldError}>{errors.procedure}</small>}</label>
    </section>
    {!selectedPlan && <section className="card"><EmptyState title={patientPlans.length ? "Selecciona un plan" : "Sin planes disponibles"} description={patientPlans.length ? "Los procedimientos registrados aparecerán aquí." : "Este paciente todavía no tiene planes de tratamiento."} /></section>}
    {selectedPlan && !selectedRecord && <section className="card"><EmptyState title={planRecords.length ? "Selecciona un procedimiento registrado" : "No hay procedimientos registrados disponibles para finalizar"} description={planRecords.length ? (availableRecords.length ? "Podrás revisar sus datos y registrar los materiales utilizados." : "Los procedimientos de este plan ya fueron finalizados y pueden consultarse en modo lectura.") : "Registra primero un procedimiento desde la sección Registrar procedimiento."} /></section>}
    {selectedPlan && selectedRecord && <>
      <section className={`card ${styles.finalizationCard}`}>
        <div className="card-heading"><div><h3>Resumen del procedimiento</h3><p>Información obtenida del registro y del plan seleccionados.</p></div><StatusBadge status={selectedRecord.status} /></div>
        <div className={styles.finalizationSummary}>
          <div><span>Procedimiento</span><strong>{selectedRecord.procedureName}</strong></div><div><span>Pieza</span><strong>{selectedRecord.tooth || "No aplica"}</strong></div><div><span>Profesional</span><strong>{selectedRecord.professional}</strong></div><div><span>Fecha y hora</span><strong>{selectedRecord.date} · {selectedRecord.time}</strong></div><div><span>Observaciones</span><strong>{selectedRecord.notes || "Sin observaciones."}</strong></div><div><span>Valor relacionado</span><strong>{selectedProcedure ? formatCurrency(treatmentService.procedureSubtotal(selectedProcedure)) : "No disponible"}</strong></div>
        </div>
        {selectedRecord.status === "Registrado" && <form className={styles.materialsForm} onSubmit={requestFinalization}>
          <div className={styles.materialsHeading}><div><h3>Materiales utilizados</h3><p>Registro demostrativo sin movimientos de inventario.</p></div><Button type="button" variant="secondary" onClick={addMaterial}><PlusCircle size={16} /> Agregar material</Button></div>
          {materials.map((material, index) => <div className={styles.materialRow} key={material.key}>
            <label className="field"><span>Material</span><select value={material.name} onChange={(event) => updateMaterial(material.key, "name", event.target.value)}><option value="">Seleccionar material</option>{treatmentMaterialCatalog.map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className="field"><span>Cantidad</span><input type="number" min="0.01" step="0.01" value={material.quantity || ""} onChange={(event) => updateMaterial(material.key, "quantity", event.target.value)} /></label>
            <label className="field"><span>Unidad</span><select value={material.unit} onChange={(event) => updateMaterial(material.key, "unit", event.target.value)}>{treatmentMaterialUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
            <label className="field"><span>Observación</span><input value={material.notes} onChange={(event) => updateMaterial(material.key, "notes", event.target.value)} placeholder="Opcional" /></label>
            <button className={styles.removeButton} type="button" aria-label={`Eliminar material ${index + 1}`} disabled={materials.length === 1} onClick={() => setMaterials((current) => current.filter((item) => item.key !== material.key))}><Trash2 size={17} /></button>
          </div>)}
          {errors.materials && <p className="form-error">{errors.materials}</p>}
          <div className={styles.finalizationActions}><Button type="submit"><CheckCircle2 size={17} /> Finalizar procedimiento</Button></div>
        </form>}
        {completion && <div className={styles.completionSection}><h3>Materiales utilizados</h3><div className={styles.materialReadOnly}>{completion.materials.map((material) => <div key={material.id}><strong>{material.name}</strong><span>{material.quantity} {material.unit}</span><small>{material.notes || "Sin observación."}</small></div>)}</div></div>}
      </section>
      {charge && <section className={`card ${styles.chargeCard}`}><div><span>Cargo generado</span><h3>{charge.description}</h3><p>Creado al finalizar el procedimiento.</p></div><div><strong>{formatCurrency(charge.amount)}</strong><StatusBadge status={charge.status} /></div></section>}
    </>}
    <ConfirmDialog open={confirmationOpen} title="Finalizar procedimiento" message="¿Confirmas la finalización de este procedimiento? Se registrarán los materiales utilizados y se generará el cargo correspondiente." confirmLabel="Sí, finalizar procedimiento" onClose={() => setConfirmationOpen(false)} onConfirm={confirmFinalization} />
  </>;
}
