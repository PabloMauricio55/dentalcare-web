export type PeriodKey = "hoy" | "semana" | "mes" | "trimestre";
export type PeriodValues = Record<PeriodKey, number>;
export type ValueFormat = "currency" | "number" | "percent" | "duration";
export type ChartKind = "bar" | "donut" | "line";
export type ReportKey = "operativo" | "finanzas" | "citas" | "procedimientos" | "inventario" | "esterilizacion" | "rendimiento";

export type Indicator = { id: string; label: string; helper: string; format: ValueFormat; values: PeriodValues };
export type SeriesPoint = { label: string; values: PeriodValues };
export type ChartSeries = { id: string; title: string; description: string; kind: ChartKind; format: ValueFormat; points: SeriesPoint[] };
export type ReportRow = { id: string; label: string; detail: string; values: PeriodValues };
export type ReportTable = { title: string; description: string; unit: ValueFormat; totalLabel: string; rows: ReportRow[] };
export type ReportDefinition = { key: ReportKey; title: string; description: string; indicators: Indicator[]; charts: ChartSeries[]; table: ReportTable };

export type ResolvedIndicator = { id: string; label: string; helper: string; display: string };
export type ResolvedPoint = { label: string; value: number; display: string; percent: number };
export type ResolvedChart = { id: string; title: string; description: string; kind: ChartKind; points: ResolvedPoint[]; max: number; total: number; totalDisplay: string };
export type ResolvedRow = { id: string; label: string; detail: string; value: number; display: string; share: number };
export type ResolvedTable = { title: string; description: string; totalLabel: string; rows: ResolvedRow[]; total: number; totalDisplay: string };
export type ResolvedReport = { key: ReportKey; title: string; description: string; periodLabel: string; indicators: ResolvedIndicator[]; charts: ResolvedChart[]; table: ResolvedTable };

export type ExportFormat = "PDF" | "Excel";
export type ExportPreview = { format: ExportFormat; fileName: string; title: string; periodLabel: string; generatedAt: string; generatedBy: string; rowCount: number; totalDisplay: string };
