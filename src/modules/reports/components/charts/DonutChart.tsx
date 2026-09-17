import { colorAt } from "../../constants/report.constants";
import type { ResolvedPoint } from "../../models/report";
import styles from "../reports.module.css";

const radius = 46;
const circumference = 2 * Math.PI * radius;

export function DonutChart({ points, total, totalDisplay, label }: { points: ResolvedPoint[]; total: number; totalDisplay: string; label: string }) {
  if (!points.length || total <= 0) return <p className={styles.chartEmpty}>Sin datos para graficar en este período.</p>;
  const lengths = points.map((point) => (point.value / total) * circumference);
  const segments = points.map((point, index) => ({
    key: point.label,
    color: colorAt(index),
    length: lengths[index],
    offset: lengths.slice(0, index).reduce((sum, value) => sum + value, 0),
  }));

  return (
    <div className={styles.donutWrap}>
      <svg className={styles.donut} viewBox="0 0 120 120" role="img" aria-label={`${label}. ${points.map((point) => `${point.label}: ${point.percent} por ciento`).join(". ")}`}>
        <g transform="translate(60 60) rotate(-90)">
          <circle r={radius} fill="none" stroke="#eef4f4" strokeWidth="15" />
          {segments.map((segment) => (
            <circle key={segment.key} r={radius} fill="none" stroke={segment.color} strokeWidth="15" strokeDasharray={`${segment.length} ${circumference - segment.length}`} strokeDashoffset={-segment.offset} strokeLinecap="butt" />
          ))}
        </g>
        <text className={styles.donutTotal} x="60" y="59" textAnchor="middle">{totalDisplay}</text>
        <text className={styles.donutCaption} x="60" y="72" textAnchor="middle">Total</text>
      </svg>
      <ul className={styles.legend}>
        {points.map((point, index) => (
          <li className={styles.legendItem} key={point.label}>
            <span className={styles.swatch} style={{ background: colorAt(index) }} />
            <span className={styles.legendLabel} title={point.label}>{point.label}</span>
            <span className={styles.legendValue}>{point.percent} % · {point.display}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
