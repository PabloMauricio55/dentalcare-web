export type AccountStatus = "Pendiente" | "Pagado" | "Vencido" | "Sin deuda";
export type AccountItem = { id: string; date: string; concept: string; amount: string; status: AccountStatus; description: string };
export type Payment = { id: string; date: string; method: string; amount: string; status: "Pagado"; receipt: string };
export type PatientDocument = { id: string; name: string; type: "Consentimiento" | "Formulario" | "Indicación" | "Documento informativo" | "Presupuesto archivado"; date: string; status: "Disponible" | "Pendiente de revisión"; description: string };

export const mockAccountItems: AccountItem[] = [
  { id: "charge-01", date: "10 SEP 2026", concept: "Control de ortodoncia", amount: "Q 450.00", status: "Pendiente", description: "Control mensual y ajuste de alineadores." },
  { id: "charge-02", date: "04 AGO 2026", concept: "Limpieza dental", amount: "Q 600.00", status: "Pagado", description: "Profilaxis preventiva completada." },
  { id: "charge-03", date: "14 JUN 2026", concept: "Evaluación general", amount: "Q 350.00", status: "Vencido", description: "Evaluación inicial pendiente de regularización." },
];
export const mockPayments: Payment[] = [
  { id: "payment-01", date: "04 AGO 2026", method: "Tarjeta", amount: "Q 600.00", status: "Pagado", receipt: "REC-0248" },
  { id: "payment-02", date: "12 JUL 2026", method: "Transferencia", amount: "Q 1,200.00", status: "Pagado", receipt: "REC-0219" },
];
export const mockDocuments: PatientDocument[] = [
  { id: "doc-01", name: "Consentimiento informado de ortodoncia", type: "Consentimiento", date: "12 ENE 2026", status: "Disponible", description: "Documento informativo asociado al plan de ortodoncia." },
  { id: "doc-02", name: "Indicaciones de higiene con alineadores", type: "Indicación", date: "18 SEP 2026", status: "Pendiente de revisión", description: "Recomendaciones para el cuidado diario durante el tratamiento." },
  { id: "doc-03", name: "Presupuesto PRES-1019", type: "Presupuesto archivado", date: "02 AGO 2026", status: "Disponible", description: "Resumen archivado del plan de alineadores." },
];
