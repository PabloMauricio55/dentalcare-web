"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
const tabs = [["Usuarios","/configuracion/usuarios"],["Roles y permisos","/configuracion/roles"],["Datos de la clínica","/configuracion/clinica"],["Catálogos y procedimientos","/configuracion/catalogos"],["Seguridad y auditoría","/configuracion/auditoria"]];
export function SettingsTabs() { const pathname = usePathname(); const { role } = useApp(); if (!roleAccess.canManageSettings(role)) return null; return <nav className="section-tabs" aria-label="Secciones de configuración">{tabs.map(([label,href]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>; }
