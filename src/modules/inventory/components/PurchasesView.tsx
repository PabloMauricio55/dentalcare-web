"use client";

import { CircleCheck, Clock3, Eye, Pencil, Plus, Power, ShoppingCart, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { CreatePurchaseDto } from "@/modules/inventory/dtos/create-purchase.dto";
import type { CreateSupplierDto } from "@/modules/inventory/dtos/create-supplier.dto";
import type { Purchase, Supplier } from "@/modules/inventory/models/inventory.model";
import { formatCurrency } from "@/shared/lib/currency";
import { ActionNotice, Button, ConfirmDialog, DataTable, EmptyState, Modal, PageHeader, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import { PurchaseForm } from "./PurchaseForm";
import { SupplierForm } from "./SupplierForm";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type ActiveSection = "purchases" | "suppliers";
type SupplierModalState = { mode: "create" } | { mode: "edit"; supplier: Supplier } | null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function PurchasesView() {
  const {
    consumables,
    suppliers,
    purchases,
    addSupplier,
    updateSupplier,
    deactivateSupplier,
    addPurchase,
    receivePurchase,
  } = useInventory();
  const [activeSection, setActiveSection] = useState<ActiveSection>("purchases");
  const [supplierQuery, setSupplierQuery] = useState("");
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [supplierModal, setSupplierModal] = useState<SupplierModalState>(null);
  const [purchaseDetail, setPurchaseDetail] = useState<Purchase | null>(null);
  const [pendingPurchase, setPendingPurchase] = useState<Purchase | null>(null);
  const [pendingSupplier, setPendingSupplier] = useState<Supplier | null>(null);
  const [notice, setNotice] = useState("");

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const consumableById = useMemo(() => new Map(consumables.map((consumable) => [consumable.id, consumable])), [consumables]);
  const activeSuppliers = useMemo(() => suppliers.filter((supplier) => supplier.active), [suppliers]);
  const activeConsumables = useMemo(() => consumables.filter((consumable) => consumable.status === "active"), [consumables]);
  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = supplierQuery.trim().toLocaleLowerCase("es");
    return suppliers.filter((supplier) => !normalizedQuery || supplier.name.toLocaleLowerCase("es").includes(normalizedQuery));
  }, [supplierQuery, suppliers]);

  const purchaseTotal = (purchase: Purchase) => purchase.items.reduce((total, item) => total + item.quantity * item.unitCost, 0);
  const totalPurchased = purchases.reduce((total, purchase) => total + purchaseTotal(purchase), 0);
  const metrics = {
    pending: purchases.filter((purchase) => purchase.status === "pending").length,
    received: purchases.filter((purchase) => purchase.status === "received").length,
    activeSuppliers: activeSuppliers.length,
    totalPurchased,
  };

  const saveSupplier = (dto: CreateSupplierDto) => {
    if (supplierModal?.mode === "edit") {
      updateSupplier(supplierModal.supplier.id, dto);
      setNotice("El proveedor se actualizó correctamente.");
    } else {
      addSupplier(dto);
      setNotice("El proveedor se registró correctamente.");
    }
    setSupplierModal(null);
  };

  const savePurchase = (dto: CreatePurchaseDto) => {
    addPurchase(dto);
    setPurchaseModalOpen(false);
    setNotice("La compra se registró como pendiente.");
  };

  const confirmSupplierDeactivation = () => {
    if (!pendingSupplier) return;
    deactivateSupplier(pendingSupplier.id);
    setPendingSupplier(null);
    setNotice("El proveedor se desactivó correctamente.");
  };

  const confirmPurchaseReceipt = () => {
    if (!pendingPurchase) return;
    const received = receivePurchase(pendingPurchase.id);
    setPendingPurchase(null);
    setNotice(received
      ? "La compra se recibió y las existencias se actualizaron correctamente."
      : "No fue posible recibir la compra. Verifica que continúe pendiente y que sus consumibles estén activos.");
  };

  const purchaseColumns: Column<Purchase>[] = [
    { key: "code", header: "Código", cell: (purchase) => <strong>{purchase.code}</strong> },
    { key: "supplier", header: "Proveedor", cell: (purchase) => supplierById.get(purchase.supplierId)?.name ?? "Proveedor no disponible" },
    { key: "date", header: "Fecha", className: styles.compactColumn, cell: (purchase) => formatDate(purchase.purchaseDate) },
    { key: "items", header: "Items", cell: (purchase) => purchase.items.length },
    { key: "total", header: "Total", cell: (purchase) => formatCurrency(purchaseTotal(purchase)) },
    { key: "status", header: "Estado", cell: (purchase) => <StatusBadge status={purchase.status === "pending" ? "Pendiente" : "Recibida"} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (purchase) => <div className={styles.actions}><Button variant="secondary" onClick={() => setPurchaseDetail(purchase)}><Eye size={15} /> Ver detalle</Button>{purchase.status === "pending" && <Button onClick={() => setPendingPurchase(purchase)}><CircleCheck size={15} /> Recibir compra</Button>}</div> },
  ];

  const supplierColumns: Column<Supplier>[] = [
    { key: "name", header: "Nombre", cell: (supplier) => <strong>{supplier.name}</strong> },
    { key: "contact", header: "Contacto", cell: (supplier) => supplier.contactName },
    { key: "phone", header: "Teléfono", className: styles.compactColumn, cell: (supplier) => supplier.phone },
    { key: "email", header: "Correo", className: styles.optionalColumn, cell: (supplier) => supplier.email },
    { key: "status", header: "Estado", cell: (supplier) => <StatusBadge status={supplier.active ? "Activo" : "Inactivo"} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (supplier) => <div className={styles.actions}><Button variant="secondary" onClick={() => setSupplierModal({ mode: "edit", supplier })}><Pencil size={15} /> Editar</Button>{supplier.active && <Button variant="ghost" onClick={() => setPendingSupplier(supplier)}><Power size={15} /> Desactivar</Button>}</div> },
  ];

  return (
    <>
      <PageHeader
        title="Compras y proveedores"
        description="Registra compras simuladas, administra proveedores y recibe consumibles en inventario."
        actions={activeSection === "purchases"
          ? <Button onClick={() => setPurchaseModalOpen(true)}><Plus size={17} /> Nueva compra</Button>
          : <Button onClick={() => setSupplierModal({ mode: "create" })}><Plus size={17} /> Nuevo proveedor</Button>}
      />

      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

      <section className={styles.statsGrid} aria-label="Resumen de compras y proveedores">
        <StatCard label="Compras pendientes" value={metrics.pending} icon={Clock3} tone="amber" />
        <StatCard label="Compras recibidas" value={metrics.received} icon={CircleCheck} tone="green" />
        <StatCard label="Proveedores activos" value={metrics.activeSuppliers} icon={Users} tone="teal" />
        <StatCard label="Total comprado" value={formatCurrency(metrics.totalPurchased)} helper="Compras registradas" icon={ShoppingCart} tone="blue" />
      </section>

      <nav className={styles.viewSwitch} aria-label="Contenido de compras y proveedores">
        <button className={activeSection === "purchases" ? styles.activeView : ""} onClick={() => setActiveSection("purchases")}>Compras</button>
        <button className={activeSection === "suppliers" ? styles.activeView : ""} onClick={() => setActiveSection("suppliers")}>Proveedores</button>
      </nav>

      {activeSection === "purchases" ? (
        <section className={`card ${styles.tableCard}`}>
          {purchases.length ? <DataTable columns={purchaseColumns} rows={purchases} /> : <EmptyState title="Sin compras" description="Todavía no hay compras registradas." />}
        </section>
      ) : (
        <>
          <section className={`card ${styles.supplierSearch}`} aria-label="Búsqueda de proveedores">
            <SearchInput value={supplierQuery} onChange={setSupplierQuery} placeholder="Buscar proveedor por nombre..." />
            <span>{filteredSuppliers.length} resultados</span>
          </section>
          <section className={`card ${styles.tableCard}`}>
            {filteredSuppliers.length ? <DataTable columns={supplierColumns} rows={filteredSuppliers} /> : <EmptyState title="Sin proveedores" description="No hay proveedores que coincidan con la búsqueda." />}
          </section>
        </>
      )}

      <Modal open={purchaseModalOpen} title="Nueva compra" description="La compra quedará pendiente hasta confirmar su recepción." onClose={() => setPurchaseModalOpen(false)}>
        {purchaseModalOpen && <PurchaseForm suppliers={activeSuppliers} consumables={activeConsumables} onCancel={() => setPurchaseModalOpen(false)} onSubmit={savePurchase} />}
      </Modal>

      <Modal open={supplierModal !== null} title={supplierModal?.mode === "edit" ? "Editar proveedor" : "Nuevo proveedor"} description="Completa los datos de contacto del proveedor." onClose={() => setSupplierModal(null)}>
        {supplierModal && <SupplierForm key={supplierModal.mode === "edit" ? supplierModal.supplier.id : "new"} supplier={supplierModal.mode === "edit" ? supplierModal.supplier : undefined} onCancel={() => setSupplierModal(null)} onSubmit={saveSupplier} />}
      </Modal>

      <Modal open={purchaseDetail !== null} title={`Detalle de compra ${purchaseDetail?.code ?? ""}`} onClose={() => setPurchaseDetail(null)}>
        {purchaseDetail && <div className={styles.purchaseDetail}>
          <div className={styles.detailSummary}>
            <div><span>Proveedor</span><strong>{supplierById.get(purchaseDetail.supplierId)?.name ?? "Proveedor no disponible"}</strong></div>
            <div><span>Fecha</span><strong>{formatDate(purchaseDetail.purchaseDate)}</strong></div>
            <div><span>Estado</span><StatusBadge status={purchaseDetail.status === "pending" ? "Pendiente" : "Recibida"} /></div>
          </div>
          <div className={styles.detailItems}>
            {purchaseDetail.items.map((item) => <div key={item.consumableId}>
              <div><strong>{consumableById.get(item.consumableId)?.name ?? "Consumible no disponible"}</strong><span>{item.quantity} × {formatCurrency(item.unitCost)}</span></div>
              <strong>{formatCurrency(item.quantity * item.unitCost)}</strong>
            </div>)}
          </div>
          <p className={styles.detailTotal}>Total <strong>{formatCurrency(purchaseTotal(purchaseDetail))}</strong></p>
        </div>}
      </Modal>

      <ConfirmDialog open={pendingPurchase !== null} title="Recibir compra" message={`¿Deseas recibir la compra ${pendingPurchase?.code ?? "seleccionada"}? Las existencias de sus consumibles aumentarán y no podrá recibirse de nuevo.`} confirmLabel="Recibir compra" onConfirm={confirmPurchaseReceipt} onClose={() => setPendingPurchase(null)} />
      <ConfirmDialog open={pendingSupplier !== null} title="Desactivar proveedor" message={`¿Deseas desactivar ${pendingSupplier?.name ?? "este proveedor"}? Sus datos permanecerán disponibles.`} confirmLabel="Desactivar" danger onConfirm={confirmSupplierDeactivation} onClose={() => setPendingSupplier(null)} />
    </>
  );
}
