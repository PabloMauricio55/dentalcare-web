"use client";

import { ArrowDownToLine, CalendarDays, Eye, ListChecks, PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import type { InventoryMovement, InventoryMovementType } from "@/modules/inventory/models/inventory.model";
import { Button, DataTable, EmptyState, Modal, PageHeader, SearchInput, StatCard, type Column } from "@/shared/components";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type MovementTypeFilter = "all" | InventoryMovementType;

const movementTypeLabels: Record<InventoryMovementType, string> = {
  purchase_receipt: "Recepción de compra",
};

function getMovementLabel(type: InventoryMovementType) {
  return movementTypeLabels[type];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MovementsView() {
  const { consumables, movements } = useInventory();
  const [query, setQuery] = useState("");
  const [consumableId, setConsumableId] = useState("all");
  const [movementType, setMovementType] = useState<MovementTypeFilter>("all");
  const [movementDetail, setMovementDetail] = useState<InventoryMovement | null>(null);

  const consumableById = useMemo(
    () => new Map(consumables.map((consumable) => [consumable.id, consumable])),
    [consumables],
  );
  const orderedMovements = useMemo(
    () => [...movements].sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt)),
    [movements],
  );
  const filteredMovements = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return orderedMovements.filter((movement) => {
      const consumable = consumableById.get(movement.consumableId);
      const matchesQuery = !normalizedQuery
        || consumable?.name.toLocaleLowerCase("es").includes(normalizedQuery)
        || consumable?.code.toLocaleLowerCase("es").includes(normalizedQuery)
        || movement.reference.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesConsumable = consumableId === "all" || movement.consumableId === consumableId;
      const matchesType = movementType === "all" || movement.type === movementType;
      return matchesQuery && matchesConsumable && matchesType;
    });
  }, [consumableById, consumableId, movementType, orderedMovements, query]);

  const metrics = useMemo(() => ({
    total: movements.length,
    entries: movements.filter((movement) => movement.quantity > 0).length,
    enteredUnits: movements.reduce((total, movement) => total + Math.max(movement.quantity, 0), 0),
    today: movements.filter((movement) => new Date(movement.occurredAt).toDateString() === new Date().toDateString()).length,
  }), [movements]);

  const columns: Column<InventoryMovement>[] = [
    { key: "date", header: "Fecha", cell: (movement) => formatDateTime(movement.occurredAt) },
    { key: "consumable", header: "Consumible", cell: (movement) => {
      const consumable = consumableById.get(movement.consumableId);
      return <div className="cell-stack"><strong>{consumable?.name ?? "Consumible no disponible"}</strong>{consumable && <small>{consumable.code}</small>}</div>;
    } },
    { key: "type", header: "Tipo", cell: (movement) => getMovementLabel(movement.type) },
    { key: "quantity", header: "Cantidad", cell: (movement) => <strong className={styles.incomingQuantity}>+{movement.quantity}</strong> },
    { key: "previousStock", header: "Existencia anterior", cell: (movement) => movement.previousStock },
    { key: "newStock", header: "Existencia nueva", cell: (movement) => movement.newStock },
    { key: "reference", header: "Referencia", cell: (movement) => movement.reference },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (movement) => <Button variant="secondary" onClick={() => setMovementDetail(movement)}><Eye size={15} /> Ver detalle</Button> },
  ];

  const selectedConsumable = movementDetail ? consumableById.get(movementDetail.consumableId) : undefined;

  return (
    <>
      <PageHeader title="Movimientos" description="Consulta el historial de entradas y cambios de existencias del inventario." />

      <section className={styles.statsGrid} aria-label="Resumen de movimientos">
        <StatCard label="Movimientos registrados" value={metrics.total} icon={ListChecks} tone="teal" />
        <StatCard label="Entradas registradas" value={metrics.entries} icon={ArrowDownToLine} tone="green" />
        <StatCard label="Unidades ingresadas" value={metrics.enteredUnits} icon={PackagePlus} tone="blue" />
        <StatCard label="Movimientos de hoy" value={metrics.today} icon={CalendarDays} tone="amber" />
      </section>

      <section className={`card ${styles.filters}`} aria-label="Búsqueda y filtros de movimientos">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por consumible, código o referencia..." />
        <label className="compact-field">
          <span>Consumible</span>
          <select value={consumableId} onChange={(event) => setConsumableId(event.target.value)}>
            <option value="all">Todos</option>
            {consumables.map((consumable) => <option key={consumable.id} value={consumable.id}>{consumable.name}</option>)}
          </select>
        </label>
        <label className="compact-field">
          <span>Tipo</span>
          <select value={movementType} onChange={(event) => setMovementType(event.target.value as MovementTypeFilter)}>
            <option value="all">Todos</option>
            {Object.entries(movementTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <span className={styles.resultCount}>{filteredMovements.length} resultados</span>
      </section>

      <section className={`card ${styles.tableCard} ${styles.movementsTable}`}>
        {filteredMovements.length
          ? <DataTable columns={columns} rows={filteredMovements} />
          : <EmptyState title="Sin movimientos" description="No hay movimientos que coincidan con la búsqueda y los filtros seleccionados." />}
      </section>

      <Modal open={movementDetail !== null} title="Detalle del movimiento" onClose={() => setMovementDetail(null)}>
        {movementDetail && <div className={styles.movementDetail}>
          <div><span>Consumible</span><strong>{selectedConsumable?.name ?? "Consumible no disponible"}</strong></div>
          <div><span>Fecha y hora</span><strong>{formatDateTime(movementDetail.occurredAt)}</strong></div>
          <div><span>Tipo</span><strong>{getMovementLabel(movementDetail.type)}</strong></div>
          <div><span>Cantidad</span><strong className={styles.incomingQuantity}>+{movementDetail.quantity}</strong></div>
          <div><span>Existencia anterior</span><strong>{movementDetail.previousStock}</strong></div>
          <div><span>Existencia nueva</span><strong>{movementDetail.newStock}</strong></div>
          <div><span>Referencia</span><strong>{movementDetail.reference}</strong></div>
          <div className={styles.fullDetail}><span>Descripción</span><strong>{movementDetail.description}</strong></div>
        </div>}
      </Modal>
    </>
  );
}
