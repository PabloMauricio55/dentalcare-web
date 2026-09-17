import type { AuditEntry } from "../models/settings";

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export const settingsAuditExportService = {
  downloadCsv(rows: AuditEntry[], query: string) {
    const headers = ["Fecha y hora", "Usuario", "Módulo", "Acción", "Detalle", "Origen"];
    const content = [
      ["Fecha de exportación", new Date().toLocaleString("es-GT")].map(csvCell).join(","),
      ["Filtro aplicado", query.trim() || "Sin filtro"].map(csvCell).join(","),
      "",
      headers.map(csvCell).join(","),
      ...rows.map((row) => [row.date, row.user, row.module, row.action, row.detail, row.origin].map(csvCell).join(",")),
    ].join("\r\n");
    const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `auditoria-dentalcare-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
