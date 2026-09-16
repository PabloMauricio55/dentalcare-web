import type { ExportReportDto, ReportFilterDto } from "../dtos/report.dto";
import type { ExportPreview, ReportDefinition, ReportKey, ResolvedReport } from "../models/report";
import { periodLabel } from "../constants/report.constants";
import { reportFromDefinition } from "../adapters/report.adapter";
import { reportDefinitions } from "../mocks/reports";

const slug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const stamp = () => { const value = new Date(); const pad = (part: number) => String(part).padStart(2, "0"); return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`; };

export const reportService = {
  definitions: (): ReportDefinition[] => reportDefinitions,
  definitionOf: (key: ReportKey) => reportDefinitions.find((item) => item.key === key),
  resolve(key: ReportKey, filter: ReportFilterDto): ResolvedReport | undefined {
    const definition = reportDefinitions.find((item) => item.key === key);
    return definition ? reportFromDefinition(definition, filter.period) : undefined;
  },
  exportPreview(dto: ExportReportDto, report: ResolvedReport, generatedBy: string): ExportPreview {
    return {
      format: dto.format,
      fileName: `${slug(report.title)}-${dto.period}.${dto.format === "PDF" ? "pdf" : "xlsx"}`,
      title: report.title,
      periodLabel: periodLabel(dto.period),
      generatedAt: stamp(),
      generatedBy,
      rowCount: report.table.rows.length,
      totalDisplay: report.table.totalDisplay,
    };
  },
};
