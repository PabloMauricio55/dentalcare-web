"use client";

import { AlertTriangle, Boxes, Clock3, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { InventoryAlert } from "@/modules/inventory/services/inventory-alerts.service";
import { getInventoryAlerts } from "@/modules/inventory/services/inventory-alerts.service";
import { formatCurrency } from "@/shared/lib/currency";
import { EmptyState, PageHeader, StatCard } from "@/shared/components";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

const alertPriority: Record<InventoryAlert["type"], number> = {
  expired: 0,
  low_stock: 1,
  expiring_soon: 2,
};

const movementTypeLabels = {
  purchase_receipt: "Recepción de compra",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function InventoryOverviewView() {
  const { consumables, instruments, movements, protocols, purchases, suppliers } = useInventory();

  const alerts = useMemo(() => getInventoryAlerts(consumables), [consumables]);
  const consumableById = useMemo(
    () => new Map(consumables.map((consumable) => [consumable.id, consumable])),
    [consumables],
  );
  const supplierById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier])),
    [suppliers],
  );
  const activeConsumables = useMemo(
    () => consumables.filter((consumable) => consumable.status === "active"),
    [consumables],
  );
  const activeInstruments = useMemo(
    () => instruments.filter((instrument) => instrument.active),
    [instruments],
  );
  const pendingPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.status === "pending").slice(0, 5),
    [purchases],
  );
  const priorityAlerts = useMemo(
    () => [...alerts].sort((left, right) => alertPriority[left.type] - alertPriority[right.type]).slice(0, 5),
    [alerts],
  );
  const recentMovements = useMemo(
    () => [...movements].sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt)).slice(0, 5),
    [movements],
  );

  const activeInstrumentUnits = activeInstruments.reduce((total, instrument) => total + instrument.totalQuantity, 0);
  const availableInstrumentUnits = activeInstruments.reduce((total, instrument) => total + instrument.availableQuantity, 0);
  const unavailableInstrumentUnits = activeInstrumentUnits - availableInstrumentUnits;
  const pendingPurchaseCount = purchases.filter((purchase) => purchase.status === "pending").length;
  const totalConsumableUnits = activeConsumables.reduce((total, consumable) => total + consumable.currentStock, 0);
  const lowStockCount = alerts.filter((alert) => alert.type === "low_stock").length;
  const expiringSoonCount = alerts.filter((alert) => alert.type === "expiring_soon").length;
  const expiredCount = alerts.filter((alert) => alert.type === "expired").length;
  const activeProtocolCount = protocols.filter((protocol) => protocol.active).length;

  const purchaseTotal = (purchase: (typeof purchases)[number]) => (
    purchase.items.reduce((total, item) => total + item.quantity * item.unitCost, 0)
  );

  return (
    <>
      <PageHeader title="Resumen de inventario" description="Consulta el estado general de existencias, compras y alertas del inventario." />

      <section className={styles.statsGrid} aria-label="Métricas principales del inventario">
        <StatCard label="Consumibles activos" value={activeConsumables.length} icon={PackageCheck} tone="teal" />
        <StatCard label="Unidades disponibles" value={availableInstrumentUnits} helper="Instrumental activo" icon={Boxes} tone="blue" />
        <StatCard label="Compras pendientes" value={pendingPurchaseCount} icon={Clock3} tone="amber" />
        <StatCard label="Alertas activas" value={alerts.length} icon={AlertTriangle} tone="amber" />
      </section>

      <section className={`card ${styles.overviewStock}`} aria-labelledby="stock-status-title">
        <div className={styles.overviewSectionHeader}>
          <div><h3 id="stock-status-title">Estado de existencias</h3><p>Situación actual de los consumibles activos.</p></div>
          <Link href="/inventario/consumibles">Ver consumibles</Link>
        </div>
        <div className={styles.overviewFacts}>
          <div><span>Unidades de consumibles</span><strong>{totalConsumableUnits}</strong></div>
          <div><span>Existencia baja</span><strong>{lowStockCount}</strong></div>
          <div><span>Próximos a vencer</span><strong>{expiringSoonCount}</strong></div>
          <div><span>Vencidos</span><strong>{expiredCount}</strong></div>
        </div>
      </section>

      <div className={styles.overviewGrid}>
        <section className={`card ${styles.overviewSection}`} aria-labelledby="priority-alerts-title">
          <div className={styles.overviewSectionHeader}>
            <div><h3 id="priority-alerts-title">Alertas prioritarias</h3><p>Vencimientos y existencias que requieren atención.</p></div>
            <Link href="/inventario/alertas">Ver todas las alertas</Link>
          </div>
          {priorityAlerts.length ? <div className={styles.overviewList}>
            {priorityAlerts.map((alert) => {
              const consumable = consumableById.get(alert.consumableId);
              return <article key={alert.id} className={styles.overviewListItem}>
                <div><strong>{consumable?.name ?? "Consumible no disponible"}</strong><span>{alert.title}</span></div>
                <p>{alert.message}</p>
              </article>;
            })}
          </div> : <EmptyState title="No hay alertas activas" description="Los consumibles activos se encuentran dentro de sus niveles y fechas esperadas." />}
        </section>

        <section className={`card ${styles.overviewSection}`} aria-labelledby="pending-purchases-title">
          <div className={styles.overviewSectionHeader}>
            <div><h3 id="pending-purchases-title">Compras pendientes</h3><p>Compras registradas que esperan recepción.</p></div>
            <Link href="/inventario/compras">Ver compras</Link>
          </div>
          {pendingPurchases.length ? <div className={styles.overviewList}>
            {pendingPurchases.map((purchase) => <article key={purchase.id} className={styles.overviewPurchaseItem}>
              <div><strong>{purchase.code}</strong><span>{supplierById.get(purchase.supplierId)?.name ?? "Proveedor no disponible"}</span></div>
              <div><span>{formatDate(purchase.purchaseDate)}</span><strong>{formatCurrency(purchaseTotal(purchase))}</strong></div>
            </article>)}
          </div> : <EmptyState title="Sin compras pendientes" description="Todas las compras registradas han sido recibidas." />}
        </section>

        <section className={`card ${styles.overviewSection}`} aria-labelledby="recent-movements-title">
          <div className={styles.overviewSectionHeader}>
            <div><h3 id="recent-movements-title">Movimientos recientes</h3><p>Últimas entradas registradas en el Kardex.</p></div>
            <Link href="/inventario/movimientos">Ver todos los movimientos</Link>
          </div>
          {recentMovements.length ? <div className={styles.overviewList}>
            {recentMovements.map((movement) => <article key={movement.id} className={styles.overviewMovementItem}>
              <div><strong>{consumableById.get(movement.consumableId)?.name ?? "Consumible no disponible"}</strong><span>{movementTypeLabels[movement.type]} · {movement.reference}</span></div>
              <div><strong className={styles.incomingQuantity}>+{movement.quantity}</strong><span>{formatDateTime(movement.occurredAt)}</span></div>
            </article>)}
          </div> : <EmptyState title="Sin movimientos" description="Todavía no existen movimientos registrados en el Kardex." />}
        </section>

        <section className={`card ${styles.overviewSection}`} aria-labelledby="instrument-status-title">
          <div className={styles.overviewSectionHeader}>
            <div><h3 id="instrument-status-title">Estado del instrumental</h3><p>Disponibilidad del instrumental activo.</p></div>
            <Link href="/inventario/instrumental">Ver instrumental</Link>
          </div>
          <div className={styles.instrumentOverview}>
            <div><span>Registros activos</span><strong>{activeInstruments.length}</strong></div>
            <div><span>Total de unidades</span><strong>{activeInstrumentUnits}</strong></div>
            <div><span>Disponibles</span><strong>{availableInstrumentUnits}</strong></div>
            <div><span>No disponibles</span><strong>{unavailableInstrumentUnits}</strong></div>
          </div>
          <div className={styles.protocolSummary}>
            <span>Protocolos activos</span><strong>{activeProtocolCount}</strong><Link href="/inventario/protocolos">Ver protocolos</Link>
          </div>
        </section>
      </div>
    </>
  );
}
