"use client";

import { ClipboardCopy, ClipboardPlus, KeyRound, Pencil, Plus, Printer, RotateCcw, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, Pagination, RoleAccessNotice, SearchInput, StatusBadge, type Column } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import { matchesPatient } from "../adapters/patient.adapter";
import type { CreatePatientDto } from "../dtos/patient.dto";
import type { Patient } from "../models/patient";
import { isMinor, validatePatient } from "../validation/patient.validation";
import { PatientSummary } from "./PatientSummary";
import type { PatientAccessCredentials } from "../models/patient-access";
import { auditSessionService } from "@/modules/settings/services/audit-session.service";
import accessStyles from "./patient-access.module.css";

const emptyPatient: CreatePatientDto = {
  name: "", dpi: "", birthDate: "", gender: "Femenino", phone: "", email: "", city: "", address: "",
  emergencyContact: "", emergencyPhone: "", billingName: "", nit: "CF", billingAddress: "",
  guardianName: "", guardianRelationship: "", guardianPhone: "",
};

function dtoFromForm(form: FormData): CreatePatientDto {
  const text = (field: string) => String(form.get(field) ?? "").trim();
  const name = text("name");
  const address = text("address");
  return {
    name,
    dpi: text("dpi"),
    birthDate: text("birthDate"),
    gender: text("gender") as CreatePatientDto["gender"],
    phone: text("phone"),
    email: text("email"),
    city: text("city"),
    address,
    emergencyContact: text("emergencyContact"),
    emergencyPhone: text("emergencyPhone"),
    billingName: text("billingName") || name,
    nit: text("nit") || "CF",
    billingAddress: text("billingAddress") || address,
    guardianName: text("guardianName"),
    guardianRelationship: text("guardianRelationship"),
    guardianPhone: text("guardianPhone"),
  };
}

