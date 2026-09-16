"use client";

import { BookOpenCheck, CircleOff, Eye, FolderKanban, Pencil, Plus, Power, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import type { CreateProtocolDto } from "@/modules/inventory/dtos/create-protocol.dto";
import type { InventoryProtocol, InventoryProtocolCategory } from "@/modules/inventory/models/inventory.model";
import { ActionNotice, Button, ConfirmDialog, DataTable, EmptyState, Modal, PageHeader, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import { ProtocolForm } from "./ProtocolForm";
import { useInventory } from "./InventoryProvider";
import styles from "./inventory.module.css";

type ProtocolModalState = { mode: "create" } | { mode: "edit"; protocol: InventoryProtocol } | null;
type ProtocolStatusFilter = "all" | "active" | "inactive";

const categoryLabels: Record<InventoryProtocolCategory, string> = {
  receiving: "Recepción",
  storage: "Almacenamiento",
  replenishment: "Reposición",
  expiration_control: "Control de vencimientos",
};

export function ProtocolsView() {
  const { protocols, addProtocol, updateProtocol, deactivateProtocol } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | InventoryProtocolCategory>("all");
  const [status, setStatus] = useState<ProtocolStatusFilter>("all");
  const [modal, setModal] = useState<ProtocolModalState>(null);
  const [protocolDetail, setProtocolDetail] = useState<InventoryProtocol | null>(null);
  const [pendingDeactivation, setPendingDeactivation] = useState<InventoryProtocol | null>(null);
  const [notice, setNotice] = useState("");

  const usedCategories = useMemo(
    () => [...new Set(protocols.map((protocol) => protocol.category))],
    [protocols],
  );
  const filteredProtocols = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return protocols.filter((protocol) => {
      const matchesQuery = !normalizedQuery
        || protocol.name.toLocaleLowerCase("es").includes(normalizedQuery)
        || protocol.code.toLocaleLowerCase("es").includes(normalizedQuery)
        || protocol.responsible.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesCategory = category === "all" || protocol.category === category;
      const matchesStatus = status === "all" || protocol.active === (status === "active");
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, protocols, query, status]);
  const metrics = useMemo(() => ({
    active: protocols.filter((protocol) => protocol.active).length,
    inactive: protocols.filter((protocol) => !protocol.active).length,
    categories: usedCategories.length,
    total: protocols.length,
  }), [protocols, usedCategories]);

  const saveProtocol = (dto: CreateProtocolDto) => {
    if (modal?.mode === "edit") {
      updateProtocol(modal.protocol.id, dto);
      setNotice("El protocolo se actualizó correctamente.");
    } else {
      addProtocol(dto);
      setNotice("El protocolo se registró correctamente.");
    }
    setModal(null);
  };

  const confirmDeactivation = () => {
    if (!pendingDeactivation) return;
    deactivateProtocol(pendingDeactivation.id);
    setPendingDeactivation(null);
    setNotice("El protocolo se desactivó correctamente.");
  };

  const columns: Column<InventoryProtocol>[] = [
    { key: "code", header: "Código", className: styles.codeColumn, cell: (protocol) => <strong>{protocol.code}</strong> },
    { key: "name", header: "Nombre", cell: (protocol) => <strong>{protocol.name}</strong> },
    { key: "category", header: "Categoría", cell: (protocol) => categoryLabels[protocol.category] },
    { key: "responsible", header: "Responsable", cell: (protocol) => protocol.responsible },
    { key: "status", header: "Estado", cell: (protocol) => <StatusBadge status={protocol.active ? "Activo" : "Inactivo"} /> },
    { key: "actions", header: "Acciones", className: "actions-cell", cell: (protocol) => <div className={styles.actions}>
      <Button variant="secondary" onClick={() => setProtocolDetail(protocol)}><Eye size={15} /> Ver detalle</Button>
      <Button variant="secondary" onClick={() => setModal({ mode: "edit", protocol })}><Pencil size={15} /> Editar</Button>
      {protocol.active && <Button variant="ghost" onClick={() => setPendingDeactivation(protocol)}><Power size={15} /> Desactivar</Button>}
    </div> },
  ];

  return (
    <>
      <PageHeader title="Protocolos" description="Administra los procedimientos internos de control y manejo del inventario." actions={<Button onClick={() => setModal({ mode: "create" })}><Plus size={17} /> Nuevo protocolo</Button>} />

      {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

      <section className={styles.statsGrid} aria-label="Resumen de protocolos">
        <StatCard label="Protocolos activos" value={metrics.active} icon={BookOpenCheck} tone="teal" />
        <StatCard label="Protocolos inactivos" value={metrics.inactive} icon={CircleOff} tone="amber" />
        <StatCard label="Categorías utilizadas" value={metrics.categories} icon={FolderKanban} tone="blue" />
        <StatCard label="Total de protocolos" value={metrics.total} icon={ScrollText} tone="green" />
      </section>

      <section className={`card ${styles.filters}`} aria-label="Búsqueda y filtros de protocolos">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, código o responsable..." />
        <label className="compact-field">
          <span>Categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as "all" | InventoryProtocolCategory)}>
            <option value="all">Todas</option>
            {usedCategories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}
          </select>
        </label>
        <label className="compact-field">
          <span>Estado</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as ProtocolStatusFilter)}>
            <option value="all">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>
        <span className={styles.resultCount}>{filteredProtocols.length} resultados</span>
      </section>

      <section className={`card ${styles.tableCard} ${styles.protocolsTable}`}>
        {filteredProtocols.length
          ? <DataTable columns={columns} rows={filteredProtocols} />
          : <EmptyState title="Sin protocolos" description="No hay protocolos que coincidan con la búsqueda y los filtros seleccionados." />}
      </section>

      <Modal open={modal !== null} title={modal?.mode === "edit" ? "Editar protocolo" : "Nuevo protocolo"} description="Completa la información del procedimiento interno de inventario." onClose={() => setModal(null)}>
        {modal && <ProtocolForm key={modal.mode === "edit" ? modal.protocol.id : "new"} protocol={modal.mode === "edit" ? modal.protocol : undefined} onCancel={() => setModal(null)} onSubmit={saveProtocol} />}
      </Modal>

      <Modal open={protocolDetail !== null} title="Detalle del protocolo" onClose={() => setProtocolDetail(null)}>
        {protocolDetail && <div className={styles.protocolDetail}>
          <div><span>Código</span><strong>{protocolDetail.code}</strong></div>
          <div><span>Nombre</span><strong>{protocolDetail.name}</strong></div>
          <div><span>Categoría</span><strong>{categoryLabels[protocolDetail.category]}</strong></div>
          <div><span>Responsable</span><strong>{protocolDetail.responsible}</strong></div>
          <div><span>Estado</span><StatusBadge status={protocolDetail.active ? "Activo" : "Inactivo"} /></div>
          <div className={styles.fullDetail}><span>Descripción</span><strong>{protocolDetail.description}</strong></div>
        </div>}
      </Modal>

      <ConfirmDialog open={pendingDeactivation !== null} title="Desactivar protocolo" message={`¿Deseas desactivar ${pendingDeactivation?.name ?? "este protocolo"}? Permanecerá disponible como registro inactivo.`} confirmLabel="Desactivar" danger onConfirm={confirmDeactivation} onClose={() => setPendingDeactivation(null)} />
    </>
  );
}
