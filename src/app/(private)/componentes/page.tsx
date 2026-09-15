"use client";

import { CalendarCheck, Plus } from "lucide-react";
import { useState } from "react";
import { Button, ConfirmDialog, DataTable, EmptyState, LoadingState, Modal, PageHeader, Pagination, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";

type DemoRow = { id: number; patient: string; time: string; status: string };
const rows: DemoRow[] = [
  { id: 1, patient: "María López", time: "08:00", status: "Confirmada" },
  { id: 2, patient: "Carlos Méndez", time: "09:00", status: "En espera" },
];
const columns: Column<DemoRow>[] = [
  { key: "patient", header: "Paciente", cell: (row) => <strong>{row.patient}</strong> },
  { key: "time", header: "Hora", cell: (row) => row.time },
  { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
];

export default function ComponentsPage() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [page, setPage] = useState(1);
  return <div className="page-stack"><PageHeader title="Biblioteca inicial" description="Componentes reutilizables para mantener consistencia entre módulos." actions={<Button onClick={() => setModal(true)}><Plus size={17} /> Abrir modal</Button>} /><div className="stats-grid"><StatCard label="Citas confirmadas" value="15" helper="de 18 programadas" icon={CalendarCheck} /><StatCard label="Estado" value="Operativo" helper="Datos simulados" tone="green" /></div><section className="card component-section"><h3>Formulario y botones</h3><SearchInput value={query} onChange={setQuery} placeholder="Buscar paciente por nombre, DPI o teléfono..." /><div className="button-row"><Button>Acción principal</Button><Button variant="secondary">Secundaria</Button><Button variant="ghost" onClick={() => setConfirm(true)}>Confirmación</Button><Button variant="danger">Desactivar</Button></div></section><section className="card component-section"><h3>Tabla, estados y paginación</h3><DataTable columns={columns} rows={rows.filter((row) => row.patient.toLowerCase().includes(query.toLowerCase()))} /><Pagination page={page} totalPages={3} onPageChange={setPage} /></section><div className="two-columns"><section className="card component-section"><h3>Estado vacío</h3><EmptyState description="Aparece cuando una búsqueda no tiene coincidencias." /></section><section className="card component-section"><h3>Estado de carga</h3><LoadingState /></section></div><Modal open={modal} title="Nuevo registro" description="Ejemplo de formulario compartido" onClose={() => setModal(false)} footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={() => setModal(false)}>Guardar</Button></>}><label className="field"><span>Nombre del paciente</span><input placeholder="Nombre completo" /></label></Modal><ConfirmDialog open={confirm} title="Confirmar acción" message="Esta demostración no modifica datos reales." onClose={() => setConfirm(false)} onConfirm={() => setConfirm(false)} /></div>;
}
