"use client";

import { AlertTriangle, Boxes, CalendarClock, Pencil, PackageCheck, Plus, Power } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, EmptyState, Modal, PageHeader, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { Consumable, ExpirationState } from "@/modules/inventory/models/inventory.model";
import { inventoryService } from "@/modules/inventory/services/inventory.service";
import { ConsumableForm } from "./ConsumableForm";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type ModalState = { mode: "create" } | { mode: "edit"; consumable: Consumable } | null;
type StatusFilter = "all" | Consumable["status"];

const expirationLabels: Record<ExpirationState, string> = {
  expired: "Vencido",
  "expiring-soon": "Próximo a vencer",
  current: "Vigente",
  "not-applicable": "No aplica",
};

function formatDate(value?: string) {
  if (!value) return "No aplica";
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function ConsumablesView() {
  const { consumables, addConsumable, updateConsumable, deactivateConsumable } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeactivation, setPendingDeactivation] = useState<Consumable | null>(null);
  const [notice, setNotice] = useState("");

  const categories = useMemo(() => (
    [...new Set(consumables.map((item) => item.category))].sort((left, right) => left.localeCompare(right, "es"))
  ), [consumables]);

  const filteredConsumables = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return consumables.filter((item) => {
      const matchesQuery = !normalizedQuery
        || item.name.toLocaleLowerCase("es").includes(normalizedQuery)
        || item.code.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesCategory = category === "all" || item.category === category;
      const matchesStatus = status === "all" || item.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, consumables, query, status]);

  const metrics = useMemo(() => {
    const activeConsumables = consumables.filter((item) => item.status === "active");
    return {
      active: activeConsumables.length,
      lowStock: activeConsumables.filter((item) => item.currentStock <= item.minimumStock).length,
      expiringSoon: activeConsumables.filter((item) => inventoryService.getExpirationState(item.expirationDate) === "expiring-soon").length,
      totalUnits: activeConsumables.reduce((total, item) => total + item.currentStock, 0),
    };
  }, [consumables]);

  const saveConsumable = (dto: CreateConsumableDto) => {
    if (modal?.mode === "edit") {
      updateConsumable(modal.consumable.id, dto);
      setNotice("El consumible se actualizó correctamente.");
    } else {
      addConsumable(dto);
      setNotice("El consumible se registró correctamente.");
    }
    setModal(null);
  };

  const confirmDeactivation = () => {
    if (!pendingDeactivation) return;
    deactivateConsumable(pendingDeactivation.id);
    setNotice("El consumible se desactivó correctamente.");
    setPendingDeactivation(null);
  };

  const columns: Column<Consumable>[] = [
    { key: "code", header: "Código", cell: (item) => <strong>{item.code}</strong> },
    { key: "name", header: "Nombre", cell: (item) => <div className="cell-stack"><strong>{item.name}</strong>{item.currentStock <= item.minimumStock && item.status === "active" && <small className={styles.lowStockText}>Existencia baja</small>}</div> },
    { key: "category", header: "Categoría", className: styles.optionalColumn, cell: (item) => item.category },
    { key: "stock", header: "Existencia", cell: (item) => item.currentStock },
    { key: "minimumStock", header: "Mínimo", className: styles.compactColumn, cell: (item) => item.minimumStock },
    { key: "unit", header: "Unidad", className: styles.compactColumn, cell: (item) => item.unit },
    { key: "expiration", header: "Vencimiento", className: styles.optionalColumn, cell: (item) => {
      const expirationState = inventoryService.getExpirationState(item.expirationDate);
      return <div className="cell-stack"><span>{formatDate(item.expirationDate)}</span>{expirationState !== "current" && expirationState !== "not-applicable" && <small className={expirationState === "expired" ? styles.expiredText : styles.expiringText}>{expirationLabels[expirationState]}</small>}</div>;
    } },
    { key: "status", header: "Estado", cell: (item) => <StatusBadge status={item.status === "active" ? "Activo" : "Inactivo"} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (item) => <div className={styles.actions}><Button variant="secondary" onClick={() => setModal({ mode: "edit", consumable: item })}><Pencil size={15} /> Editar</Button>{item.status === "active" && <Button variant="ghost" onClick={() => setPendingDeactivation(item)}><Power size={15} /> Desactivar</Button>}</div> },
  ];

  return (
    <>
      <PageHeader title="Consumibles" description="Administra los materiales de uso clínico y controla sus existencias y vencimientos." actions={<Button onClick={() => setModal({ mode: "create" })}><Plus size={17} /> Nuevo consumible</Button>} />

      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

      <section className={styles.statsGrid} aria-label="Resumen de consumibles">
        <StatCard label="Consumibles activos" value={metrics.active} icon={PackageCheck} tone="teal" />
        <StatCard label="Existencia baja" value={metrics.lowStock} icon={AlertTriangle} tone="amber" />
        <StatCard label="Próximos a vencer" value={metrics.expiringSoon} helper="Durante los próximos 30 días" icon={CalendarClock} tone="blue" />
        <StatCard label="Total de unidades" value={metrics.totalUnits} helper="Solo consumibles activos" icon={Boxes} tone="green" />
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
        <span className={styles.resultCount}>{filteredConsumables.length} resultados</span>
      </section>

      <section className={`card ${styles.tableCard}`}>
        {filteredConsumables.length ? <DataTable columns={columns} rows={filteredConsumables} /> : <EmptyState title="Sin consumibles" description="No hay consumibles que coincidan con la búsqueda y los filtros seleccionados." />}
      </section>

      <Modal open={modal !== null} title={modal?.mode === "edit" ? "Editar consumible" : "Nuevo consumible"} description="Completa los datos del material de uso clínico." onClose={() => setModal(null)}>
        {modal && <ConsumableForm key={modal.mode === "edit" ? modal.consumable.id : "new"} consumable={modal.mode === "edit" ? modal.consumable : undefined} onCancel={() => setModal(null)} onSubmit={saveConsumable} />}
      </Modal>

      <ConfirmDialog open={pendingDeactivation !== null} title="Desactivar consumible" message={`¿Deseas desactivar ${pendingDeactivation?.name ?? "este consumible"}? Permanecerá en el inventario como inactivo.`} confirmLabel="Desactivar" danger onConfirm={confirmDeactivation} onClose={() => setPendingDeactivation(null)} />
    </>
  );
}
