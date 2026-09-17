import type { Appointment } from "../models/appointment";

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export const appointmentExportService = {
  downloadCsv(rows: Appointment[], patientName: (patientId: string) => string, date: string) {
    const headers = ["Hora", "Paciente", "Motivo", "Duración (min)", "Profesional", "Estado", "Origen"];
    const content = [
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
    link.download = `jornada-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
