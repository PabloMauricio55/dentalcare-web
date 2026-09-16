import type { Adjustment, AgreementPlan, CashMovement, CashShift, Charge, Installment, Payment, Receipt } from "../models/billing";

export const initialCharges: Charge[] = [
  { id: "cg1", patientId: "p1", date: "2026-08-28", concept: "Evaluación odontológica", amount: 150, discount: 0, paid: 150, status: "Pagado" },
  { id: "cg2", patientId: "p1", date: "2026-09-02", concept: "Restauración con resina", amount: 475, discount: 0, paid: 200, status: "Parcial" },
  { id: "cg3", patientId: "p2", date: "2026-09-05", concept: "Extracción simple", amount: 650, discount: 50, paid: 0, status: "Pendiente" },
  { id: "cg4", patientId: "p3", date: "2026-09-10", concept: "Profilaxis dental", amount: 350, discount: 0, paid: 0, status: "Pendiente" },
  { id: "cg5", patientId: "p4", date: "2026-09-08", concept: "Blanqueamiento dental", amount: 950, discount: 0, paid: 950, status: "Pagado" },
];

export const initialPayments: Payment[] = [
  { id: "pg1", patientId: "p1", date: "2026-08-28", kind: "Pago", amount: 150, method: "Efectivo", chargeId: "cg1", receiptId: "rc1", shiftId: "" },
  { id: "pg2", patientId: "p1", date: "2026-09-02", kind: "Abono", amount: 200, method: "Tarjeta", chargeId: "cg2", receiptId: "rc2", shiftId: "" },
  { id: "pg3", patientId: "p3", date: "2026-09-09", kind: "Anticipo", amount: 300, method: "Transferencia", chargeId: "", receiptId: "rc3", shiftId: "ts1" },
  { id: "pg4", patientId: "p4", date: "2026-09-08", kind: "Pago", amount: 950, method: "Tarjeta", chargeId: "cg5", receiptId: "rc4", shiftId: "" },
];

export const initialPlans: AgreementPlan[] = [
  { id: "pl1", patientId: "p2", chargeId: "cg3", total: 600, downPayment: 0, installmentCount: 3, startDate: "2026-09-05", status: "Vigente" },
];

export const initialInstallments: Installment[] = [
  { id: "pl1-1", planId: "pl1", number: 1, dueDate: "2026-10-05", amount: 200, status: "Pendiente" },
  { id: "pl1-2", planId: "pl1", number: 2, dueDate: "2026-11-05", amount: 200, status: "Pendiente" },
  { id: "pl1-3", planId: "pl1", number: 3, dueDate: "2026-12-05", amount: 200, status: "Pendiente" },
];

export const initialAdjustments: Adjustment[] = [
  { id: "aj1", kind: "Descuento", patientId: "p2", originId: "cg3", originLabel: "Cargo cg3 · Extracción simple", date: "2026-09-05", amount: 50, reason: "Convenio institucional autorizado por dirección.", requestedBy: "Mario López", authorizedBy: "Daniel Sajche", status: "Aplicada" },
  { id: "aj2", kind: "Devolución", patientId: "p4", originId: "pg4", originLabel: "Pago pg4 · Blanqueamiento dental · Recibo DC-000104", date: "2026-09-09", amount: 950, reason: "Tratamiento suspendido por indicación clínica.", requestedBy: "Mario López", authorizedBy: "", status: "Por autorizar" },
];

export const initialReceipts: Receipt[] = [
  { id: "rc1", number: "DC-000101", patientId: "p1", date: "2026-08-28", concept: "Evaluación odontológica", amount: 150, method: "Efectivo", status: "Emitido", sentTo: "", printCount: 1 },
  { id: "rc2", number: "DC-000102", patientId: "p1", date: "2026-09-02", concept: "Abono · Restauración con resina", amount: 200, method: "Tarjeta", status: "Emitido", sentTo: "maria.lopez@email.com", printCount: 1 },
  { id: "rc3", number: "DC-000103", patientId: "p3", date: "2026-09-09", concept: "Anticipo · Profilaxis dental", amount: 300, method: "Transferencia", status: "Emitido", sentTo: "", printCount: 0 },
  { id: "rc4", number: "DC-000104", patientId: "p4", date: "2026-09-08", concept: "Blanqueamiento dental", amount: 950, method: "Tarjeta", status: "Emitido", sentTo: "luis.soto@email.com", printCount: 2 },
];

export const nextReceiptSequence = 105;

export const initialShifts: CashShift[] = [
  { id: "ts1", openedBy: "Mario López", openedAt: "2026-09-09 08:00", openingAmount: 500, closedAt: "2026-09-09 18:05", expectedAmount: 615, countedAmount: 605, difference: -10, closingNote: "Faltante por cambio entregado de más; se reportó a administración.", status: "Cerrada" },
];

export const initialMovements: CashMovement[] = [
  { id: "mv1", shiftId: "ts1", time: "10:15", kind: "Ingreso", concept: "Reposición de fondo de cambio", amount: 200, registeredBy: "Mario López" },
  { id: "mv2", shiftId: "ts1", time: "13:40", kind: "Egreso", concept: "Compra de insumos de limpieza", amount: 85, registeredBy: "Mario López" },
];
