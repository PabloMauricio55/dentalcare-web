"use client";

import { BadgeCheck, HandCoins, Percent, Plus, ReceiptText, Wallet } from "lucide-react";
import { FormEvent, useState } from "react";
import { ActionNotice, Button, DataTable, EmptyState, Modal, PageHeader, StatCard, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { Adjustment, Charge, Installment, Payment, PaymentMethod, Receipt } from "../models/billing";
import { billingService } from "../services/billing.service";
import { useBilling } from "./BillingProvider";
import { ReceiptPreview } from "./ReceiptPreview";

type ModalKind = "charge" | "payment" | "discount" | "advance" | "installment" | "receipt" | null;
const methods: PaymentMethod[] = ["Efectivo", "Tarjeta", "Transferencia", "Cheque"];
const methodField = <label className="field"><span>Forma de pago *</span><select name="method" defaultValue="Efectivo">{methods.map((method) => <option key={method}>{method}</option>)}</select></label>;

export function PatientAccountView() {
  const { patients, selectedPatientId } = useClinicSession();
  const billing = useBilling();
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeCharge, setActiveCharge] = useState<Charge | null>(null);
  const [activeInstallment, setActiveInstallment] = useState<Installment | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const patient = patients.find((item) => item.id === selectedPatientId);
  const openModal = (kind: ModalKind) => { setError(""); setModal(kind); };

  if (!patient) {
    return <>
      <PageHeader title="Cuenta del paciente" description="Saldos, cargos, pagos, anticipos, convenio y plan de cuotas." />
      <section className="card"><EmptyState title="Sin paciente seleccionado" description="Elige un paciente en el selector superior para ver y operar su estado de cuenta." /></section>
    </>;
  }

  const charges = billing.chargesOf(patient.id);
  const payments = billing.paymentsOf(patient.id);
  const discounts = billing.adjustmentsOf(patient.id).filter((item) => item.kind === "Descuento");
  const receipts = billing.receiptsOf(patient.id);
  const summary = billing.summaryOf(patient.id);
  const plan = billing.planOf(patient.id);
  const installments = plan ? billing.installmentsOf(plan.id) : [];

  const showReceipt = (receipt: Receipt) => { setActiveReceipt(receipt); setModal("receipt"); };

  const submitCharge = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const concept = String(data.get("concept")).trim();
    const amount = Number(data.get("amount"));
    if (!concept) { setError("Indica el concepto del cargo."); return; }
    if (!(amount > 0)) { setError("El monto debe ser mayor a cero."); return; }
    billing.addCharge({ patientId: patient.id, concept, amount });
    setModal(null); setNotice(`Cargo registrado: ${concept} por ${formatCurrency(amount)}.`);
  };

  const submitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeCharge) return;
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const method = String(data.get("method")) as PaymentMethod;
    const pending = billingService.pendingOf(activeCharge);
    if (!(amount > 0)) { setError("El monto debe ser mayor a cero."); return; }
    if (amount > pending) { setError(`El monto supera el pendiente del cargo (${formatCurrency(pending)}).`); return; }
    const receipt = billing.registerPayment({ patientId: patient.id, kind: amount >= pending ? "Pago" : "Abono", amount, method, chargeId: activeCharge.id }, activeCharge.concept);
    setNotice(`${amount >= pending ? "Pago" : "Abono"} aplicado. Recibo ${receipt.number} emitido.`);
    showReceipt(receipt);
  };

  const submitAdvance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const method = String(data.get("method")) as PaymentMethod;
    if (!(amount > 0)) { setError("El monto del anticipo debe ser mayor a cero."); return; }
    const receipt = billing.registerPayment({ patientId: patient.id, kind: "Anticipo", amount, method, chargeId: "" }, "Anticipo a cuenta");
    setNotice(`Anticipo de ${formatCurrency(amount)} registrado. Recibo ${receipt.number} emitido.`);
    showReceipt(receipt);
  };

  const submitDiscount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeCharge) return;
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const reason = String(data.get("reason")).trim();
    const pending = billingService.pendingOf(activeCharge);
    if (!(amount > 0)) { setError("El monto del descuento debe ser mayor a cero."); return; }
    if (amount > pending) { setError(`El descuento supera el pendiente del cargo (${formatCurrency(pending)}).`); return; }
    if (reason.length < 10) { setError("Describe el motivo del descuento con al menos 10 caracteres."); return; }
    billing.requestAdjustment({ kind: "Descuento", patientId: patient.id, originId: activeCharge.id, originLabel: `Cargo ${activeCharge.id} · ${activeCharge.concept}`, amount, reason });
    setModal(null); setNotice("Descuento solicitado. Queda por autorizar y todavía no afecta el saldo.");
  };

  const submitInstallment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeInstallment) return;
    const method = String(new FormData(event.currentTarget).get("method")) as PaymentMethod;
    const receipt = billing.payInstallment(activeInstallment.id, method);
    if (!receipt) { setError("La cuota ya fue cobrada."); return; }
    setNotice(`Cuota ${activeInstallment.number} cobrada. Recibo ${receipt.number} emitido.`);
    showReceipt(receipt);
  };

  const chargeColumns: Column<Charge>[] = [
    { key: "concept", header: "Cargo", cell: (row) => <div className="cell-stack"><strong>{row.concept}</strong><small>{row.date}</small></div> },
    { key: "amount", header: "Monto", cell: (row) => formatCurrency(row.amount) },
    { key: "discount", header: "Descuento", cell: (row) => row.discount ? `- ${formatCurrency(row.discount)}` : "—" },
    { key: "paid", header: "Pagado", cell: (row) => formatCurrency(row.paid) },
    { key: "pending", header: "Pendiente", cell: (row) => <strong>{formatCurrency(billingService.pendingOf(row))}</strong> },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => <div className="table-actions">
      <button title="Registrar pago o abono" disabled={row.status === "Pagado" || row.status === "Anulado"} onClick={() => { setActiveCharge(row); openModal("payment"); }}><Wallet size={16} /></button>
      <button title="Solicitar descuento" disabled={row.status === "Pagado" || row.status === "Anulado"} onClick={() => { setActiveCharge(row); openModal("discount"); }}><Percent size={16} /></button>
    </div> },
  ];

  const paymentColumns: Column<Payment>[] = [
    { key: "date", header: "Fecha", cell: (row) => row.date },
    { key: "kind", header: "Tipo", cell: (row) => <StatusBadge status={row.kind} /> },
    { key: "method", header: "Forma de pago", cell: (row) => row.method },
    { key: "amount", header: "Monto", cell: (row) => <strong>{formatCurrency(row.amount)}</strong> },
    { key: "receipt", header: "", className: "actions-cell", cell: (row) => { const receipt = receipts.find((item) => item.id === row.receiptId); return receipt ? <Button variant="secondary" onClick={() => showReceipt(receipt)}><ReceiptText size={16} /> {receipt.number}</Button> : "—"; } },
  ];

  const installmentColumns: Column<Installment>[] = [
    { key: "number", header: "Cuota", cell: (row) => `${row.number} de ${plan?.installmentCount ?? 0}` },
    { key: "dueDate", header: "Vence", cell: (row) => row.dueDate },
    { key: "amount", header: "Monto", cell: (row) => formatCurrency(row.amount) },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => row.status === "Pagada" ? "—" : <Button variant="secondary" onClick={() => { setActiveInstallment(row); openModal("installment"); }}>Cobrar cuota</Button> },
  ];

  const discountColumns: Column<Adjustment>[] = [
    { key: "origin", header: "Sobre", cell: (row) => <div className="cell-stack"><strong>{row.originLabel}</strong><small>{row.reason}</small></div> },
    { key: "amount", header: "Monto", cell: (row) => formatCurrency(row.amount) },
    { key: "requested", header: "Solicitó", cell: (row) => <div className="cell-stack"><span>{row.requestedBy}</span><small>{row.date}</small></div> },
    { key: "authorized", header: "Autorizó", cell: (row) => row.authorizedBy || "—" },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", className: "actions-cell", cell: (row) => row.status !== "Por autorizar" ? "—" : <div className="appointment-actions">
      <Button variant="secondary" onClick={() => { billing.authorizeAdjustment(row.id); setNotice("Descuento autorizado y aplicado al cargo."); }}><BadgeCheck size={16} /> Autorizar</Button>
      <Button variant="ghost" onClick={() => { billing.rejectAdjustment(row.id); setNotice("Descuento rechazado. El cargo queda sin cambios."); }}>Rechazar</Button>
    </div> },
  ];

  return <>
    <PageHeader
      title="Cuenta del paciente"
      description={`Estado de cuenta de ${patient.name} · ${patient.code}`}
      actions={<><Button variant="ghost" onClick={() => openModal("charge")}><Plus size={17} /> Nuevo cargo</Button><Button onClick={() => openModal("advance")}><HandCoins size={17} /> Registrar anticipo</Button></>}
    />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

    <section className="stats-grid">
      <StatCard label="Cargos del paciente" value={formatCurrency(summary.charged)} helper={summary.discounted ? `Descuentos aplicados: ${formatCurrency(summary.discounted)}` : "Sin descuentos aplicados"} icon={ReceiptText} tone="blue" />
      <StatCard label="Pagado" value={formatCurrency(summary.paid)} helper={`${payments.filter((item) => item.kind !== "Anticipo").length} movimientos`} icon={Wallet} tone="green" />
      <StatCard label="Anticipos a favor" value={formatCurrency(summary.advances)} helper="Disponible para próximos cargos" icon={HandCoins} tone="teal" />
      <StatCard label="Saldo pendiente" value={formatCurrency(summary.balance)} helper={summary.balance > 0 ? "Pendiente de cobro" : "Cuenta al día"} icon={BadgeCheck} tone={summary.balance > 0 ? "amber" : "green"} />
    </section>

    <section className="card">
      <div className="card-heading"><div><h3>Cargos</h3><p>Procedimientos y conceptos facturados al paciente.</p></div></div>
      <DataTable columns={chargeColumns} rows={charges} emptyMessage="El paciente no tiene cargos registrados." />
    </section>

    <section className="card">
      <div className="card-heading"><div><h3>Movimientos</h3><p>Pagos, abonos y anticipos con su recibo asociado.</p></div></div>
      <DataTable columns={paymentColumns} rows={payments} emptyMessage="Todavía no hay movimientos de caja para este paciente." />
    </section>

    <section className="card">
      <div className="card-heading"><div><h3>Convenio y plan de cuotas</h3><p>Financiamiento acordado con el paciente.</p></div>{plan && <StatusBadge status={plan.status} />}</div>
      {plan ? <div className="detail-stack">
        <div className="info-grid">
          <div><span>Total financiado</span><strong>{formatCurrency(plan.total)}</strong></div>
          <div><span>Enganche</span><strong>{formatCurrency(plan.downPayment)}</strong></div>
          <div><span>Cuotas</span><strong>{plan.installmentCount}</strong></div>
          <div><span>Inicio</span><strong>{plan.startDate}</strong></div>
        </div>
        <DataTable columns={installmentColumns} rows={installments} emptyMessage="El convenio no tiene cuotas generadas." />
      </div> : <EmptyState title="Sin convenio vigente" description="Este paciente no tiene un plan de cuotas asociado." />}
    </section>

    <section className="card">
      <div className="card-heading"><div><h3>Descuentos</h3><p>Todo descuento requiere autorización antes de afectar el saldo.</p></div></div>
      <DataTable columns={discountColumns} rows={discounts} emptyMessage="No hay descuentos solicitados para este paciente." />
    </section>

    <Modal open={modal === "charge"} title="Registrar cargo" description="El cargo se suma al estado de cuenta del paciente seleccionado." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitCharge}>
        <label className="field full"><span>Concepto *</span><input name="concept" placeholder="Procedimiento o servicio" /></label>
        <label className="field"><span>Monto (Q) *</span><input name="amount" type="number" min="0" step="0.01" defaultValue={0} /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Registrar cargo</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "payment"} title="Registrar pago o abono" description={activeCharge ? `${activeCharge.concept} · pendiente ${formatCurrency(billingService.pendingOf(activeCharge))}` : ""} onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitPayment}>
        <label className="field"><span>Monto (Q) *</span><input name="amount" type="number" min="0" step="0.01" defaultValue={activeCharge ? billingService.pendingOf(activeCharge) : 0} /></label>
        {methodField}
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Aplicar y emitir recibo</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "advance"} title="Registrar anticipo" description="El anticipo queda a favor del paciente para futuros cargos." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitAdvance}>
        <label className="field"><span>Monto (Q) *</span><input name="amount" type="number" min="0" step="0.01" defaultValue={0} /></label>
        {methodField}
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Registrar anticipo</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "discount"} title="Solicitar descuento" description={activeCharge ? `${activeCharge.concept} · pendiente ${formatCurrency(billingService.pendingOf(activeCharge))}` : ""} onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitDiscount}>
        <label className="field"><span>Monto del descuento (Q) *</span><input name="amount" type="number" min="0" step="0.01" defaultValue={0} /></label>
        <label className="field full"><span>Motivo *</span><textarea name="reason" rows={3} placeholder="Justificación que revisará quien autoriza" /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Enviar a autorización</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "installment"} title="Cobrar cuota" description={activeInstallment ? `Cuota ${activeInstallment.number} · ${formatCurrency(activeInstallment.amount)}` : ""} onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitInstallment}>
        {methodField}
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Cobrar y emitir recibo</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "receipt" && !!activeReceipt} title="Vista previa del recibo" description="Comprobante generado por la operación simulada." onClose={() => setModal(null)} footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cerrar</Button><Button onClick={() => { if (activeReceipt) { billing.sendReceipt(activeReceipt.id, patient.email); setActiveReceipt({ ...activeReceipt, sentTo: patient.email }); setNotice(`Recibo enviado a ${patient.email}.`); } }}>Enviar al paciente</Button></>}>
      {activeReceipt && <ReceiptPreview receipt={activeReceipt} patientName={patient.billingName} patientNit={patient.nit} />}
    </Modal>
  </>;
}
