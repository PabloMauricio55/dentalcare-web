"use client";

import { Boxes, CircleOff, PackageCheck, Pencil, Plus, Power, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, EmptyState, Modal, PageHeader, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";
import type { InventoryInstrument } from "@/modules/inventory/models/inventory.model";
import { InstrumentForm } from "./InstrumentForm";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type ModalState = { mode: "create" } | { mode: "edit"; instrument: InventoryInstrument } | null;
type StatusFilter = "all" | "active" | "inactive";

export function InstrumentsView() {
  const { instruments, addInstrument, updateInstrument, deactivateInstrument } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeactivation, setPendingDeactivation] = useState<InventoryInstrument | null>(null);
  const [notice, setNotice] = useState("");

  const categories = useMemo(() => (
    [...new Set(instruments.map((item) => item.category))].sort((left, right) => left.localeCompare(right, "es"))
  ), [instruments]);

  const filteredInstruments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return instruments.filter((item) => {
      const matchesQuery = !normalizedQuery
        || item.name.toLocaleLowerCase("es").includes(normalizedQuery)
        || item.code.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesCategory = category === "all" || item.category === category;
      const matchesStatus = status === "all" || item.active === (status === "active");
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, instruments, query, status]);

  const metrics = useMemo(() => {
    const activeInstruments = instruments.filter((item) => item.active);
    return {
      active: activeInstruments.length,
      totalUnits: activeInstruments.reduce((total, item) => total + item.totalQuantity, 0),
      availableUnits: activeInstruments.reduce((total, item) => total + item.availableQuantity, 0),
      inactive: instruments.filter((item) => !item.active).length,
    };
  }, [instruments]);

  const saveInstrument = (dto: CreateInstrumentDto) => {
    if (modal?.mode === "edit") {
      updateInstrument(modal.instrument.id, dto);
      setNotice("El instrumento se actualizó correctamente.");
    } else {
      addInstrument(dto);
      setNotice("El instrumento se registró correctamente.");
    }
    setModal(null);
  };

  const confirmDeactivation = () => {
    if (!pendingDeactivation) return;
    deactivateInstrument(pendingDeactivation.id);
    setNotice("El instrumento se desactivó correctamente.");
    setPendingDeactivation(null);
  };

  const columns: Column<InventoryInstrument>[] = [
    { key: "code", header: "Código", cell: (item) => <strong>{item.code}</strong> },
    { key: "name", header: "Nombre", cell: (item) => <strong>{item.name}</strong> },
    { key: "category", header: "Categoría", className: styles.optionalColumn, cell: (item) => item.category },
    { key: "total", header: "Total", cell: (item) => item.totalQuantity },
    { key: "available", header: "Disponibles", cell: (item) => item.availableQuantity },
    { key: "location", header: "Ubicación", className: styles.compactColumn, cell: (item) => item.location },
    { key: "status", header: "Estado", cell: (item) => <StatusBadge status={item.active ? "Activo" : "Inactivo"} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (item) => <div className={styles.actions}><Button variant="secondary" onClick={() => setModal({ mode: "edit", instrument: item })}><Pencil size={15} /> Editar</Button>{item.active && <Button variant="ghost" onClick={() => setPendingDeactivation(item)}><Power size={15} /> Desactivar</Button>}</div> },
  ];

  return (
    <>
      <PageHeader title="Instrumental" description="Administra la cantidad y disponibilidad del instrumental reutilizable de la clínica." actions={<Button onClick={() => setModal({ mode: "create" })}><Plus size={17} /> Nuevo instrumento</Button>} />

      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

      <section className={styles.statsGrid} aria-label="Resumen de instrumental">
        <StatCard label="Instrumentos activos" value={metrics.active} icon={Wrench} tone="teal" />
        <StatCard label="Total de unidades" value={metrics.totalUnits} helper="Solo instrumental activo" icon={Boxes} tone="blue" />
        <StatCard label="Unidades disponibles" value={metrics.availableUnits} helper="Solo instrumental activo" icon={PackageCheck} tone="green" />
        <StatCard label="Registros inactivos" value={metrics.inactive} icon={CircleOff} tone="amber" />
      </section>

      <section className={`card ${styles.filters}`} aria-label="Búsqueda y filtros">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre o código..." />
        <label className="compact-field">
          <span>Categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Todas</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="compact-field">
          <span>Estado</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>
        <span className={styles.resultCount}>{filteredInstruments.length} resultados</span>
      </section>

      <section className={`card ${styles.tableCard}`}>
        {filteredInstruments.length ? <DataTable columns={columns} rows={filteredInstruments} /> : <EmptyState title="Sin instrumentos" description="No hay instrumentos que coincidan con la búsqueda y los filtros seleccionados." />}
      </section>

      <Modal open={modal !== null} title={modal?.mode === "edit" ? "Editar instrumento" : "Nuevo instrumento"} description="Completa los datos del instrumental clínico." onClose={() => setModal(null)}>
        {modal && <InstrumentForm key={modal.mode === "edit" ? modal.instrument.id : "new"} instrument={modal.mode === "edit" ? modal.instrument : undefined} onCancel={() => setModal(null)} onSubmit={saveInstrument} />}
      </Modal>

      <ConfirmDialog open={pendingDeactivation !== null} title="Desactivar instrumento" message={`¿Deseas desactivar ${pendingDeactivation?.name ?? "este instrumento"}? Permanecerá en el inventario como inactivo.`} confirmLabel="Desactivar" danger onConfirm={confirmDeactivation} onClose={() => setPendingDeactivation(null)} />
    </>
  );
}
