"use client";

import { Bell, Menu, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp, roles } from "@/providers/AppProviders";
import { routeTitles } from "@/shared/constants/navigation";
import { Sidebar } from "@/shared/navigation/Sidebar";

export function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, sidebarOpen, setSidebarOpen } = useApp();
  const meta = routeTitles[pathname] ?? { title: "DentalCare", subtitle: "Gestión clínica" };

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-title">
            <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
              <Menu size={21} />
            </button>
            <div>
              <h1>{meta.title}</h1>
              <p>{meta.subtitle}</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="quick-search" aria-label="Buscar">
              <Search size={18} />
              <span>Búsqueda rápida</span>
              <kbd>Ctrl K</kbd>
            </button>
            <label className="role-picker">
              <span>Vista</span>
              <select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
                {roles.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button className="icon-button notification-button" aria-label="Notificaciones">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <div className="avatar" title="Daniel · Administrador"><UserRound size={19} /></div>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
