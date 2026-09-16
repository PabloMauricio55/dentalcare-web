"use client";

import { ArrowDownLeft, ArrowUpRight, Banknote, Calculator, Lock, LockOpen, Wallet } from "lucide-react";
import { FormEvent, useState } from "react";
import { ActionNotice, Button, DataTable, EmptyState, Modal, PageHeader, StatCard, StatusBadge, type Column } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import type { CashMovement, CashShift, MovementKind, Payment } from "../models/billing";
import { billingService } from "../services/billing.service";
import { useBilling } from "./BillingProvider";

type ModalKind = "open" | "movement" | "close" | null;
const signed = (value: number) => value === 0 ? formatCurrency(0) : `${value > 0 ? "+" : "−"} ${formatCurrency(Math.abs(value))}`;

export function CashDrawerView() {
  const { patients } = useClinicSession();
  const billing = useBilling();
  const [modal, setModal] = useState<ModalKind>(null);
  const [movementKind, setMovementKind] = useState<MovementKind>("Ingreso");
  const [counted, setCounted] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const shift = billing.currentShift;
  const summary = shift ? billing.shiftSummaryOf(shift) : undefined;
  const openModal = (kind: ModalKind) => { setError(""); setModal(kind); };
  const openMovement = (kind: MovementKind) => { setMovementKind(kind); openModal("movement"); };
  const liveDifference = summary && counted.trim() !== "" && !Number.isNaN(Number(counted)) ? billingService.cashDifference(Number(counted), summary.expected) : undefined;

  const submitOpen = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const raw = String(new FormData(event.currentTarget).get("openingAmount")).trim();
    const amount = Number(raw);
    if (raw === "" || Number.isNaN(amount) || amount < 0) { setError("Indica el fondo inicial en efectivo. Puede ser Q0.00, pero no negativo."); return; }
    billing.openShift({ openingAmount: amount });
    setModal(null); setNotice(`Turno abierto con fondo inicial de ${formatCurrency(amount)}.`);
  };

  const submitMovement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!summary) return;
    const data = new FormData(event.currentTarget);
    const concept = String(data.get("concept")).trim();
    const amount = Number(data.get("amount"));
    if (concept.length < 3) { setError("Describe el concepto del movimiento."); return; }
    if (!(amount > 0)) { setError("El monto debe ser mayor a cero."); return; }
    if (movementKind === "Egreso" && amount > summary.expected) { setError(`No puedes retirar más del efectivo disponible (${formatCurrency(summary.expected)}).`); return; }
    billing.addMovement({ kind: movementKind, concept, amount });
    setModal(null); setNotice(`${movementKind} registrado: ${concept} por ${formatCurrency(amount)}.`);
  };

  const submitClose = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!summary) return;
    const amount = Number(counted);
    const note = String(new FormData(event.currentTarget).get("closingNote")).trim();
    if (counted.trim() === "" || Number.isNaN(amount) || amount < 0) { setError("Indica el efectivo contado en el cajón."); return; }
    const difference = billingService.cashDifference(amount, summary.expected);
    if (difference !== 0 && note.length < 10) { setError(`Hay una diferencia de ${signed(difference)}. Explica el motivo con al menos 10 caracteres.`); return; }
    billing.closeShift({ countedAmount: amount, closingNote: note });
    setModal(null); setCounted("");
    setNotice(difference === 0 ? "Turno cerrado. El arqueo cuadra con el efectivo esperado." : `Turno cerrado con ${difference > 0 ? "sobrante" : "faltante"} de ${formatCurrency(Math.abs(difference))}.`);
  };

  const movementColumns: Column<CashMovement>[] = [
    { key: "time", header: "Hora", cell: (row) => row.time },
    { key: "kind", header: "Tipo", cell: (row) => <StatusBadge status={row.kind} /> },
    { key: "concept", header: "Concepto", cell: (row) => <div className="cell-stack"><strong>{row.concept}</strong><small>{row.registeredBy}</small></div> },
    { key: "amount", header: "Monto", cell: (row) => <strong>{signed(row.kind === "Ingreso" ? row.amount : -row.amount)}</strong> },
  ];

  const paymentColumns: Column<Payment>[] = [
    { key: "receipt", header: "Recibo", cell: (row) => billing.receiptOf(row.receiptId)?.number ?? "—" },
    { key: "patient", header: "Paciente", cell: (row) => patients.find((item) => item.id === row.patientId)?.name ?? "—" },
    { key: "kind", header: "Tipo", cell: (row) => <StatusBadge status={row.kind} /> },
    { key: "method", header: "Forma de pago", cell: (row) => row.method },
    { key: "amount", header: "Monto", cell: (row) => <strong>{formatCurrency(row.amount)}</strong> },
    { key: "drawer", header: "Arqueo", cell: (row) => row.method === "Efectivo" ? "Suma al efectivo" : "No entra al cajón" },
  ];

  const shiftColumns: Column<CashShift>[] = [
    { key: "period", header: "Turno", cell: (row) => <div className="cell-stack"><strong>{row.openedAt} → {row.closedAt.slice(11)}</strong><small>{row.openedBy}</small></div> },
    { key: "opening", header: "Fondo inicial", cell: (row) => formatCurrency(row.openingAmount) },
    { key: "expected", header: "Esperado", cell: (row) => formatCurrency(row.expectedAmount) },
    { key: "counted", header: "Contado", cell: (row) => formatCurrency(row.countedAmount) },
    { key: "difference", header: "Diferencia", cell: (row) => <strong>{signed(row.difference)}</strong> },
    { key: "note", header: "Observación", cell: (row) => row.closingNote || "Sin diferencias" },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return <>
    <PageHeader
      title="Caja diaria"
      description={shift ? `Turno abierto por ${shift.openedBy} · ${shift.openedAt}` : "Apertura de turno, movimientos manuales, arqueo y cierre."}
      actions={shift ? <>
        <Button variant="ghost" onClick={() => openMovement("Ingreso")}><ArrowDownLeft size={17} /> Ingreso</Button>
        <Button variant="ghost" onClick={() => openMovement("Egreso")}><ArrowUpRight size={17} /> Egreso</Button>
        <Button onClick={() => { setCounted(""); openModal("close"); }}><Lock size={17} /> Arqueo y cierre</Button>
      </> : <Button onClick={() => openModal("open")}><LockOpen size={17} /> Abrir turno</Button>}
    />
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}

    {shift && summary ? <>
      <section className="stats-grid">
        <StatCard label="Fondo inicial" value={formatCurrency(summary.opening)} helper={`Apertura ${shift.openedAt.slice(11)}`} icon={Wallet} tone="blue" />
        <StatCard label="Ingresos en efectivo" value={formatCurrency(summary.patientCash + summary.manualIn)} helper={`Pacientes ${formatCurrency(summary.patientCash)} · Manuales ${formatCurrency(summary.manualIn)}`} icon={ArrowDownLeft} tone="green" />
        <StatCard label="Egresos" value={formatCurrency(summary.manualOut)} helper={`Otros medios fuera del cajón: ${formatCurrency(summary.otherMethods)}`} icon={ArrowUpRight} tone="amber" />
        <StatCard label="Efectivo esperado" value={formatCurrency(summary.expected)} helper="Lo que debería haber en el cajón" icon={Calculator} tone="teal" />
      </section>

      <section className="card">
        <div className="card-heading"><div><h3>Movimientos manuales</h3><p>Ingresos y egresos de efectivo que no provienen de un paciente.</p></div></div>
        <DataTable columns={movementColumns} rows={billing.movementsOf(shift.id)} emptyMessage="Todavía no hay movimientos manuales en este turno." />
      </section>

      <section className="card">
        <div className="card-heading"><div><h3>Cobros a pacientes en el turno</h3><p>Se registran desde Cuenta del paciente. Solo el efectivo suma al arqueo.</p></div></div>
        <DataTable columns={paymentColumns} rows={billing.shiftPaymentsOf(shift.id)} emptyMessage="Aún no se han cobrado pagos a pacientes en este turno." />
      </section>
    </> : <section className="card">
      <EmptyState title="Caja cerrada" description="Abre un turno con el fondo inicial para registrar cobros, ingresos y egresos." action={<Button onClick={() => openModal("open")}><LockOpen size={17} /> Abrir turno</Button>} />
    </section>}

    <section className="card">
      <div className="card-heading"><div><h3>Historial de turnos</h3><p>Arqueos anteriores con su diferencia y observación.</p></div></div>
      <DataTable columns={shiftColumns} rows={billing.closedShifts} emptyMessage="No hay turnos cerrados." />
    </section>

    <Modal open={modal === "open"} title="Abrir turno" description="El cajero en sesión queda registrado como responsable del turno." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitOpen}>
        <label className="field full"><span>Fondo inicial en efectivo (Q) *</span><input name="openingAmount" type="number" min="0" step="0.01" placeholder="0.00" /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit"><LockOpen size={16} /> Abrir turno</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "movement"} title={`Registrar ${movementKind.toLowerCase()}`} description={movementKind === "Ingreso" ? "Entrada de efectivo que no proviene de un cobro a paciente." : "Salida de efectivo del cajón, por ejemplo una compra menor."} onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submitMovement}>
        <label className="field full"><span>Concepto *</span><input name="concept" placeholder={movementKind === "Ingreso" ? "Reposición de fondo de cambio" : "Compra de insumos de limpieza"} /></label>
        <label className="field"><span>Monto (Q) *</span><input name="amount" type="number" min="0" step="0.01" placeholder="0.00" /></label>
        {summary && <div className="field"><span>Efectivo disponible</span><strong>{formatCurrency(summary.expected)}</strong></div>}
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Registrar {movementKind.toLowerCase()}</Button></div>
      </form>
    </Modal>

    <Modal open={modal === "close" && !!summary} title="Arqueo y cierre de turno" description="Cuenta el efectivo del cajón y compáralo con lo esperado." onClose={() => setModal(null)}>
      {summary && <form className="form-grid" onSubmit={submitClose}>
        <div className="info-grid full">
          <div><span>Fondo inicial</span><strong>{formatCurrency(summary.opening)}</strong></div>
          <div><span>Cobros en efectivo</span><strong>{formatCurrency(summary.patientCash)}</strong></div>
          <div><span>Ingresos manuales</span><strong>{formatCurrency(summary.manualIn)}</strong></div>
          <div><span>Egresos manuales</span><strong>{formatCurrency(summary.manualOut)}</strong></div>
          <div className="full"><span>Efectivo esperado</span><strong>{formatCurrency(summary.expected)}</strong></div>
        </div>
        <label className="field"><span>Efectivo contado (Q) *</span><input name="countedAmount" type="number" min="0" step="0.01" placeholder="0.00" value={counted} onChange={(event) => setCounted(event.target.value)} /></label>
        <div className="field"><span>Diferencia</span><strong>{liveDifference === undefined ? "—" : liveDifference === 0 ? "Cuadra" : `${signed(liveDifference)} (${liveDifference > 0 ? "sobrante" : "faltante"})`}</strong></div>
        <label className="field full"><span>Observación {liveDifference ? "*" : ""}</span><textarea name="closingNote" rows={3} placeholder="Obligatoria si el arqueo no cuadra" /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit"><Banknote size={16} /> Cerrar turno</Button></div>
      </form>}
    </Modal>
  </>;
}
