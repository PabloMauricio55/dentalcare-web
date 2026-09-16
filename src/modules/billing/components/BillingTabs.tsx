"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["Cuenta del paciente", "/caja/pagos"],
  ["Caja diaria", "/caja/diaria"],
  ["Devoluciones y anulaciones", "/caja/devoluciones"],
  ["Recibos", "/caja/recibos"],
];

export function BillingTabs() {
  const pathname = usePathname();
  return <nav className="section-tabs" aria-label="Secciones de caja">{tabs.map(([label, href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>;
}
