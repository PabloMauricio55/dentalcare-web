import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: string | number;
  helper?: string;
  icon?: LucideIcon;
  tone?: "teal" | "blue" | "green" | "amber";
}) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div><span className="stat-label">{label}</span><strong>{value}</strong>{helper && <small>{helper}</small>}</div>
      {Icon && <span className="stat-icon"><Icon size={22} /></span>}
    </article>
  );
}
