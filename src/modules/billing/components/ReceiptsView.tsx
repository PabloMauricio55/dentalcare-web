"use client";

import { ArrowLeft, Ban, Eye, Mail, MailCheck, Printer, ReceiptText } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ActionNotice, Button, DataTable, Modal, PageHeader, Pagination, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { Receipt } from "../models/billing";
import { useBilling } from "./BillingProvider";
import { ReceiptPreview } from "./ReceiptPreview";
import styles from "./billing.module.css";

type StatusFilter = "Todos" | Receipt["status"];
const pageSize = 8;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function ReceiptsView() {
  const { patients, selectedPatientId } = useClinicSession();
  const billing = useBilling();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [onlySelected, setOnlySelected] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"preview" | "send" | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [printing, setPrinting] = useState<Receipt | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const receipts = billing.allReceipts;
  const patientOf = (id: string) => patients.find((item) => item.id === id);
  const active = receipts.find((item) => item.id === activeId);
  const filterBySelected = onlySelected && !!selectedPatientId;

  const rows = useMemo(() => [...receipts].sort((a, b) => b.number.localeCompare(a.number)).filter((item) => (statusFilter === "Todos" || item.status === statusFilter) && (!filterBySelected || item.patientId === selectedPatientId) && [item.number, item.concept, item.method, patients.find((person) => person.id === item.patientId)?.name].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [receipts, statusFilter, filterBySelected, selectedPatientId, query, patients]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const emitted = receipts.filter((item) => item.status === "Emitido");

  useEffect(() => {
    if (!printing) return;
    const finish = () => setPrinting(null);
    window.addEventListener("afterprint", finish);
    window.print();
    return () => window.removeEventListener("afterprint", finish);
  }, [printing]);

  const changeFilter = (apply: () => void) => { apply(); setPage(1); };
  const openPreview = (receipt: Receipt) => { setActiveId(receipt.id); setModal("preview"); };
  const openSend = (receipt: Receipt) => { setActiveId(receipt.id); setError(""); setModal("send"); };
  const reprint = (receipt: Receipt) => { billing.reprintReceipt(receipt.id); setModal(null); setNotice(`Recibo ${receipt.number} enviado a impresión.`); setPrinting({ ...receipt, printCount: receipt.printCount + 1 }); };

  const submitSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active) return;
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    if (active.status === "Anulado") { setError("No se puede enviar un recibo anulado."); return; }
    if (!isEmail(email)) { setError("Ingresa un correo electrónico válido."); return; }
    billing.sendReceipt(active.id, email);
    setModal(null); setNotice(`Recibo ${active.number} enviado a ${email}.`);
  };

  const columns: Column<Receipt>[] = [
    { key: "number", header: "Recibo", cell: (row) => <div className="cell-stack"><strong>{row.number}</strong><small>{row.date}</small></div> },
    { key: "patient", header: "Paciente", cell: (row) => patientOf(row.patientId)?.name ?? "—" },
    { key: "concept", header: "Concepto", cell: (row) => <div className="cell-stack"><span>{row.concept}</span><small>{row.method}</small></div> },
    { key: "amount", header: "Monto", cell: (row) => <strong>{formatCurrency(row.amount)}</strong> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "delivery", header: "Envío e impresión", cell: (row) => <div className="cell-stack"><span>{row.sentTo || "Sin enviar"}</span><small>{row.printCount === 1 ? "1 impresión" : `${row.printCount} impresiones`}</small></div> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => <div className="table-actions">
      <button title="Vista previa" onClick={() => openPreview(row)}><Eye size={16} /></button>
      <button title="Reimprimir" onClick={() => reprint(row)}><Printer size={16} /></button>
      <button title={row.status === "Anulado" ? "Un recibo anulado no se envía" : "Enviar al paciente"} disabled={row.status === "Anulado"} onClick={() => openSend(row)}><Mail size={16} /></button>
    </div> },
  ];

  if (printing) {
    const patient = patientOf(printing.patientId);
    return <section className={`card ${styles.printSheet}`}>
      <div className={styles.noPrint}><Button variant="ghost" onClick={() => setPrinting(null)}><ArrowLeft size={16} /> Volver a recibos</Button></div>
      <div className={styles.printHeading}>
        <div><h3>DentalCare · Comprobante de pago</h3><p>Reimpresión n.º {printing.printCount} · Documento simulado sin validez fiscal</p></div>
        <StatusBadge status={printing.status} />
      </div>
      <ReceiptPreview receipt={printing} patientName={patient?.billingName ?? "—"} patientNit={patient?.nit ?? "CF"} />
      <p className={styles.printFooter}>Gracias por su confianza.</p>
    </section>;
  }

  return <>
    <PageHeader title="Recibos" description="Comprobantes emitidos, vista previa, reimpresión y envío al paciente." />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

    <section className="stats-grid">
      <StatCard label="Recibos emitidos" value={emitted.length} helper={formatCurrency(emitted.reduce((total, item) => total + item.amount, 0))} icon={ReceiptText} tone="green" />
      <StatCard label="Anulados" value={receipts.length - emitted.length} helper="Se conservan para trazabilidad" icon={Ban} tone="amber" />
      <StatCard label="Sin enviar" value={emitted.filter((item) => !item.sentTo).length} helper="Emitidos sin correo registrado" icon={MailCheck} tone="blue" />
      <StatCard label="Impresiones" value={receipts.reduce((total, item) => total + item.printCount, 0)} helper="Incluye reimpresiones" icon={Printer} tone="teal" />
    </section>

    <section className="card patient-search-card">
      <SearchInput value={query} onChange={(value) => changeFilter(() => setQuery(value))} placeholder="Buscar por número, paciente, concepto o forma de pago..." />
      <label className="compact-field"><span>Estado</span><select value={statusFilter} onChange={(event) => changeFilter(() => setStatusFilter(event.target.value as StatusFilter))}><option>Todos</option><option>Emitido</option><option>Anulado</option></select></label>
      <label className="compact-field"><span>Alcance</span><select value={filterBySelected ? "selected" : "all"} disabled={!selectedPatientId} onChange={(event) => changeFilter(() => setOnlySelected(event.target.value === "selected"))}><option value="all">Todos los pacientes</option><option value="selected">Paciente seleccionado</option></select></label>
      <span>{rows.length} recibos</span>
    </section>

    <section className="card">
      <DataTable columns={columns} rows={rows.slice((page - 1) * pageSize, page * pageSize)} emptyMessage="No hay recibos que coincidan con la búsqueda." />
      <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onPageChange={setPage} />
    </section>

    <Modal open={modal === "preview" && !!active} title="Vista previa del recibo" description={active ? `${active.number} · ${patientOf(active.patientId)?.name ?? ""}` : ""} onClose={() => setModal(null)} footer={active && <>
      <Button variant="ghost" onClick={() => reprint(active)}><Printer size={16} /> Reimprimir</Button>
      <Button disabled={active.status === "Anulado"} onClick={() => openSend(active)}><Mail size={16} /> Enviar al paciente</Button>
    </>}>
      {active && <ReceiptPreview receipt={active} patientName={patientOf(active.patientId)?.billingName ?? "—"} patientNit={patientOf(active.patientId)?.nit ?? "CF"} />}
    </Modal>

    <Modal open={modal === "send" && !!active} title="Enviar recibo" description={active ? `${active.number} · ${formatCurrency(active.amount)}` : ""} onClose={() => setModal(null)}>
      {active && <form className="form-grid" onSubmit={submitSend}>
        <label className="field full"><span>Correo del paciente *</span><input name="email" type="text" defaultValue={active.sentTo || patientOf(active.patientId)?.email} placeholder="correo@ejemplo.com" /></label>
        {active.sentTo && <p className="full">Ya fue enviado a {active.sentTo}. Puedes reenviarlo.</p>}
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit"><Mail size={16} /> Enviar</Button></div>
      </form>}
    </Modal>
  </>;
}
