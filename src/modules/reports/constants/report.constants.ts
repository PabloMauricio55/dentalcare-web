import type { PeriodKey } from "../models/report";

export const periods: Array<{ key: PeriodKey; label: string; helper: string }> = [
  { key: "hoy", label: "Hoy", helper: "16 de septiembre de 2026" },
  { key: "semana", label: "Esta semana", helper: "14 al 20 de septiembre" },
  { key: "mes", label: "Este mes", helper: "Septiembre 2026" },
  { key: "trimestre", label: "Trimestre", helper: "Julio a septiembre 2026" },
];

export const periodLabel = (period: PeriodKey) => periods.find((item) => item.key === period)?.label ?? "Hoy";
export const periodHelper = (period: PeriodKey) => periods.find((item) => item.key === period)?.helper ?? "";
