"use client";

import { ClipboardPlus, KeyRound, Pencil, Plus, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, DataTable, Modal, PageHeader, Pagination, SearchInput, StatusBadge, type Column } from "@/shared/components";
import { matchesPatient } from "../adapters/patient.adapter";
import type { CreatePatientDto } from "../dtos/patient.dto";
import type { Patient } from "../models/patient";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import { PatientSummary } from "./PatientSummary";

const emptyPatient: CreatePatientDto = { name: "", dpi: "", birthDate: "", gender: "Femenino", phone: "", email: "", city: "", address: "" };

export function PatientsView() {
  const { patients, addPatient, updatePatient, createAccess, selectPatient } = useClinicSession();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"new" | "detail" | "edit" | null>(null);
  const [active, setActive] = useState<Patient | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => patients.filter((patient) => matchesPatient(patient, query)), [patients, query]);
  const openDetail = (patient: Patient) => { setActive(patient); selectPatient(patient.id); setModal("detail"); };
  const columns: Column<Patient>[] = [
    { key: "patient", header: "Paciente", cell: (row) => <div className="cell-stack"><strong>{row.name}</strong><small>{row.code}</small></div> },
    { key: "contact", header: "Contacto", cell: (row) => <div className="cell-stack"><span>{row.phone}</span><small>{row.email}</small></div> },
    { key: "location", header: "Ubicación", cell: (row) => row.city },
    { key: "access", header: "Acceso", cell: (row) => <StatusBadge status={row.accessStatus} /> },
    { key: "action", header: "", className: "actions-cell", cell: (row) => <Button variant="secondary" onClick={() => openDetail(row)}>Ver ficha</Button> },
  ];
  const submitNew = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const dto = Object.fromEntries(form) as unknown as CreatePatientDto;
    if (!dto.name?.trim() || !dto.dpi?.trim() || !dto.phone?.trim() || !dto.birthDate) { setError("Nombre, DPI, teléfono y fecha de nacimiento son obligatorios."); return; }
    const patient = addPatient(dto); setActive(patient); setModal("detail"); setError(""); setNotice("Paciente registrado. Ya puedes crear su acceso y agendar la primera cita.");
  };
  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!active) return; const form = new FormData(event.currentTarget); const next = { ...active, ...Object.fromEntries(form) } as Patient; updatePatient(next); setActive(next); setModal("detail"); setNotice("Ficha administrativa actualizada.");
  };
  const fields = (value: CreatePatientDto | Patient = emptyPatient) => <><label className="field full"><span>Nombre completo *</span><input name="name" defaultValue={value.name} /></label><label className="field"><span>DPI *</span><input name="dpi" defaultValue={value.dpi} /></label><label className="field"><span>Fecha de nacimiento *</span><input name="birthDate" type="date" defaultValue={value.birthDate} /></label><label className="field"><span>Género</span><select name="gender" defaultValue={value.gender}><option>Femenino</option><option>Masculino</option><option>Otro</option></select></label><label className="field"><span>Teléfono *</span><input name="phone" defaultValue={value.phone} /></label><label className="field"><span>Correo</span><input name="email" type="email" defaultValue={value.email} /></label><label className="field"><span>Ciudad</span><input name="city" defaultValue={value.city} /></label><label className="field full"><span>Dirección</span><input name="address" defaultValue={value.address} /></label></>;
  return <><PageHeader title="Gestión de pacientes" description="La ficha administrativa reúne contacto, facturación y acceso; los antecedentes permanecen en Expediente clínico." actions={<Button onClick={() => { setError(""); setModal("new"); }}><Plus size={17} /> Nuevo paciente</Button>} />{notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}<section className="card patient-search-card"><SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Buscar por nombre, DPI, teléfono, código, correo, ciudad o género..." /><span>{filtered.length} coincidencias</span></section><section className="card"><DataTable columns={columns} rows={filtered.slice((page - 1) * 8, page * 8)} /><Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / 8))} onPageChange={setPage} /></section><Modal open={modal === "new"} title="Registrar paciente" description="Datos administrativos. La información clínica la revisa el personal clínico." onClose={() => setModal(null)}><form className="form-grid" onSubmit={submitNew}>{fields()}{error && <p className="form-error full">{error}</p>}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Guardar paciente</Button></div></form></Modal><Modal open={modal === "detail" && !!active} title="Ficha administrativa" description="Paciente seleccionado para continuar por los módulos." onClose={() => setModal(null)}>{active && <div className="detail-stack"><PatientSummary patient={active} /><div className="info-grid"><div><span>Fecha de nacimiento</span><strong>{active.birthDate}</strong></div><div><span>Teléfono</span><strong>{active.phone}</strong></div><div><span>Correo</span><strong>{active.email}</strong></div><div><span>Ciudad</span><strong>{active.city}</strong></div><div className="full"><span>Dirección</span><strong>{active.address}</strong></div><div className="full"><span>Contacto de emergencia</span><strong>{active.emergencyContact}</strong></div><div><span>Facturación</span><strong>{active.billingName}</strong></div><div><span>NIT</span><strong>{active.nit}</strong></div></div><div className="next-actions"><h4>Siguientes pasos</h4><div><Button variant="secondary" onClick={() => setModal("edit")}><Pencil size={16} /> Editar ficha</Button><Button variant="secondary" onClick={() => { const password = createAccess(active.id); setActive({ ...active, accessStatus: "Activo" }); setNotice(`Acceso creado. Contraseña temporal: ${password}`); }}><KeyRound size={16} /> Crear acceso</Button><Button><ClipboardPlus size={16} /> Agendar primera cita</Button></div></div><div className="clinical-warning"><UserRound size={19} /><p><strong>Antecedentes clínicos pendientes</strong><span>El paciente puede completarlos desde portal, app o formulario impreso. El asistente revisa y el odontólogo valida.</span></p></div></div>}</Modal><Modal open={modal === "edit" && !!active} title="Editar ficha administrativa" onClose={() => setModal("detail")}><form className="form-grid" onSubmit={submitEdit}>{active && fields(active)}<div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal("detail")}>Cancelar</Button><Button type="submit">Guardar cambios</Button></div></form></Modal></>;
}
