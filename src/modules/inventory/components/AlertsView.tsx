"use client";

import { AlertTriangle, CalendarClock, CircleAlert, PackageX } from "lucide-react";
import { useMemo, useState } from "react";
import { getInventoryAlerts, type InventoryAlert, type InventoryAlertType } from "@/modules/inventory/services/inventory-alerts.service";
import { DataTable, EmptyState, PageHeader, SearchInput, StatCard, type Column } from "@/shared/components";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type AlertTypeFilter = "all" | InventoryAlertType;

const alertTypeLabels: Record<InventoryAlertType, string> = {
  low_stock: "Existencia baja",
  expiring_soon: "Próximo a vencer",
  expired: "Vencido",
};

const severityLabels: Record<InventoryAlert["severity"], string> = {
  critical: "Crítica",
  warning: "Advertencia",
  info: "Atención",
};

function formatDate(value?: string) {
  if (!value) return "No aplica";
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function AlertsView() {
  const { consumables } = useInventory();
  const [query, setQuery] = useState("");
  const [alertType, setAlertType] = useState<AlertTypeFilter>("all");
  const [category, setCategory] = useState("all");

  const alerts = useMemo(() => getInventoryAlerts(consumables), [consumables]);
  const consumableById = useMemo(
    () => new Map(consumables.map((consumable) => [consumable.id, consumable])),
    [consumables],
  );
  const categories = useMemo(
    () => [...new Set(consumables.filter((item) => item.status === "active").map((item) => item.category))]
      .sort((left, right) => left.localeCompare(right, "es")),
    [consumables],
  );
  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return alerts.filter((alert) => {
      const consumable = consumableById.get(alert.consumableId);
      const matchesQuery = !normalizedQuery
        || consumable?.name.toLocaleLowerCase("es").includes(normalizedQuery)
        || consumable?.code.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesType = alertType === "all" || alert.type === alertType;
      const matchesCategory = category === "all" || consumable?.category === category;
      return matchesQuery && matchesType && matchesCategory;
    });
  }, [alertType, alerts, category, consumableById, query]);

  const metrics = useMemo(() => ({
    total: alerts.length,
    lowStock: alerts.filter((alert) => alert.type === "low_stock").length,
    expiringSoon: alerts.filter((alert) => alert.type === "expiring_soon").length,
    expired: alerts.filter((alert) => alert.type === "expired").length,
  }), [alerts]);

  const columns: Column<InventoryAlert>[] = [
    { key: "consumable", header: "Consumible", cell: (alert) => {
      const consumable = consumableById.get(alert.consumableId);
      return <div className="cell-stack"><strong>{consumable?.name ?? "Consumible no disponible"}</strong><small>{alert.message}</small></div>;
    } },
    { key: "code", header: "Código", className: styles.codeColumn, cell: (alert) => consumableById.get(alert.consumableId)?.code ?? "—" },
    { key: "category", header: "Categoría", cell: (alert) => consumableById.get(alert.consumableId)?.category ?? "—" },
    { key: "type", header: "Tipo de alerta", cell: (alert) => <strong>{alertTypeLabels[alert.type]}</strong> },
    { key: "currentStock", header: "Existencia actual", cell: (alert) => consumableById.get(alert.consumableId)?.currentStock ?? "—" },
    { key: "minimumStock", header: "Existencia mínima", cell: (alert) => consumableById.get(alert.consumableId)?.minimumStock ?? "—" },
    { key: "expiration", header: "Vencimiento", cell: (alert) => formatDate(consumableById.get(alert.consumableId)?.expirationDate) },
    { key: "severity", header: "Estado", cell: (alert) => <span className={`${styles.alertSeverity} ${styles[alert.severity]}`}>{severityLabels[alert.severity]}</span> },
  ];

  return (
    <>
      <PageHeader title="Alertas" description="Consulta existencias bajas y consumibles vencidos o próximos a vencer." />

      <section className={styles.statsGrid} aria-label="Resumen de alertas">
        <StatCard label="Alertas activas" value={metrics.total} icon={CircleAlert} tone="amber" />
        <StatCard label="Existencia baja" value={metrics.lowStock} icon={AlertTriangle} tone="amber" />
        <StatCard label="Próximos a vencer" value={metrics.expiringSoon} icon={CalendarClock} tone="blue" />
        <StatCard label="Vencidos" value={metrics.expired} icon={PackageX} tone="amber" />
      </section>

      <section className={`card ${styles.filters}`} aria-label="Búsqueda y filtros de alertas">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre o código..." />
        <label className="compact-field">
          <span>Tipo de alerta</span>
          <select value={alertType} onChange={(event) => setAlertType(event.target.value as AlertTypeFilter)}>
            <option value="all">Todas</option>
            <option value="low_stock">Existencia baja</option>
            <option value="expiring_soon">Próximo a vencer</option>
            <option value="expired">Vencido</option>
          </select>
        </label>
        <label className="compact-field">
          <span>Categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Todas</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <span className={styles.resultCount}>{filteredAlerts.length} resultados</span>
      </section>

      <section className={`card ${styles.tableCard} ${styles.alertsTable}`}>
        {filteredAlerts.length
          ? <DataTable columns={columns} rows={filteredAlerts} />
          : <EmptyState
              title={alerts.length ? "Sin alertas coincidentes" : "No hay alertas activas"}
              description={alerts.length
                ? "No hay alertas que coincidan con la búsqueda y los filtros seleccionados."
                : "Los consumibles activos se encuentran dentro de sus niveles y fechas esperadas."}
            />}
      </section>
    </>
  );
}
