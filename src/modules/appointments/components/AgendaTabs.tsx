"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["Agenda general", "/agenda/general"],
  ["Solicitudes", "/agenda/solicitudes"],
  ["Pacientes", "/agenda/pacientes"],
  ["Sala de espera", "/agenda/sala-espera"],
  ["Atenciones programadas", "/agenda/atenciones"],
];

export function AgendaTabs() {
  const pathname = usePathname();
  return <nav className="section-tabs" aria-label="Secciones de agenda">{tabs.map(([label, href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>;
}
