"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { Button, Modal } from "@/shared/components";
import type { ExportPreview, ResolvedReport } from "../models/report";
import styles from "./reports.module.css";

const columns = ["A", "B", "C"];

export function ExportPreviewDialog({ preview, report, onClose }: { preview: ExportPreview | undefined; report: ResolvedReport; onClose: () => void }) {
  const isPdf = preview?.format === "PDF";
  return (
    <Modal
      open={!!preview}
      title={`Vista previa ${preview?.format ?? ""}`}
      description={preview?.fileName}
      onClose={onClose}
      footer={<Button onClick={onClose}>Cerrar</Button>}
    >
      {preview && <div className="detail-stack">
        <div className="info-grid">
          <div><span>Reporte</span><strong>{preview.title}</strong></div>
          <div><span>Período</span><strong>{preview.periodLabel}</strong></div>
          <div><span>Generado</span><strong>{preview.generatedAt}</strong></div>
          <div><span>Solicitado por</span><strong>{preview.generatedBy}</strong></div>
          <div><span>Filas</span><strong>{preview.rowCount}</strong></div>
          <div><span>{report.table.totalLabel}</span><strong>{preview.totalDisplay}</strong></div>
        </div>

        <div className={styles.sheet}>
          <div className={styles.sheetBar}>{isPdf ? <FileText size={14} /> : <FileSpreadsheet size={14} />}{preview.fileName}</div>
          <div className={styles.sheetBody}>
            {isPdf && <>
              <h4 className={styles.pdfTitle}>DentalCare · {report.title}</h4>
              <p className={styles.pdfMeta}>{report.description} · {preview.periodLabel} · generado el {preview.generatedAt}</p>
              <div className={styles.pdfIndicators}>
                {report.indicators.map((indicator) => <div className={styles.pdfIndicator} key={indicator.id}><span>{indicator.label}</span><strong>{indicator.display}</strong></div>)}
              </div>
            </>}
            <table className={styles.sheetTable}>
              {!isPdf && <thead className={styles.sheetColumns}><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>}
              <thead><tr><th>Concepto</th><th>Detalle</th><th>{report.table.totalLabel}</th></tr></thead>
              <tbody>
                {report.table.rows.map((row) => <tr key={row.id}><td>{row.label}</td><td>{row.detail}</td><td>{row.display}</td></tr>)}
                <tr className={styles.sheetTotal}><td>{report.table.totalLabel}</td><td>{report.table.rows.length} filas</td><td>{report.table.totalDisplay}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className={styles.sheetNote}>Vista previa simulada. La generación real del archivo requiere backend y queda pendiente de definición funcional, según docs/API-CONTRACTS.md.</p>
      </div>}
    </Modal>
  );
}