export function PatientsView() {
  const router = useRouter();
  const { role } = useApp();
  const canManage = roleAccess.canManagePatients(role);
  const { patients, patientAccess, addPatient, updatePatient, createAccess, resetAccess, selectPatient } = useClinicSession();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"new" | "detail" | "edit" | "access" | null>(null);
  const [active, setActive] = useState<Patient | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [formBirthDate, setFormBirthDate] = useState("");
  const [credentials, setCredentials] = useState<PatientAccessCredentials | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const filtered = useMemo(() => patients.filter((patient) => matchesPatient(patient, query)), [patients, query]);

  const openDetail = (patient: Patient) => {
    setActive(patient);
    setCredentials(patientAccess[patient.id] ?? null);
    selectPatient(patient.id);
    setModal("detail");
  };

  const columns: Column<Patient>[] = [
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{row.name}</strong><small>{row.code}</small></div> },
    { key: "contact", header: "Contacto", cell: (row) => <div className="cell-stack"><span>{row.phone}</span><small>{row.email || "Sin correo"}</small></div> },
    { key: "location", header: "Ubicación", cell: (row) => row.city || "Sin registrar" },
    { key: "access", header: "Acceso", cell: (row) => <StatusBadge status={row.accessStatus} /> },
    { key: "action", header: "", className: "actions-cell", cell: (row) => <Button variant="secondary" onClick={() => openDetail(row)}>Ver ficha</Button> },
  ];

  const submitNew = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dto = dtoFromForm(new FormData(event.currentTarget));
    const validationError = validatePatient(dto, patients);
    if (validationError) { setError(validationError); return; }
    const patient = addPatient(dto);
    setActive(patient);
    setModal("detail");
    setError("");
    setNotice("Paciente registrado. Ya puedes crear su acceso y agendar la primera cita.");
  };

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active) return;
    const dto = dtoFromForm(new FormData(event.currentTarget));
    const validationError = validatePatient(dto, patients, active.id);
    if (validationError) { setError(validationError); return; }
    const next = { ...active, ...dto };
    updatePatient(next);
    setActive(next);
    setModal("detail");
    setError("");
    setNotice("Ficha administrativa actualizada.");
  };

  const scheduleFirstAppointment = () => {
    if (!active) return;
    selectPatient(active.id);
    setModal(null);
    router.push(`/agenda/general?patientId=${encodeURIComponent(active.id)}&firstAppointment=1`);
  };

  const registerAudit = (patient: Patient, operation: PatientAccessCredentials["operation"]) => {
    auditSessionService.recordPatientAccess(patient.code, patient.name, operation);
  };

  const handleCreateAccess = () => {
    if (!active) return;
    const generated = createAccess(active.id);
    if (!generated) {
      setNotice("El paciente ya tiene acceso. Utiliza Restablecer acceso para generar credenciales nuevas.");
      return;
    }
    setActive({ ...active, accessStatus: "Activo" });
    setCredentials(generated);
    registerAudit(active, "Creación");
    setModal("access");
    setNotice("Acceso creado. Entrega las credenciales temporales al paciente.");
  };

  const handleResetAccess = () => {
    if (!active) return;
    const generated = resetAccess(active.id);
    setConfirmReset(false);
    if (!generated) {
      setNotice("Primero debes crear el acceso del paciente.");
      return;
    }
    setActive({ ...active, accessStatus: "Activo" });
    setCredentials(generated);
    registerAudit(active, "Restablecimiento");
    setModal("access");
    setNotice("Acceso restablecido. Las credenciales temporales anteriores dejaron de ser válidas en esta simulación.");
  };

  const copyCredentials = async () => {
    if (!active || !credentials) return;
    const content = `DentalCare\nPaciente: ${active.name}\nUsuario: ${credentials.username}\nContraseña temporal: ${credentials.temporaryPassword}\nDebe cambiarla en su primer ingreso.`;
    try {
      await navigator.clipboard.writeText(content);
      setNotice("Credenciales copiadas al portapapeles.");
    } catch {
      setNotice("No fue posible copiar automáticamente. Puedes seleccionar los datos de la presentación.");
    }
  };

  const fields = (value: CreatePatientDto | Patient = emptyPatient) => {
    const minor = isMinor(formBirthDate || value.birthDate);
    return <>
      <div className="full"><h4>Datos personales y contacto</h4></div>
      <label className="field full"><span>Nombre completo *</span><input name="name" defaultValue={value.name} /></label>
      <label className="field"><span>DPI *</span><input name="dpi" defaultValue={value.dpi} placeholder="0000 00000 0000" /></label>
      <label className="field"><span>Fecha de nacimiento *</span><input name="birthDate" type="date" defaultValue={value.birthDate} onChange={(event) => setFormBirthDate(event.target.value)} /></label>
      <label className="field"><span>Género</span><select name="gender" defaultValue={value.gender}><option>Femenino</option><option>Masculino</option><option>Otro</option></select></label>
      <label className="field"><span>Teléfono *</span><input name="phone" defaultValue={value.phone} /></label>
      <label className="field"><span>Correo</span><input name="email" type="email" defaultValue={value.email} /></label>
      <label className="field"><span>Ciudad</span><input name="city" defaultValue={value.city} /></label>
      <label className="field full"><span>Dirección</span><input name="address" defaultValue={value.address} /></label>

      <div className="full"><h4>Contacto de emergencia</h4></div>
      <label className="field"><span>Nombre del contacto</span><input name="emergencyContact" defaultValue={value.emergencyContact} /></label>
      <label className="field"><span>Teléfono de emergencia</span><input name="emergencyPhone" defaultValue={value.emergencyPhone} /></label>

      <div className="full"><h4>Datos de facturación</h4></div>
      <label className="field"><span>Nombre para facturación</span><input name="billingName" defaultValue={value.billingName} placeholder="Se usará el nombre del paciente si se deja vacío" /></label>
      <label className="field"><span>NIT</span><input name="nit" defaultValue={value.nit} /></label>
      <label className="field full"><span>Dirección de facturación</span><input name="billingAddress" defaultValue={value.billingAddress} placeholder="Se usará la dirección del paciente si se deja vacía" /></label>

      <div className="full"><h4>Responsable del menor {minor ? "· obligatorio" : "· solo si corresponde"}</h4></div>
      <label className="field"><span>Nombre del responsable {minor && "*"}</span><input name="guardianName" defaultValue={value.guardianName} /></label>
      <label className="field"><span>Parentesco {minor && "*"}</span><input name="guardianRelationship" defaultValue={value.guardianRelationship} placeholder="Ej. Madre, padre o tutor" /></label>
      <label className="field full"><span>Teléfono del responsable {minor && "*"}</span><input name="guardianPhone" defaultValue={value.guardianPhone} /></label>
    </>;
  };

  return <>
    <PageHeader title="Gestión de pacientes" description="La ficha administrativa reúne contacto, facturación y acceso; los antecedentes permanecen en Expediente clínico." actions={canManage ? <Button onClick={() => { setError(""); setFormBirthDate(""); setModal("new"); }}><Plus size={17} /> Nuevo paciente</Button> : undefined} />
    {!canManage && <RoleAccessNotice role={role}>Puedes consultar la ficha administrativa. Registrar pacientes, editar datos, gestionar accesos y agendar la primera cita corresponde a Secretaría o Administración.</RoleAccessNotice>}
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className="card patient-search-card"><SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Buscar por nombre, DPI, teléfono, código, correo, ciudad o género..." /><span>{filtered.length} coincidencias</span></section>
    <section className="card"><DataTable columns={columns} rows={filtered.slice((page - 1) * 8, page * 8)} /><Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / 8))} onPageChange={setPage} /></section>

    <Modal open={modal === "new"} title="Registrar paciente" description="Datos administrativos. La información clínica la revisa el personal clínico." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitNew}>{fields()}{error && <p className="form-error full">{error}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Guardar paciente</Button></div></form>
    </Modal>

    <Modal open={modal === "detail" && !!active} title="Ficha administrativa" description="Paciente seleccionado para continuar por los módulos." onClose={() => setModal(null)}>
      {active && <div className="detail-stack">
        <PatientSummary patient={active} />
        <div className="info-grid">
          <div><span>Fecha de nacimiento</span><strong>{active.birthDate}</strong></div><div><span>Teléfono</span><strong>{active.phone}</strong></div>
          <div><span>Correo</span><strong>{active.email || "Sin registrar"}</strong></div><div><span>Ciudad</span><strong>{active.city || "Sin registrar"}</strong></div>
          <div className="full"><span>Dirección</span><strong>{active.address || "Sin registrar"}</strong></div>
          <div><span>Contacto de emergencia</span><strong>{active.emergencyContact || "Sin registrar"}</strong></div><div><span>Teléfono de emergencia</span><strong>{active.emergencyPhone || "Sin registrar"}</strong></div>
          <div><span>Facturación</span><strong>{active.billingName}</strong></div><div><span>NIT</span><strong>{active.nit}</strong></div>
          <div className="full"><span>Dirección de facturación</span><strong>{active.billingAddress || "Sin registrar"}</strong></div>
          {active.guardianName && <><div><span>Responsable</span><strong>{active.guardianName}</strong></div><div><span>Parentesco y teléfono</span><strong>{active.guardianRelationship} · {active.guardianPhone}</strong></div></>}
        </div>
        {canManage && <div className="next-actions"><h4>Siguientes pasos</h4><div>
          <Button variant="secondary" onClick={() => { setError(""); setFormBirthDate(active.birthDate); setModal("edit"); }}><Pencil size={16} /> Editar ficha</Button>
          {active.accessStatus === "Pendiente"
            ? <Button variant="secondary" onClick={handleCreateAccess}><KeyRound size={16} /> Crear acceso</Button>
            : <Button variant="secondary" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Restablecer acceso</Button>}
          {credentials && <Button variant="secondary" onClick={() => setModal("access")}><KeyRound size={16} /> Ver credenciales</Button>}
          <Button onClick={scheduleFirstAppointment}><ClipboardPlus size={16} /> Agendar primera cita</Button>
        </div></div>}
        <div className="clinical-warning"><UserRound size={19} /><p><strong>Antecedentes clínicos pendientes</strong><span>El paciente puede completarlos desde portal, app o formulario impreso. El asistente revisa y el odontólogo valida.</span></p></div>
      </div>}
    </Modal>

    <Modal open={modal === "edit" && !!active} title="Editar ficha administrativa" onClose={() => setModal("detail")}>
      <form className="form-grid" onSubmit={submitEdit}>{active && fields(active)}{error && <p className="form-error full">{error}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal("detail")}>Cancelar</Button><Button type="submit">Guardar cambios</Button></div></form>
    </Modal>

    <Modal open={modal === "access" && !!active && !!credentials} title="Entrega de acceso al paciente" description="Presentación imprimible de credenciales temporales simuladas." onClose={() => setModal("detail")}>
      {active && credentials && <div className={accessStyles.credentialCard}>
        <div className={accessStyles.credentialHeader}><div><strong>DentalCare Clínica Odontológica</strong><span>Acceso al portal y aplicación del paciente</span></div><small>{credentials.generatedAt}</small></div>
        <div><strong>{active.name}</strong><small>{active.code} · {credentials.operation} de acceso</small></div>
        <div className={accessStyles.credentialGrid}>
          <div><span>Usuario</span><strong>{credentials.username}</strong></div>
          <div><span>Contraseña temporal</span><strong className={accessStyles.temporaryPassword}>{credentials.temporaryPassword}</strong></div>
        </div>
        <div><strong>Indicaciones para el paciente</strong><ol className={accessStyles.instructions}><li>Ingresa al portal o aplicación con estas credenciales.</li><li>Cambia la contraseña temporal durante el primer ingreso.</li><li>No compartas la contraseña con otras personas.</li><li>Si pierdes el acceso, solicita un restablecimiento en recepción.</li></ol></div>
        <div className={accessStyles.signature}><div>Firma de quien entrega</div><div>Firma del paciente o responsable</div></div>
        <div className={accessStyles.previewActions}><Button variant="secondary" onClick={copyCredentials}><ClipboardCopy size={16} /> Copiar credenciales</Button><Button onClick={() => window.print()}><Printer size={16} /> Imprimir entrega</Button></div>
      </div>}
    </Modal>

    <ConfirmDialog open={confirmReset} title="Restablecer acceso" message="Se generarán un usuario y una contraseña temporal nuevos. Las credenciales temporales anteriores dejarán de utilizarse en esta simulación." confirmLabel="Restablecer acceso" danger onClose={() => setConfirmReset(false)} onConfirm={handleResetAccess} />
  </>;
}
