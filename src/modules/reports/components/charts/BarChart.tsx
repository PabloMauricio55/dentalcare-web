import { colorAt } from "../../constants/report.constants";
import type { ResolvedPoint } from "../../models/report";
import styles from "../reports.module.css";

export function BarChart({ points, max, label }: { points: ResolvedPoint[]; max: number; label: string }) {
  if (!points.length || max <= 0) return <p className={styles.chartEmpty}>Sin datos para graficar en este período.</p>;
  return (
    <div className={styles.bars} role="img" aria-label={`${label}. ${points.map((point) => `${point.label}: ${point.display}`).join(". ")}`}>
      {points.map((point, index) => (
        <div className={styles.barRow} key={point.label}>
          <span className={styles.barLabel} title={point.label}>{point.label}</span>
          <span className={styles.barTrack}>
            <span className={styles.barFill} style={{ background: colorAt(index), width: point.value > 0 ? `${Math.max(3, (point.value / max) * 100)}%` : "0%" }} />
          </span>
          <span className={styles.barValue}>{point.display}</span>
        </div>
      ))}
    </div>
  );
}
