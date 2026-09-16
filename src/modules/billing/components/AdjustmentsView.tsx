"use client";

import { Ban, BadgeCheck, Clock3, Eye, RotateCcw, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, SearchInput, StatCard, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { Adjustment, AdjustmentStatus } from "../models/billing";
import { billingService } from "../services/billing.service";
import { useBilling } from "./BillingProvider";

type RequestKind = "Devolución" | "Anulación";
type Pending = { action: "authorize" | "reject"; adjustment: Adjustment } | null;
const statuses: Array<AdjustmentStatus | "Todos"> = ["Todos", "Por autorizar", "Aplicada", "Rechazada"];

export function AdjustmentsView() {
  const { patients, selectedPatientId } = useClinicSession();
  const billing = useBilling();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdjustmentStatus | "Todos">("Todos");
  const [modal, setModal] = useState<"new" | "detail" | null>(null);
  const [requestKind, setRequestKind] = useState<RequestKind>("Devolución");
  const [active, setActive] = useState<Adjustment | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const patient = patients.find((item) => item.id === selectedPatientId);
  const patientName = (id: string) => patients.find((item) => item.id === id)?.name ?? "—";
  const adjustments = billing.allAdjustments;

  const rows = useMemo(() => [...adjustments].reverse().filter((item) => (statusFilter === "Todos" || item.status === statusFilter) && [item.kind, item.originLabel, item.reason, item.requestedBy, item.status, patients.find((person) => person.id === item.patientId)?.name].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [adjustments, statusFilter, query, patients]);
  const byStatus = (status: AdjustmentStatus) => adjustments.filter((item) => item.status === status);
  const refunded = byStatus("Aplicada").filter((item) => item.kind === "Devolución").reduce((total, item) => total + item.amount, 0);

  const refundablePayments = patient ? billing.paymentsOf(patient.id).filter((payment) => billingService.refundableOf(payment, adjustments) > 0 && !billingService.hasPendingFor(payment.id, adjustments)) : [];
  const voidableCharges = patient ? billing.chargesOf(patient.id).filter((charge) => charge.status !== "Anulado" && charge.paid === 0 && !billingService.hasPendingFor(charge.id, adjustments)) : [];

  const openNew = (kind: RequestKind) => { setRequestKind(kind); setError(""); setModal("new"); };
  const openDetail = (adjustment: Adjustment) => { setActive(adjustment); setModal("detail"); };

  const submitNew = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patient) return;
    const data = new FormData(event.currentTarget);
    const originId = String(data.get("originId") ?? "");
    const reason = String(data.get("reason")).trim();
    if (!originId) { setError("Selecciona el movimiento original."); return; }
    if (requestKind === "Devolución") {
      const payment = billing.paymentOf(originId);
      if (!payment) return;
      const refundable = billingService.refundableOf(payment, adjustments);
      const amount = Number(data.get("amount"));
      if (!(amount > 0)) { setError("El monto a devolver debe ser mayor a cero."); return; }
      if (amount > refundable) { setError(`La devolución supera lo disponible para devolver de ese pago (${formatCurrency(refundable)}).`); return; }
      if (reason.length < 10) { setError("Describe el motivo con al menos 10 caracteres."); return; }
      const receipt = billing.receiptOf(payment.receiptId);
      billing.requestAdjustment({ kind: "Devolución", patientId: patient.id, originId, originLabel: `Pago ${payment.id} · ${receipt?.concept ?? payment.kind} · Recibo ${receipt?.number ?? "—"}`, amount, reason });
    } else {
      const charge = billing.chargeOf(originId);
      if (!charge) return;
      if (reason.length < 10) { setError("Describe el motivo con al menos 10 caracteres."); return; }
      billing.requestAdjustment({ kind: "Anulación", patientId: patient.id, originId, originLabel: `Cargo ${charge.id} · ${charge.concept}`, amount: charge.amount, reason });
    }
    setModal(null); setStatusFilter("Todos"); setNotice(`${requestKind} solicitada. Queda por autorizar y todavía no afecta la cuenta.`);
  };

  const confirmPending = () => {
    if (!pending) return;
    const { action, adjustment } = pending;
    if (action === "authorize") billing.authorizeAdjustment(adjustment.id); else billing.rejectAdjustment(adjustment.id);
    setPending(null); setModal(null);
    setNotice(action === "authorize" ? `${adjustment.kind} autorizada y aplicada. El movimiento original se conserva con su nuevo estado.` : `${adjustment.kind} rechazada. El movimiento original no cambia.`);
  };

  const columns: Column<Adjustment>[] = [
    { key: "kind", header: "Operación", cell: (row) => <div className="cell-stack"><strong>{row.kind}</strong><small>{row.date}</small></div> },
    { key: "patient", header: "Paciente", cell: (row) => patientName(row.patientId) },
    { key: "origin", header: "Movimiento original", cell: (row) => <div className="cell-stack"><span>{row.originLabel}</span><small>{row.reason}</small></div> },
    { key: "amount", header: "Monto", cell: (row) => <strong>{formatCurrency(row.amount)}</strong> },
    { key: "trace", header: "Trazabilidad", cell: (row) => <div className="cell-stack"><span>Solicitó {row.requestedBy}</span><small>{row.authorizedBy ? `${row.status === "Rechazada" ? "Rechazó" : "Autorizó"} ${row.authorizedBy}` : "Sin resolver"}</small></div> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => <div className="table-actions">
      <button title="Ver trazabilidad" onClick={() => openDetail(row)}><Eye size={16} /></button>
      {row.status === "Por autorizar" && <button title="Autorizar" onClick={() => setPending({ action: "authorize", adjustment: row })}><BadgeCheck size={16} /></button>}
      {row.status === "Por autorizar" && <button className="danger-icon" title="Rechazar" onClick={() => setPending({ action: "reject", adjustment: row })}><X size={16} /></button>}
    </div> },
  ];

  const detailCharge = active && active.kind !== "Devolución" ? billing.chargeOf(active.originId) : undefined;
  const detailPayment = active && active.kind === "Devolución" ? billing.paymentOf(active.originId) : undefined;
  const detailReceipt = detailPayment ? billing.receiptOf(detailPayment.receiptId) : undefined;

  return <>
    <PageHeader
      title="Devoluciones y anulaciones"
      description="Operaciones excepcionales con motivo, autorización y trazabilidad. El movimiento original nunca se elimina."
      actions={<>
        <Button variant="ghost" disabled={!patient} title={patient ? "" : "Selecciona un paciente"} onClick={() => openNew("Anulación")}><Ban size={17} /> Anular cargo</Button>
        <Button disabled={!patient} title={patient ? "" : "Selecciona un paciente"} onClick={() => openNew("Devolución")}><RotateCcw size={17} /> Devolver pago</Button>
      </>}
    />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

    <section className="stats-grid">
      <StatCard label="Por autorizar" value={byStatus("Por autorizar").length} helper={formatCurrency(byStatus("Por autorizar").reduce((total, item) => total + item.amount, 0))} icon={Clock3} tone="amber" />
      <StatCard label="Aplicadas" value={byStatus("Aplicada").length} helper="Con efecto en la cuenta del paciente" icon={BadgeCheck} tone="green" />
      <StatCard label="Rechazadas" value={byStatus("Rechazada").length} helper="Sin cambios en el movimiento original" icon={X} tone="blue" />
      <StatCard label="Monto devuelto" value={formatCurrency(refunded)} helper="Devoluciones autorizadas" icon={RotateCcw} tone="teal" />
    </section>

    <section className="card patient-search-card">
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar por paciente, operación, motivo o movimiento..." />
      <label className="compact-field"><span>Estado</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AdjustmentStatus | "Todos")}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <span>{rows.length} operaciones</span>
    </section>

    <section className="card">
      <DataTable columns={columns} rows={rows} emptyMessage="No hay operaciones que coincidan con el filtro." />
    </section>

    <Modal open={modal === "new" && !!patient} title={requestKind === "Devolución" ? "Solicitar devolución" : "Solicitar anulación"} description={patient ? `${patient.name} · requiere autorización antes de aplicarse` : ""} onClose={() => setModal(null)}>
      {patient && <form className="form-grid" onSubmit={submitNew}>
        {requestKind === "Devolución" ? <>
          <label className="field full"><span>Pago original *</span><select name="originId" defaultValue=""><option value="">Selecciona un pago</option>{refundablePayments.map((payment) => <option key={payment.id} value={payment.id}>{billing.receiptOf(payment.receiptId)?.number ?? payment.id} · {payment.kind} · {payment.method} · disponible {formatCurrency(billingService.refundableOf(payment, adjustments))}</option>)}</select></label>
          <label className="field"><span>Monto a devolver (Q) *</span><input name="amount" type="number" min="0" step="0.01" placeholder="0.00" /></label>
        </> : <label className="field full"><span>Cargo a anular *</span><select name="originId" defaultValue=""><option value="">Selecciona un cargo sin pagos</option>{voidableCharges.map((charge) => <option key={charge.id} value={charge.id}>{charge.concept} · {charge.date} · {formatCurrency(charge.amount)}</option>)}</select></label>}
        {(requestKind === "Devolución" ? refundablePayments : voidableCharges).length === 0 && <p className="form-error full">{requestKind === "Devolución" ? "Este paciente no tiene pagos disponibles para devolver." : "Este paciente no tiene cargos sin pagos para anular. Si el cargo tiene pagos, primero solicita su devolución."}</p>}
        <label className="field full"><span>Motivo *</span><textarea name="reason" rows={3} placeholder="Justificación que revisará quien autoriza" /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Enviar a autorización</Button></div>
      </form>}
    </Modal>

    <Modal open={modal === "detail" && !!active} title="Trazabilidad de la operación" description={active ? `${active.kind} · ${patientName(active.patientId)}` : ""} onClose={() => setModal(null)} footer={active?.status === "Por autorizar" ? <><Button variant="ghost" onClick={() => setPending({ action: "reject", adjustment: active })}>Rechazar</Button><Button onClick={() => setPending({ action: "authorize", adjustment: active })}><BadgeCheck size={16} /> Autorizar</Button></> : undefined}>
      {active && <div className="detail-stack">
        <div className="info-grid">
          <div><span>Operación</span><strong>{active.kind}</strong></div>
          <div><span>Estado</span><StatusBadge status={active.status} /></div>
          <div><span>Monto</span><strong>{formatCurrency(active.amount)}</strong></div>
          <div><span>Fecha de solicitud</span><strong>{active.date}</strong></div>
          <div className="full"><span>Motivo</span><strong>{active.reason}</strong></div>
          <div><span>Solicitó</span><strong>{active.requestedBy}</strong></div>
          <div><span>{active.status === "Rechazada" ? "Rechazó" : "Autorizó"}</span><strong>{active.authorizedBy || "Pendiente de autorización"}</strong></div>
        </div>
        <div className="next-actions">
          <h4>Movimiento original</h4>
          {detailCharge && <div className="info-grid">
            <div className="full"><span>Cargo</span><strong>{detailCharge.concept}</strong></div>
            <div><span>Fecha</span><strong>{detailCharge.date}</strong></div>
            <div><span>Monto</span><strong>{formatCurrency(detailCharge.amount)}</strong></div>
            <div><span>Pagado</span><strong>{formatCurrency(detailCharge.paid)}</strong></div>
            <div><span>Estado actual</span><StatusBadge status={detailCharge.status} /></div>
          </div>}
          {detailPayment && <div className="info-grid">
            <div><span>Recibo</span><strong>{detailReceipt?.number ?? "—"}</strong></div>
            <div><span>Fecha</span><strong>{detailPayment.date}</strong></div>
            <div className="full"><span>Concepto</span><strong>{detailReceipt?.concept ?? detailPayment.kind}</strong></div>
            <div><span>Forma de pago</span><strong>{detailPayment.method}</strong></div>
            <div><span>Monto cobrado</span><strong>{formatCurrency(detailPayment.amount)}</strong></div>
            <div><span>Estado del recibo</span>{detailReceipt ? <StatusBadge status={detailReceipt.status} /> : <strong>—</strong>}</div>
          </div>}
          {!detailCharge && !detailPayment && <p>{active.originLabel}</p>}
        </div>
        <div className="clinical-warning"><Clock3 size={19} /><p><strong>El registro original se conserva</strong><span>Una operación aplicada cambia el estado del cargo o del recibo, pero nunca los elimina. Así queda la trazabilidad completa.</span></p></div>
      </div>}
    </Modal>

    <ConfirmDialog
      open={!!pending}
      title={pending?.action === "authorize" ? `Autorizar ${pending.adjustment.kind.toLowerCase()}` : "Rechazar solicitud"}
      message={pending ? pending.action === "authorize" ? `Se aplicará ${pending.adjustment.kind.toLowerCase()} por ${formatCurrency(pending.adjustment.amount)} sobre "${pending.adjustment.originLabel}". El movimiento original se conserva con su nuevo estado.` : `La solicitud de ${pending.adjustment.kind.toLowerCase()} quedará rechazada y el movimiento original no cambia.` : ""}
      confirmLabel={pending?.action === "authorize" ? "Autorizar" : "Rechazar"}
      danger={pending?.action === "reject" || pending?.adjustment.kind !== "Descuento"}
      onClose={() => setPending(null)}
      onConfirm={confirmPending}
    />
  </>;
}
