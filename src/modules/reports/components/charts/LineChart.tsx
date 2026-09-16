import { colorAt } from "../../constants/report.constants";
import type { ResolvedPoint } from "../../models/report";
import styles from "../reports.module.css";

const width = 320;
const height = 140;
const padding = 12;

export function LineChart({ points, max, label }: { points: ResolvedPoint[]; max: number; label: string }) {
  if (points.length < 2 || max <= 0) return <p className={styles.chartEmpty}>Sin datos suficientes para graficar en este período.</p>;
  const stroke = colorAt(0);
  const step = (width - padding * 2) / (points.length - 1);
  const coords = points.map((point, index) => ({ x: padding + index * step, y: height - padding - (point.value / max) * (height - padding * 2) }));
  const line = coords.map((coord) => `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <div className={styles.lineWrap}>
      <svg className={styles.line} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}. ${points.map((point) => `${point.label}: ${point.display}`).join(". ")}`}>
        {[0, 0.5, 1].map((ratio) => <line key={ratio} x1={padding} x2={width - padding} y1={padding + ratio * (height - padding * 2)} y2={padding + ratio * (height - padding * 2)} stroke="#e6eeee" strokeWidth="1" />)}
        <polygon points={area} fill={stroke} opacity="0.12" />
        <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((coord, index) => <circle key={points[index].label} cx={coord.x} cy={coord.y} r="3.5" fill="white" stroke={stroke} strokeWidth="2.5" />)}
      </svg>
      <div className={styles.lineAxis}>{points.map((point) => <span key={point.label}>{point.label}</span>)}</div>
    </div>
  );
}
