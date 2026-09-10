"use client";

import { createContext, useContext, useState } from "react";
import type { CatalogItemDto, CreateUserDto } from "../dtos/settings.dto";
import type { AuditEntry, CatalogItem, ClinicData, RolePermission, StaffUser } from "../models/settings";
import { initialAudit, initialCatalog, initialClinic, initialPermissions, initialUsers } from "../mocks/settings";
import { settingsService } from "../services/settings.service";

type Value = { users: StaffUser[]; catalog: CatalogItem[]; clinic: ClinicData; permissions: RolePermission[]; audit: AuditEntry[]; addUser: (dto: CreateUserDto) => string; updateUser: (user: StaffUser) => void; toggleUser: (id: string) => void; setClinic: (data: ClinicData) => void; addCatalog: (dto: CatalogItemDto) => void; updateCatalog: (item: CatalogItem) => void; toggleCatalog: (id: string) => void; togglePermission: (role: string, module: string, permission: string) => void };
const Context = createContext<Value | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [users,setUsers] = useState(initialUsers); const [catalog,setCatalog] = useState(initialCatalog); const [clinic,setClinic] = useState(initialClinic); const [permissions,setPermissions] = useState(initialPermissions); const [audit] = useState(initialAudit);
  const addUser = (dto: CreateUserDto) => { setUsers((items) => [...items,settingsService.createUser(dto)]); return settingsService.temporaryPassword(); };
  const updateUser = (next: StaffUser) => setUsers((items) => items.map((item) => item.id === next.id ? next : item));
  const toggleUser = (id: string) => setUsers((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "Activo" ? "Inactivo" : "Activo" } : item));
  const addCatalog = (dto: CatalogItemDto) => setCatalog((items) => [...items,settingsService.createCatalogItem(dto)]);
  const updateCatalog = (next: CatalogItem) => setCatalog((items) => items.map((item) => item.id === next.id ? next : item));
  const toggleCatalog = (id: string) => setCatalog((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "Activo" ? "Inactivo" : "Activo" } : item));
  const togglePermission = (role: string, module: string, permission: string) => setPermissions((items) => items.map((item) => { if (item.role !== role) return item; const current = item.modules[module] ?? []; const next = current.includes(permission as never) ? current.filter((value) => value !== permission) : [...current,permission as never]; return { ...item, modules: { ...item.modules, [module]: next } }; }));
  return <Context.Provider value={{ users,catalog,clinic,permissions,audit,addUser,updateUser,toggleUser,setClinic,addCatalog,updateCatalog,toggleCatalog,togglePermission }}>{children}</Context.Provider>;
}
export function useSettings() { const value = useContext(Context); if (!value) throw new Error("useSettings requiere SettingsProvider"); return value; }
