import type { Appointment, AppointmentAuditEntry } from "../models/appointment";

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export const appointmentExportService = {
  downloadCsv(rows: Appointment[], patientName: (patientId: string) => string, filters: { date: string; professional: string }) {
    const headers = ["Hora", "Paciente", "Motivo", "Duración (min)", "Profesional", "Estado", "Origen"];
    const exportedAt = new Date().toLocaleString("es-GT");
    const content = [
      ["Fecha de exportación", exportedAt].map(csvCell).join(","),
      ["Filtros aplicados", `Fecha: ${filters.date}; Profesional: ${filters.professional}`].map(csvCell).join(","),
      "",
      headers.map(csvCell).join(","),
      ...rows.map((row) => [
        row.time,
        patientName(row.patientId),
        row.reason,
        row.duration,
        row.professional,
        row.status,
        row.source,
      ].map(csvCell).join(",")),
    ].join("\r\n");
    const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jornada-${filters.date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  downloadAuditCsv(rows: AppointmentAuditEntry[], patientName: (patientId: string) => string, filters: { status: string; professional: string }) {
    const headers = ["Fecha y hora", "Cita", "Paciente", "Acción", "Estado anterior", "Estado nuevo", "Detalle"];
    const content = [
      ["Fecha de exportación", new Date().toLocaleString("es-GT")].map(csvCell).join(","),
      ["Filtros aplicados", `Estado: ${filters.status}; Profesional: ${filters.professional}`].map(csvCell).join(","),
      "",
      headers.map(csvCell).join(","),
      ...rows.map((row) => [
        new Date(row.occurredAt).toLocaleString("es-GT"),
        row.appointmentId,
        patientName(row.patientId),
        row.action,
        row.fromStatus ?? "—",
        row.toStatus ?? "—",
        row.detail,
      ].map(csvCell).join(",")),
    ].join("\r\n");
    const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `auditoria-citas-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
