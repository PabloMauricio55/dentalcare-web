"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["Planes de tratamiento", "/tratamientos/planes"],
  ["Presupuesto", "/tratamientos/presupuesto"],
  ["Consentimientos", "/tratamientos/consentimientos"],
  ["Registrar procedimiento", "/tratamientos/procedimiento"],
  ["Finalizar y materiales", "/tratamientos/finalizar"],
  ["Indicaciones y receta", "/tratamientos/receta"],
];

export function TreatmentsTabs() {
  const pathname = usePathname();
  return <nav className="section-tabs" aria-label="Secciones de tratamientos">{tabs.map(([label, href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>;
}
