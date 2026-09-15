"use client";

import { Activity, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/shared/constants/navigation";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && <button className="sidebar-overlay" onClick={onClose} aria-label="Cerrar menú" />}
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><Activity size={23} /></span>
          <div><strong>DentalCare</strong><small>Gestión clínica</small></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X /></button>
        </div>
        <nav className="nav-groups">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link className={`nav-item ${active ? "active" : ""}`} href={item.href} key={item.href} onClick={onClose}>
                    <Icon size={19} /> <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="clinic-mini"><strong>Clínica Central</strong><span>Sede Guatemala</span></div>
          <Link href="/login"><LogOut size={18} /> Cerrar sesión</Link>
        </div>
      </aside>
    </>
  );
}
