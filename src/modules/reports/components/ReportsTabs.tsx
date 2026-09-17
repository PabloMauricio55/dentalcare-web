"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["Resumen operativo", "/reportes/operativo"],
  ["Finanzas", "/reportes/finanzas"],
  ["Citas e inasistencias", "/reportes/citas"],
  ["Procedimientos", "/reportes/procedimientos"],
  ["Inventario y costos", "/reportes/inventario"],
  ["Esterilización", "/reportes/esterilizacion"],
  ["Rendimiento profesional", "/reportes/rendimiento"],
];

export function ReportsTabs() {
  const pathname = usePathname();
  return <nav className="section-tabs" aria-label="Secciones de reportes">{tabs.map(([label, href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>;
}
