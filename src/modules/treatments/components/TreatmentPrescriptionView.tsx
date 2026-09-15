"use client";

import { Eye, PlusCircle, Save, Trash2, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { CreatePrescriptionMedicationDto } from "@/modules/treatments/dtos/create-treatment-prescription.dto";
import { treatmentService } from "@/modules/treatments/services/treatment.service";
import { validateTreatmentPrescription } from "@/modules/treatments/validation/treatment-prescription.schema";
import { ActionNotice, Button, EmptyState, Modal, PageHeader, StatusBadge } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useTreatmentPlans } from "./TreatmentPlansProvider";
import styles from "./treatments.module.css";

type MedicationDraft = CreatePrescriptionMedicationDto & { key: number };

const emptyMedication = (key: number): MedicationDraft => ({ key, name: "", dose: "", frequency: "", duration: "", notes: "" });
const emptyInstructions = { generalCare: "", recommendations: "", restrictions: "", nextControl: "", observations: "" };

const formatFriendlyDate = (date: string) => new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(new Date(`${date}T12:00:00`));

export function TreatmentPrescriptionView() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const { plans, procedureRecords, treatmentCharges, prescriptions, savePrescription } = useTreatmentPlans();
  const effectivePatientId = selectedPatientId ?? patients[0]?.id ?? "";
  const patient = patients.find((item) => item.id === effectivePatientId);
  const patientPlans = useMemo(() => plans.filter((plan) => plan.patientId === effectivePatientId), [effectivePatientId, plans]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [instructions, setInstructions] = useState(emptyInstructions);
  const [medications, setMedications] = useState<MedicationDraft[]>([emptyMedication(1)]);
  const [nextMedicationKey, setNextMedicationKey] = useState(2);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const selectedPlan = patientPlans.find((plan) => plan.id === selectedPlanId);
  const finalizedRecords = procedureRecords.filter((record) => record.patientId === effectivePatientId && record.treatmentPlanId === selectedPlanId && record.status === "Finalizado");
  const selectedRecord = finalizedRecords.find((record) => record.id === selectedRecordId);
  const savedPrescription = prescriptions.find((prescription) => prescription.procedureRecordId === selectedRecordId);
  const charge = treatmentCharges.find((item) => item.procedureRecordId === selectedRecordId);
  const medicationDtos = medications.map((medication) => ({ name: medication.name, dose: medication.dose, frequency: medication.frequency, duration: medication.duration, notes: medication.notes }));
  const draft = {
    patientId: effectivePatientId,
    treatmentPlanId: selectedPlanId,
    procedureRecordId: selectedRecordId,
    professional: selectedRecord?.professional ?? "",
    instructions,
    medications: medicationDtos,
  };
  const errors = hasAttemptedSubmit ? validateTreatmentPrescription(draft) : {};

  const resetForm = () => {
    setSelectedRecordId("");
    setInstructions(emptyInstructions);
    setMedications([emptyMedication(1)]);
    setNextMedicationKey(2);
    setHasAttemptedSubmit(false);
    setPreviewOpen(false);
    setNotice("");
  };
  const changePatient = (patientId: string) => {
    selectPatient(patientId);
    setSelectedPlanId("");
    resetForm();
  };
  const changePlan = (planId: string) => {
    setSelectedPlanId(planId);
    resetForm();
  };
  const changeRecord = (recordId: string) => {
    const existing = prescriptions.find((prescription) => prescription.procedureRecordId === recordId);
    setSelectedRecordId(recordId);
    setInstructions(existing?.instructions ?? emptyInstructions);
    setMedications(existing?.medications.map((medication, index) => ({
      key: index + 1,
      name: medication.name,
      dose: medication.dose,
      frequency: medication.frequency,
      duration: medication.duration,
      notes: medication.notes,
    })) ?? [emptyMedication(1)]);
    setNextMedicationKey((existing?.medications.length ?? 1) + 1);
    setHasAttemptedSubmit(false);
    setPreviewOpen(false);
    setNotice("");
  };
  const updateMedication = (key: number, field: keyof CreatePrescriptionMedicationDto, value: string) => {
    setMedications((current) => current.map((medication) => medication.key === key ? { ...medication, [field]: value } : medication));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (!selectedRecord || Object.keys(validateTreatmentPrescription(draft)).length) return;
    savePrescription(draft);
    setHasAttemptedSubmit(false);
    setNotice("Las indicaciones y la receta fueron guardadas correctamente.");
  };

  if (!patient) return <section className="card"><p>No hay pacientes disponibles para registrar recetas.</p></section>;

  return <>
    <PageHeader title="Indicaciones y receta" description="Registra las indicaciones posteriores y prepara una receta simulada." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className={`card ${styles.patientCard}`} aria-label="Paciente seleccionado">
      <div className={styles.patientIdentity}><span className="patient-avatar large"><UserRound size={20} /></span><div><small>Paciente seleccionado</small><strong>{patient.name}</strong><span>{patient.code} · DPI {patient.dpi} · {patient.phone}</span></div></div>
      <label className="compact-field"><span>Cambiar paciente</span><select value={effectivePatientId} onChange={(event) => changePatient(event.target.value)}>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}</select></label>
    </section>
    <section className={`card ${styles.finalizationSelectors}`}>
      <label className="field"><span>Plan de tratamiento</span><select value={selectedPlanId} onChange={(event) => changePlan(event.target.value)}><option value="">Seleccionar plan</option>{patientPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.status} · {formatCurrency(treatmentService.planTotal(plan.procedures))}</option>)}</select></label>
      <label className="field"><span>Procedimiento finalizado</span><select value={selectedRecordId} disabled={!selectedPlan} aria-invalid={Boolean(errors.procedure)} onChange={(event) => changeRecord(event.target.value)}><option value="">Seleccionar procedimiento</option>{finalizedRecords.map((record) => <option key={record.id} value={record.id}>{record.procedureName}{record.tooth ? ` · Pieza ${record.tooth}` : ""} · Finalizado</option>)}</select>{errors.procedure && <small className={styles.fieldError}>{errors.procedure}</small>}</label>
    </section>
    {!selectedPlan && <section className="card"><EmptyState title={patientPlans.length ? "Selecciona un plan" : "Sin planes disponibles"} description={patientPlans.length ? "Los procedimientos finalizados aparecerán aquí." : "Este paciente todavía no tiene planes de tratamiento."} /></section>}
    {selectedPlan && !selectedRecord && <section className="card"><EmptyState title={finalizedRecords.length ? "Selecciona un procedimiento finalizado" : "No hay procedimientos finalizados disponibles"} description={finalizedRecords.length ? "Podrás registrar sus indicaciones y receta." : "Finaliza primero un procedimiento desde la sección Finalizar y materiales."} /></section>}
    {selectedPlan && selectedRecord && <section className={`card ${styles.prescriptionCard}`}>
      <div className="card-heading"><div><h3>Resumen del procedimiento</h3><p>{selectedPlan.name} · {patient.name}</p></div><StatusBadge status={selectedRecord.status} /></div>
      <div className={styles.prescriptionSummary}><div><span>Procedimiento</span><strong>{selectedRecord.procedureName}</strong></div><div><span>Pieza</span><strong>{selectedRecord.tooth || "No aplica"}</strong></div><div><span>Profesional</span><strong>{selectedRecord.professional}</strong></div><div><span>Fecha</span><strong>{formatFriendlyDate(selectedRecord.date)}</strong></div>{charge && <div><span>Cargo relacionado</span><strong>{formatCurrency(charge.amount)}</strong></div>}</div>
      <form className={styles.prescriptionForm} onSubmit={submit}>
        <div className={styles.instructionsSection}><div><h3>Indicaciones para el paciente</h3><p>Información clínica genérica para este prototipo académico.</p></div><div className={styles.instructionsGrid}>
          <label className="field"><span>Cuidados generales</span><textarea rows={3} value={instructions.generalCare} onChange={(event) => setInstructions((current) => ({ ...current, generalCare: event.target.value }))} placeholder="Cuidados posteriores al procedimiento" /></label>
          <label className="field"><span>Recomendaciones</span><textarea rows={3} value={instructions.recommendations} onChange={(event) => setInstructions((current) => ({ ...current, recommendations: event.target.value }))} placeholder="Recomendaciones generales" /></label>
          <label className="field"><span>Restricciones</span><textarea rows={3} value={instructions.restrictions} onChange={(event) => setInstructions((current) => ({ ...current, restrictions: event.target.value }))} placeholder="Restricciones temporales" /></label>
          <label className="field"><span>Próximo control</span><input type="date" value={instructions.nextControl} onChange={(event) => setInstructions((current) => ({ ...current, nextControl: event.target.value }))} /></label>
          <label className="field full"><span>Observaciones</span><textarea rows={3} value={instructions.observations} onChange={(event) => setInstructions((current) => ({ ...current, observations: event.target.value }))} placeholder="Observaciones adicionales" /></label>
        </div></div>
        <div className={styles.medicationsSection}>
          <div className={styles.materialsHeading}><div><h3>Receta</h3><p>Medicamentos demostrativos sin validez médica ni legal.</p></div><Button type="button" variant="secondary" onClick={() => { setMedications((current) => [...current, emptyMedication(nextMedicationKey)]); setNextMedicationKey((current) => current + 1); }}><PlusCircle size={16} /> Agregar medicamento</Button></div>
          {medications.map((medication, index) => <div className={styles.medicationCard} key={medication.key}>
            <label className="field"><span>Medicamento</span><input value={medication.name} onChange={(event) => updateMedication(medication.key, "name", event.target.value)} placeholder="Ej. Medicamento demostrativo" /></label>
            <label className="field"><span>Dosis</span><input value={medication.dose} onChange={(event) => updateMedication(medication.key, "dose", event.target.value)} placeholder="Ej. 1 tableta" /></label>
            <label className="field"><span>Frecuencia</span><input value={medication.frequency} onChange={(event) => updateMedication(medication.key, "frequency", event.target.value)} placeholder="Ej. Cada 8 horas" /></label>
            <label className="field"><span>Duración</span><input value={medication.duration} onChange={(event) => updateMedication(medication.key, "duration", event.target.value)} placeholder="Ej. 3 días" /></label>
            <label className="field"><span>Indicaciones adicionales</span><input value={medication.notes} onChange={(event) => updateMedication(medication.key, "notes", event.target.value)} placeholder="Opcional" /></label>
            <button className={styles.removeButton} type="button" aria-label={`Eliminar medicamento ${index + 1}`} disabled={medications.length === 1} onClick={() => setMedications((current) => current.filter((item) => item.key !== medication.key))}><Trash2 size={17} /></button>
          </div>)}
          {errors.medications && <p className="form-error">{errors.medications}</p>}
        </div>
        <div className={styles.prescriptionActions}>{savedPrescription && <Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)}><Eye size={17} /> Previsualizar receta</Button>}<Button type="submit"><Save size={17} /> Guardar indicaciones y receta</Button></div>
      </form>
    </section>}
    <Modal open={previewOpen && Boolean(savedPrescription)} title="Previsualización de receta" description="Documento simulado para revisión dentro de DentalCare." onClose={() => setPreviewOpen(false)} footer={<Button variant="ghost" onClick={() => setPreviewOpen(false)}>Cerrar</Button>}>
      {savedPrescription && selectedRecord && <article className={styles.prescriptionDocument}>
        <header><small>DentalCare · Clínica Central</small><h3>Receta</h3><StatusBadge status={savedPrescription.status} /></header>
        <div className={styles.prescriptionDocumentInfo}><div><span>Paciente</span><strong>{patient.name}</strong><small>{patient.code}</small></div><div><span>Profesional</span><strong>{savedPrescription.professional}</strong></div><div><span>Fecha de emisión</span><strong>{formatFriendlyDate(savedPrescription.date)}</strong></div><div><span>Procedimiento</span><strong>{selectedRecord.procedureName}</strong><small>{selectedRecord.tooth ? `Pieza ${selectedRecord.tooth}` : "Sin pieza específica"}</small></div></div>
        <section><h4>Medicamentos</h4><ol>{savedPrescription.medications.map((medication) => <li key={medication.id}><strong>{medication.name}</strong><span>{medication.dose} · {medication.frequency} · {medication.duration}</span>{medication.notes && <small>{medication.notes}</small>}</li>)}</ol></section>
        <section><h4>Indicaciones para el paciente</h4><div className={styles.previewInstructions}>{savedPrescription.instructions.generalCare && <p><strong>Cuidados generales:</strong> {savedPrescription.instructions.generalCare}</p>}{savedPrescription.instructions.recommendations && <p><strong>Recomendaciones:</strong> {savedPrescription.instructions.recommendations}</p>}{savedPrescription.instructions.restrictions && <p><strong>Restricciones:</strong> {savedPrescription.instructions.restrictions}</p>}{savedPrescription.instructions.nextControl && <p><strong>Próximo control:</strong> {formatFriendlyDate(savedPrescription.instructions.nextControl)}</p>}{savedPrescription.instructions.observations && <p><strong>Observaciones:</strong> {savedPrescription.instructions.observations}</p>}{!Object.values(savedPrescription.instructions).some(Boolean) && <p>Sin indicaciones adicionales registradas.</p>}</div></section>
        <footer>Esta receta corresponde a una simulación académica del sistema DentalCare y no tiene validez médica ni legal.</footer>
      </article>}
    </Modal>
  </>;
}
