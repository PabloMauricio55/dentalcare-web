import { StatusBadge } from "@/shared/components";
import { formatCurrency } from "@/shared/lib/currency";
import type { Receipt } from "../models/billing";

export function ReceiptPreview({ receipt, patientName, patientNit }: { receipt: Receipt; patientName: string; patientNit: string }) {
  return (
    <div className="detail-stack">
      <div className="info-grid">
        <div><span>Recibo</span><strong>{receipt.number}</strong></div>
        <div><span>Fecha de emisión</span><strong>{receipt.date}</strong></div>
        <div className="full"><span>Paciente</span><strong>{patientName}</strong></div>
        <div><span>NIT</span><strong>{patientNit}</strong></div>
        <div><span>Forma de pago</span><strong>{receipt.method}</strong></div>
        <div className="full"><span>Concepto</span><strong>{receipt.concept}</strong></div>
        <div><span>Total</span><strong>{formatCurrency(receipt.amount)}</strong></div>
        <div><span>Estado</span><StatusBadge status={receipt.status} /></div>
        <div className="full"><span>Enviado a</span><strong>{receipt.sentTo || "Sin enviar"}</strong></div>
      </div>
    </div>
  );
}
