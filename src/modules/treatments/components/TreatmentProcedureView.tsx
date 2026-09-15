"use client";

import { ClipboardCheck, Eye, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { CreateProcedureRecordDto } from "@/modules/treatments/dtos/create-procedure-record.dto";
import type { TreatmentProcedureRecord } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { validateProcedureRecord } from "@/modules/treatments/validation/procedure-record.schema";
import { ActionNotice, Button, DataTable, EmptyState, Modal, PageHeader, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

const today = () => new Intl.DateTimeFormat("en-CA").format(new Date());

export function TreatmentProcedureView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, procedureRecords, addProcedureRecord } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [effectivePatientId, plans]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedProcedureId, setSelectedProcedureId] = useState("");
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("09:00");
  const [professional, setProfessional] = useState("");
  const [notes, setNotes] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [notice, setNotice] = useState("");
  const [detail, setDetail] = useState<TreatmentProcedureRecord | null>(null);
  const selectedPlan = patientPlans.find((plan) => plan.id === selectedPlanId);
  const selectedProcedure = selectedPlan?.procedures.find((procedure) => procedure.id === selectedProcedureId);
  const records = procedureRecords.filter((record) => record.patientId === effectivePatientId && record.treatmentPlanId === selectedPlanId);
  const draft: CreateProcedureRecordDto = {
    patientId: effectivePatientId,
    treatmentPlanId: selectedPlanId,
    procedureId: selectedProcedure?.id ?? "",
    procedureName: selectedProcedure?.name ?? "",
    tooth: selectedProcedure?.tooth ?? "",
    professional,
    date,
    time,
    notes,
  };
  const errors = hasAttemptedSubmit ? validateProcedureRecord(draft) : {};
  const columns: Column<TreatmentProcedureRecord>[] = [
    { key: "procedure", header: "Procedimiento", cell: (row) => <div className="cell-stack"><strong>{row.procedureName}</strong><small>{row.tooth ? `Pieza ${row.tooth}` : "Sin pieza específica"}</small></div> },
    { key: "date", header: "Fecha", cell: (row) => <div className="cell-stack"><span>{row.date}</span><small>{row.time}</small></div> },
    { key: "professional", header: "Profesional", cell: (row) => row.professional },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "action", header: "", className: "actions-cell", cell: (row) => <Button variant="secondary" onClick={() => setDetail(row)}><Eye size={16} /> Ver detalle</Button> },
  ];

  const changePatient = (patientId: string) => {
    selectPatient(patientId);
    setSelectedPlanId("");
    setSelectedProcedureId("");
    setProfessional("");
    setHasAttemptedSubmit(false);
    setNotice("");
  };
  const changePlan = (planId: string) => {
    const plan = patientPlans.find((item) => item.id === planId);
    setSelectedPlanId(planId);
    setSelectedProcedureId("");
    setProfessional(plan?.professional ?? "");
    setHasAttemptedSubmit(false);
    setNotice("");
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (Object.keys(validateProcedureRecord(draft)).length) return;
    addProcedureRecord(draft);
    setSelectedProcedureId("");
    setNotes("");
    setHasAttemptedSubmit(false);
    setNotice("El procedimiento fue registrado correctamente.");
  };

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para registrar procedimientos.</p></section>;

  return <>
    <PageHeader title="Registrar procedimiento" description="Registra la atención realizada dentro del plan de tratamiento del paciente." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => changePatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className={`card ${styles.budgetSelector}`}>
      <div><h3>Plan de tratamiento</h3><p>Selecciona el plan que contiene el procedimiento realizado.</p></div>
      <label className="field"><span>Plan del paciente</span><select value={selectedPlanId} onChange={(event) => changePlan(event.target.value)}><option value="">Seleccionar plan</option>{patientPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.status} · {formatCurrency(treatmentService.planTotal(plan.procedures))}</option>)}</select></label>
    </section>
    {!selectedPlan && <section className="card"><EmptyState title={patientPlans.length ? "Selecciona un plan" : "Sin planes disponibles"} description={patientPlans.length ? "El formulario y los procedimientos registrados aparecerán aquí." : "Crea primero un plan de tratamiento para este paciente."} /></section>}
    {selectedPlan && <>
      <section className={`card ${styles.recordCard}`}>
        <div className="card-heading"><div><h3>Registro del procedimiento</h3><p>{selectedPlan.name} · {selectedPlan.professional}</p></div></div>
        <form className={styles.recordForm} onSubmit={submit}>
          <label className="field full"><span>Procedimiento *</span><select value={selectedProcedureId} aria-invalid={Boolean(errors.procedure)} onChange={(event) => setSelectedProcedureId(event.target.value)}><option value="">Seleccionar procedimiento</option>{selectedPlan.procedures.map((procedure) => <option key={procedure.id} value={procedure.id}>{procedure.name}{procedure.tooth ? ` · Pieza ${procedure.tooth}` : ""}</option>)}</select>{errors.procedure && <small className={styles.fieldError}>{errors.procedure}</small>}</label>
          {selectedProcedure && <div className={styles.procedureSummary}><div><span>Procedimiento</span><strong>{selectedProcedure.name}</strong></div><div><span>Pieza</span><strong>{selectedProcedure.tooth || "No aplica"}</strong></div><div><span>Precio</span><strong>{formatCurrency(selectedProcedure.unitPrice)}</strong></div><div><span>Plan</span><strong>{selectedPlan.name}</strong></div></div>}
          <label className="field"><span>Fecha *</span><input type="date" value={date} aria-invalid={Boolean(errors.date)} onChange={(event) => setDate(event.target.value)} />{errors.date && <small className={styles.fieldError}>{errors.date}</small>}</label>
          <label className="field"><span>Hora</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
          <label className="field full"><span>Profesional *</span><input value={professional} aria-invalid={Boolean(errors.professional)} onChange={(event) => setProfessional(event.target.value)} />{errors.professional && <small className={styles.fieldError}>{errors.professional}</small>}</label>
          <label className="field full"><span>Observaciones clínicas</span><textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notas breves sobre el procedimiento realizado" /></label>
          <div className={styles.recordActions}><Button type="submit"><ClipboardCheck size={17} /> Registrar procedimiento</Button></div>
        </form>
      </section>
      <section className="card">
        <div className="card-heading"><div><h3>Procedimientos registrados</h3><p>{records.length} registros para el plan seleccionado</p></div></div>
        <DataTable columns={columns} rows={records} emptyMessage="Todavía no hay procedimientos registrados para este plan." />
      </section>
    </>}
    <Modal open={Boolean(detail)} title="Detalle del procedimiento" description="Registro simulado de la atención realizada." onClose={() => setDetail(null)} footer={<Button variant="ghost" onClick={() => setDetail(null)}>Cerrar</Button>}>
      {detail && <div className={styles.recordDetail}><div><span>Paciente</span><strong>{patient.name}</strong></div><div><span>Plan</span><strong>{plans.find((plan) => plan.id === detail.treatmentPlanId)?.name ?? "Plan de tratamiento"}</strong></div><div><span>Procedimiento</span><strong>{detail.procedureName}</strong></div><div><span>Pieza</span><strong>{detail.tooth || "No aplica"}</strong></div><div><span>Profesional</span><strong>{detail.professional}</strong></div><div><span>Fecha y hora</span><strong>{detail.date} · {detail.time}</strong></div><div className={styles.recordDetailFull}><span>Observaciones</span><strong>{detail.notes || "Sin observaciones."}</strong></div><div className={styles.recordDetailFull}><span>Estado</span><StatusBadge status={detail.status} /></div></div>}
    </Modal>
  </>;
}
