import type { ExportFormat, PeriodKey, ReportKey } from "../models/report";

export type ReportFilterDto = { period: PeriodKey };
export type ExportReportDto = { report: ReportKey; period: PeriodKey; format: ExportFormat };
