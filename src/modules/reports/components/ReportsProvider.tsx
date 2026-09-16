"use client";

import { createContext, useContext, useState } from "react";
import type { ExportFormat, ExportPreview, PeriodKey, ReportKey, ResolvedReport } from "../models/report";
import { reportService } from "../services/report.service";

const analyst = "Daniel Sajche";

type Value = {
  period: PeriodKey;
  setPeriod: (period: PeriodKey) => void;
  reportOf: (key: ReportKey) => ResolvedReport | undefined;
  exportPreviewOf: (key: ReportKey, format: ExportFormat) => ExportPreview | undefined;
};

const Context = createContext<Value | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<PeriodKey>("mes");
  const reportOf = (key: ReportKey) => reportService.resolve(key, { period });
  const exportPreviewOf = (key: ReportKey, format: ExportFormat) => {
    const report = reportOf(key);
    return report ? reportService.exportPreview({ report: key, period, format }, report, analyst) : undefined;
  };
  return <Context.Provider value={{ period, setPeriod, reportOf, exportPreviewOf }}>{children}</Context.Provider>;
}

export function useReports() {
  const value = useContext(Context);
  if (!value) throw new Error("useReports debe utilizarse dentro de ReportsProvider");
  return value;
}
