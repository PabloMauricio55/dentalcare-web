import { formatCurrency } from "@/shared/lib/currency";
import { periodLabel } from "../constants/report.constants";
import type { ChartSeries, Indicator, PeriodKey, ReportDefinition, ReportTable, ResolvedChart, ResolvedIndicator, ResolvedReport, ResolvedTable, ValueFormat } from "../models/report";

const round = (value: number) => Math.round(value * 100) / 100;

export const formatValue = (value: number, format: ValueFormat) => {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return `${round(value)} %`;
  if (format === "duration") return `${round(value)} min`;
  return new Intl.NumberFormat("es-GT").format(value);
};

const indicatorFrom = (indicator: Indicator, period: PeriodKey): ResolvedIndicator => ({ id: indicator.id, label: indicator.label, helper: indicator.helper, display: formatValue(indicator.values[period], indicator.format) });

const chartFrom = (chart: ChartSeries, period: PeriodKey): ResolvedChart => {
  const values = chart.points.map((point) => point.values[period]);
  const max = Math.max(...values, 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    id: chart.id,
    title: chart.title,
    description: chart.description,
    kind: chart.kind,
    max,
    points: chart.points.map((point) => ({ label: point.label, value: point.values[period], display: formatValue(point.values[period], chart.format), percent: total ? round((point.values[period] / total) * 100) : 0 })),
  };
};

const tableFrom = (table: ReportTable, period: PeriodKey): ResolvedTable => {
  const total = table.rows.reduce((sum, row) => sum + row.values[period], 0);
  return {
    title: table.title,
    description: table.description,
    totalLabel: table.totalLabel,
    total: round(total),
    totalDisplay: formatValue(round(total), table.unit),
    rows: table.rows.map((row) => ({ id: row.id, label: row.label, detail: row.detail, value: row.values[period], display: formatValue(row.values[period], table.unit), share: total ? round((row.values[period] / total) * 100) : 0 })),
  };
};

export function reportFromDefinition(definition: ReportDefinition, period: PeriodKey): ResolvedReport {
  return {
    key: definition.key,
    title: definition.title,
    description: definition.description,
    periodLabel: periodLabel(period),
    indicators: definition.indicators.map((indicator) => indicatorFrom(indicator, period)),
    charts: definition.charts.map((chart) => chartFrom(chart, period)),
    table: tableFrom(definition.table, period),
  };
}
