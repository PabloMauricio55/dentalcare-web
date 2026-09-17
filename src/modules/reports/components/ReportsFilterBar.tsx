"use client";

import { CalendarRange } from "lucide-react";
import { periodHelper, periods } from "../constants/report.constants";
import type { PeriodKey } from "../models/report";
import { useReports } from "./ReportsProvider";

export function ReportsFilterBar() {
  const { period, setPeriod } = useReports();
  return (
    <section className="card patient-search-card">
      <div className="waiting-person">
        <span className="patient-avatar"><CalendarRange size={18} /></span>
        <div><strong>Período analizado</strong><small>{periodHelper(period)}</small></div>
      </div>
      <label className="compact-field">
        <span>Período</span>
        <select value={period} onChange={(event) => setPeriod(event.target.value as PeriodKey)}>
          {periods.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </label>
    </section>
  );
}
