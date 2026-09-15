"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["Resumen", "/inventario"],
  ["Consumibles", "/inventario/consumibles"],
  ["Instrumental", "/inventario/instrumental"],
  ["Protocolos", "/inventario/protocolos"],
  ["Movimientos", "/inventario/movimientos"],
  ["Compras y proveedores", "/inventario/compras"],
  ["Alertas", "/inventario/alertas"],
] as const;

export function InventoryTabs() {
  const pathname = usePathname();

  return (
    <nav className="section-tabs" aria-label="Secciones de inventario">
      {tabs.map(([label, href]) => (
        <Link className={pathname === href ? "active" : ""} href={href} key={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
