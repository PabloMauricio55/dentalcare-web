"use client";

import { Pencil, Plus, Power } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, RoleAccessNotice, SearchInput, StatusBadge, type Column } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
import { formatCurrency } from "@/shared/lib/currency";
import type { CatalogItem } from "../models/settings";
import { useSettings } from "./SettingsProvider";

export function CatalogView() {
  const { role } = useApp();
  const canManage = roleAccess.canManageSettings(role);
  const { catalog, addCatalog, updateCatalog, toggleCatalog } = useSettings();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [active, setActive] = useState<CatalogItem | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const rows = useMemo(
    () => catalog.filter((item) => [item.code, item.name, item.category, item.status].join(" ").toLowerCase().includes(query.toLowerCase())),
    [catalog, query],
  );
  const columns: Column<CatalogItem>[] = [
    { key: "service", header: "Procedimiento", cell: (row) => <div className="cell-stack"><strong>{row.name}</strong><small>{row.code}</small></div> },
    { key: "category", header: "Categoría", cell: (row) => row.category },
    { key: "duration", header: "Duración", cell: (row) => `${row.duration} min` },
    { key: "price", header: "Precio base", cell: (row) => <strong>{formatCurrency(row.price)}</strong> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    ...(canManage ? [{ key: "actions", header: "", className: "actions-cell", cell: (row: CatalogItem) => <div className="table-actions"><button title="Editar" onClick={() => { setActive(row); setError(""); setModal("edit"); }}><Pencil size={16} /></button><button className={row.status === "Activo" ? "danger-icon" : ""} title={row.status === "Activo" ? "Desactivar" : "Activar"} onClick={() => { setActive(row); setConfirm(true); }}><Power size={16} /></button></div> }] : []),
  ];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dto = {
      code: String(data.get("code")),
      name: String(data.get("name")),
      category: String(data.get("category")),
      duration: Number(data.get("duration")),
      price: Number(data.get("price")),
    };
    const result = modal === "new" ? addCatalog(dto) : active ? updateCatalog({ ...active, ...dto }) : { ok: false as const, error: "Selecciona un procedimiento." };
    if (!result.ok) { setError(result.error); return; }
    setModal(null);
    setError("");
    setNotice(modal === "new" ? "Procedimiento agregado al catálogo." : "Procedimiento actualizado.");
  };

  return <>
    <PageHeader title="Catálogos y procedimientos" description="Servicios clínicos disponibles, duración estimada y precio base." actions={canManage ? <Button onClick={() => { setActive(null); setError(""); setModal("new"); }}><Plus size={17} /> Nuevo procedimiento</Button> : undefined} />
    {!canManage && <RoleAccessNotice role={role}>Puedes consultar los procedimientos. Crear, editar, activar o desactivar elementos corresponde únicamente a Administración.</RoleAccessNotice>}
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className="card patient-search-card"><SearchInput value={query} onChange={setQuery} placeholder="Buscar por código, procedimiento, categoría o estado..." /><span>{rows.length} registros</span></section>
    <section className="card management-table-card"><DataTable columns={columns} rows={rows} /></section>

    <Modal open={canManage && modal !== null} title={modal === "new" ? "Nuevo procedimiento" : "Editar procedimiento"} description="Código y nombre deben ser únicos. El precio se utiliza como base en los planes de tratamiento." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field"><span>Código *</span><input name="code" defaultValue={active?.code} required /></label>
        <label className="field"><span>Categoría *</span><input name="category" defaultValue={active?.category} required /></label>
        <label className="field full"><span>Nombre *</span><input name="name" defaultValue={active?.name} required /></label>
        <label className="field"><span>Duración (min) *</span><input name="duration" type="number" min="5" max="480" step="5" defaultValue={active?.duration ?? 30} required /></label>
        <label className="field"><span>Precio base (Q) *</span><input name="price" type="number" min="0.01" step="0.01" defaultValue={active?.price ?? 0} required /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
      </form>
    </Modal>

    <ConfirmDialog
      open={canManage && confirm}
      title={active?.status === "Activo" ? "Desactivar procedimiento" : "Activar procedimiento"}
      message={active?.status === "Activo" ? "El procedimiento dejará de estar disponible para nuevos planes de tratamiento. Su historial y tratamientos existentes no se eliminarán." : "El procedimiento volverá a estar disponible para nuevos planes de tratamiento."}
      danger={active?.status === "Activo"}
      confirmLabel={active?.status === "Activo" ? "Desactivar" : "Activar"}
      onClose={() => setConfirm(false)}
      onConfirm={() => { if (active) toggleCatalog(active.id); setConfirm(false); setNotice("Estado del procedimiento actualizado."); }}
    />
  </>;
}
