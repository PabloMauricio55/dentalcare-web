"use client";

import { ClipboardList, Eye, Plus, PlusCircle, Trash2, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { CreateTreatmentProcedureDto } from "@/modules/treatments/dtos/create-treatment-plan.dto";
import type { TreatmentPlan } from "@/modules/treatments/models/treatment.model";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { validateTreatmentPlan, type TreatmentPlanErrors } from "@/modules/treatments/validation/treatment.schema";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

const emptyProcedure = (): CreateTreatmentProcedureDto => ({ name: "", tooth: "", quantity: 1, unitPrice: 0 });

export function TreatmentPlansView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, addPlan, approvePlan } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const [openNew, setOpenNew] = useState(false);
  const [detail, setDetail] = useState<TreatmentPlan | null>(null);
  const [approval, setApproval] = useState<TreatmentPlan | null>(null);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<TreatmentPlanErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [procedures, setProcedures] = useState<CreateTreatmentProcedureDto[]>([emptyProcedure()]);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [plans, effectivePatientId]);
  const draftTotal = treatmentService.planTotal(procedures);
  const proceduresError = hasAttemptedSubmit ? validateTreatmentPlan({
      patientId: effectivePatientId,
      name: "Plan válido",
      professional: "Profesional válido",
      observations: "",
      procedures,
    }).procedures : undefined;

  const resetForm = () => {
    setErrors({});
    setHasAttemptedSubmit(false);
    setProcedures([emptyProcedure()]);
  };
  const revalidateRequiredField = (field: "name" | "professional", value: string) => {
    if (!hasAttemptedSubmit) return;
    const message = field === "name" ? "El nombre del plan es obligatorio." : "Selecciona un profesional.";
    setErrors((current) => ({ ...current, [field]: value.trim() ? undefined : message }));
  };
  const setProcedureList = (nextProcedures: CreateTreatmentProcedureDto[]) => {
    setProcedures(nextProcedures);
  };
  const updateProcedure = (index: number, field: keyof CreateTreatmentProcedureDto, value: string) => {
    const nextProcedures = procedures.map((item, itemIndex) => itemIndex === index ? {
      ...item,
      [field]: field === "quantity" || field === "unitPrice" ? Number(value) : value,
    } : item);
    setProcedureList(nextProcedures);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    const form = new FormData(event.currentTarget);
    const dto = {
      patientId: effectivePatientId,
      name: String(form.get("name") ?? ""),
      professional: String(form.get("professional") ?? ""),
      observations: String(form.get("observations") ?? ""),
      procedures,
    };
    const validationErrors = validateTreatmentPlan(dto);
    if (Object.keys(validationErrors).length) {
      setErrors({ name: validationErrors.name, professional: validationErrors.professional });
      return;
    }
    const plan = addPlan(dto);
    setOpenNew(false);
    resetForm();
    setNotice(`El plan “${plan.name}” fue creado en estado Borrador.`);
  };
  const requestApproval = (plan: TreatmentPlan) => {
    setDetail(null);
    setApproval(plan);
  };
  const confirmApproval = () => {
    if (!approval) return;
    approvePlan(approval.id);
    setNotice(`El plan “${approval.name}” fue aprobado.`);
    setApproval(null);
  };
  const columns: Column<TreatmentPlan>[] = [
    { key: "plan", header: "Plan", cell: (row) => <div className="cell-stack"><strong>{row.name}</strong><small>{row.date}</small></div> },
    { key: "professional", header: "Profesional", cell: (row) => row.professional },
    { key: "procedures", header: "Procedimientos", cell: (row) => row.procedures.length },
    { key: "total", header: "Total", cell: (row) => <strong>{formatCurrency(treatmentService.planTotal(row.procedures))}</strong> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => <div className="table-actions"><button aria-label={`Ver ${row.name}`} onClick={() => setDetail(row)}><Eye size={16} /></button>{row.status === "Borrador" && <Button onClick={() => requestApproval(row)}>Aprobar plan</Button>}</div> },
  ];

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para crear planes de tratamiento.</p></section>;

  return <>
    <PageHeader title="Planes de tratamiento" description="Crea, revisa y aprueba propuestas clínicas para el paciente seleccionado." actions={<Button onClick={() => { resetForm(); setOpenNew(true); }}><Plus size={17} /> Nuevo plan</Button>} />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => selectPatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className="card">
      <div className="card-heading"><div><h3>Planes registrados</h3><p>{patientPlans.length} planes asociados a {patient.name}</p></div></div>
      <DataTable columns={columns} rows={patientPlans} emptyMessage="Este paciente todavía no tiene planes de tratamiento." />
    </section>

    <Modal open={openNew} title="Nuevo plan de tratamiento" description={`Paciente: ${patient.name}`} onClose={() => setOpenNew(false)}>
      <form className={`form-grid ${styles.planForm}`} onSubmit={submit}>
        <label className="field full"><span>Nombre del plan *</span><input name="name" aria-invalid={Boolean(errors.name)} onChange={(event) => revalidateRequiredField("name", event.target.value)} placeholder="Ej. Rehabilitación sector superior" />{errors.name && <small className={styles.fieldError}>{errors.name}</small>}</label>
        <label className="field full"><span>Profesional *</span><select name="professional" defaultValue="" onChange={(event) => revalidateRequiredField("professional", event.target.value)}><option value="" disabled>Seleccionar profesional</option><option>Dra. Elena Castillo</option><option>Dr. Mario Morales</option></select>{errors.professional && <small className={styles.fieldError}>{errors.professional}</small>}</label>
        <label className="field full"><span>Observaciones</span><textarea name="observations" rows={3} placeholder="Notas generales del plan" /></label>
        <div className={`full ${styles.procedureSection}`}>
          <div className={styles.sectionHeading}><div><strong>Procedimientos iniciales *</strong><small>Los subtotales se calculan automáticamente.</small></div><Button type="button" variant="secondary" onClick={() => setProcedureList([...procedures, emptyProcedure()])}><PlusCircle size={16} /> Agregar</Button></div>
          {procedures.map((procedure, index) => <div className={styles.procedureEditor} key={index}>
            <label className="field"><span>Procedimiento</span><input value={procedure.name} aria-invalid={Boolean(proceduresError && !procedure.name.trim())} onChange={(event) => updateProcedure(index, "name", event.target.value)} placeholder="Escribe el nombre del procedimiento" /></label>
            <label className="field"><span>Pieza</span><input value={procedure.tooth} onChange={(event) => updateProcedure(index, "tooth", event.target.value)} placeholder="16" /></label>
            <label className="field"><span>Cantidad</span><input min="1" type="number" value={procedure.quantity} onChange={(event) => updateProcedure(index, "quantity", event.target.value)} /></label>
            <label className="field"><span>Precio unitario</span><input min="0.01" step="0.01" type="number" value={procedure.unitPrice || ""} onChange={(event) => updateProcedure(index, "unitPrice", event.target.value)} placeholder="0.00" /></label>
            <div className={styles.subtotal}><span>Subtotal</span><strong>{formatCurrency(treatmentService.procedureSubtotal(procedure))}</strong></div>
            <button className={styles.removeButton} type="button" aria-label={`Eliminar procedimiento ${index + 1}`} disabled={procedures.length === 1} onClick={() => setProcedureList(procedures.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={17} /></button>
          </div>)}
          {proceduresError && <p className="form-error">{proceduresError}</p>}
          <div className={styles.formTotal}><span>Total del plan</span><strong>{formatCurrency(draftTotal)}</strong></div>
        </div>
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setOpenNew(false)}>Cancelar</Button><Button type="submit"><ClipboardList size={17} /> Guardar plan</Button></div>
      </form>
    </Modal>

    <Modal open={Boolean(detail)} title={detail?.name ?? "Detalle del plan"} description={detail ? `${detail.professional} · ${detail.date}` : undefined} onClose={() => setDetail(null)}>
      {detail && <div className={styles.detailStack}><div className={styles.detailMeta}><StatusBadge status={detail.status} /><span>{detail.observations || "Sin observaciones."}</span></div><div className={styles.detailProcedures}>{detail.procedures.map((procedure) => <div key={procedure.id}><div><strong>{procedure.name}</strong><small>{procedure.tooth ? `Pieza ${procedure.tooth} · ` : ""}{procedure.quantity} × {formatCurrency(procedure.unitPrice)}</small></div><strong>{formatCurrency(treatmentService.procedureSubtotal(procedure))}</strong></div>)}</div><div className={styles.detailTotal}><span>Total</span><strong>{formatCurrency(treatmentService.planTotal(detail.procedures))}</strong></div>{detail.status === "Borrador" && <div className="modal-form-actions"><Button onClick={() => requestApproval(detail)}>Aprobar plan</Button></div>}</div>}
    </Modal>
    <ConfirmDialog open={Boolean(approval)} title="Aprobar plan de tratamiento" message={`¿Confirmas la aprobación de “${approval?.name ?? "este plan"}”? Después quedará marcado como Aprobado durante esta sesión.`} confirmLabel="Sí, aprobar plan" onClose={() => setApproval(null)} onConfirm={confirmApproval} />
  </>;
}
