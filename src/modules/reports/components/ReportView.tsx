"use client";

import { DataTable, EmptyState, PageHeader, StatCard, type Column } from "@/shared/components";
import type { ReportKey, ResolvedChart, ResolvedRow } from "../models/report";
import { BarChart } from "./charts/BarChart";
import { DonutChart } from "./charts/DonutChart";
import { LineChart } from "./charts/LineChart";
import { useReports } from "./ReportsProvider";
import styles from "./reports.module.css";

const tones = ["teal", "blue", "green", "amber"] as const;

function renderChart(chart: ResolvedChart) {
  if (chart.kind === "donut") return <DonutChart points={chart.points} total={chart.total} totalDisplay={chart.totalDisplay} label={chart.title} />;
  if (chart.kind === "line") return <LineChart points={chart.points} max={chart.max} label={chart.title} />;
  return <BarChart points={chart.points} max={chart.max} label={chart.title} />;
}

export function ReportView({ reportKey }: { reportKey: ReportKey }) {
  const { reportOf } = useReports();
  const report = reportOf(reportKey);

  if (!report) return <section className="card"><EmptyState title="Reporte no disponible" description="No encontramos datos simulados para este reporte." /></section>;

  const columns: Column<ResolvedRow>[] = [
    { key: "label", header: "Concepto", cell: (row) => <div className="cell-stack"><strong>{row.label}</strong><small>{row.detail}</small></div> },
    { key: "value", header: report.table.totalLabel.replace("Total de ", "").replace("Total ", ""), cell: (row) => <strong>{row.display}</strong> },
    { key: "share", header: "Participación", cell: (row) => `${row.share} %` },
  ];

  return <>
    <PageHeader title={report.title} description={`${report.description} · ${report.periodLabel}`} />

    <section className="stats-grid">
      {report.indicators.map((indicator, index) => <StatCard key={indicator.id} label={indicator.label} value={indicator.display} helper={indicator.helper} tone={tones[index % tones.length]} />)}
    </section>

    {report.charts.length > 0 && <section className={styles.chartGrid}>
      {report.charts.map((chart) => <article className="card" key={chart.id}>
        <div className="card-heading">
          <div><h3>{chart.title}</h3><p>{chart.description}</p></div>
          <div className={styles.chartTotal}><span className="stat-label">Total</span><strong>{chart.totalDisplay}</strong></div>
        </div>
        {renderChart(chart)}
      </article>)}
    </section>}

    <section className="card">
      <div className="card-heading">
        <div><h3>{report.table.title}</h3><p>{report.table.description}</p></div>
        <div><span className="stat-label">{report.table.totalLabel}</span><strong>{report.table.totalDisplay}</strong></div>
      </div>
      <DataTable columns={columns} rows={report.table.rows} emptyMessage="Sin datos para el período seleccionado." />
    </section>
  </>;
}
