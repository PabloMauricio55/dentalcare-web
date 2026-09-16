'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  ['Panel', '/esterilizacion'],
  ['Nueva carga', '/esterilizacion/nueva-carga'],
  ['Historial de cargas', '/esterilizacion/historial'],
  ['Trazabilidad', '/esterilizacion/trazabilidad'],
];

export function SterilizationNavigation() {
  const pathname = usePathname();
  return <nav className="section-tabs" aria-label="Secciones de esterilización">{tabs.map(([label, href]) => <Link className={pathname === href ? 'active' : ''} href={href} key={href}>{label}</Link>)}</nav>;
}