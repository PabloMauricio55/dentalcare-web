"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { CatalogItemDto, CreateUserDto } from "../dtos/settings.dto";
import type { AuditEntry, CatalogItem, ClinicData, PermissionKey, RolePermission, StaffUser } from "../models/settings";
import { initialCatalog, initialClinic, initialPermissions, initialUsers } from "../mocks/settings";
import { settingsService } from "../services/settings.service";
import { auditSessionService } from "../services/audit-session.service";

type MutationResult = { ok: true } | { ok: false; error: string };
type UserResult = { ok: true; password: string; user: StaffUser } | { ok: false; error: string };

type Value = {
  users: StaffUser[];
  catalog: CatalogItem[];
  clinic: ClinicData;
  permissions: RolePermission[];
  audit: AuditEntry[];
  addUser: (dto: CreateUserDto) => UserResult;
  updateUser: (user: StaffUser) => MutationResult;
  resetUserPassword: (id: string) => UserResult;
  toggleUser: (id: string) => void;
  setClinic: (data: ClinicData) => void;
  addCatalog: (dto: CatalogItemDto) => MutationResult;
  updateCatalog: (item: CatalogItem) => MutationResult;
  toggleCatalog: (id: string) => void;
  savePermissions: (role: string, modules: Record<string, PermissionKey[]>) => void;
};

const Context = createContext<Value | null>(null);
const normalize = (value: string) => value.trim().toLocaleLowerCase("es");
let sessionUsers = initialUsers;
let sessionCatalog = initialCatalog;
let sessionClinic = initialClinic;
let sessionPermissions = initialPermissions;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsersState] = useState(sessionUsers);
  const [catalog, setCatalogState] = useState(sessionCatalog);
  const [clinic, setClinicState] = useState(sessionClinic);
  const [permissions, setPermissionsState] = useState(sessionPermissions);
  const audit = useSyncExternalStore(auditSessionService.subscribe, auditSessionService.getSnapshot, auditSessionService.getServerSnapshot);

  const setUsers = (updater: (current: StaffUser[]) => StaffUser[]) => setUsersState((current) => {
    const next = updater(current);
    sessionUsers = next;
    return next;
  });
  const setCatalog = (updater: (current: CatalogItem[]) => CatalogItem[]) => setCatalogState((current) => {
    const next = updater(current);
    sessionCatalog = next;
    return next;
  });
  const setPermissions = (updater: (current: RolePermission[]) => RolePermission[]) => setPermissionsState((current) => {
    const next = updater(current);
    sessionPermissions = next;
    return next;
  });

  const record = (action: string, module: string, detail: string) => auditSessionService.record({
    user: "Daniel Sajche",
    action,
    module,
    detail,
  });

  const addUser = (dto: CreateUserDto): UserResult => {
    if (users.some((item) => normalize(item.email) === normalize(dto.email))) {
      return { ok: false, error: "Ya existe un usuario registrado con ese correo." };
    }
    const user = settingsService.createUser({ ...dto, email: dto.email.trim().toLowerCase() });
    const password = settingsService.temporaryPassword();
    setUsers((items) => [...items, user]);
    record("CREÓ USUARIO", "Configuración", `${user.name} · ${user.email} · ${user.role}`);
    return { ok: true, password, user };
  };

  const updateUser = (next: StaffUser): MutationResult => {
    if (users.some((item) => item.id !== next.id && normalize(item.email) === normalize(next.email))) {
      return { ok: false, error: "Ese correo ya pertenece a otro usuario." };
    }
    setUsers((items) => items.map((item) => item.id === next.id ? { ...next, email: next.email.trim().toLowerCase() } : item));
    record("ACTUALIZÓ USUARIO", "Configuración", `${next.name} · ${next.email} · ${next.role}`);
    return { ok: true };
  };

  const resetUserPassword = (id: string): UserResult => {
    const user = users.find((item) => item.id === id);
    if (!user) return { ok: false, error: "No se encontró el usuario seleccionado." };
    const password = settingsService.temporaryPassword();
    record("RESTABLECIÓ CONTRASEÑA", "Seguridad", `${user.name} · ${user.email}`);
    return { ok: true, password, user };
  };

  const toggleUser = (id: string) => {
    const user = users.find((item) => item.id === id);
    if (!user) return;
    const status = user.status === "Activo" ? "Inactivo" : "Activo";
    setUsers((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    record(status === "Activo" ? "ACTIVÓ USUARIO" : "DESACTIVÓ USUARIO", "Seguridad", `${user.name} · ${user.email}`);
  };

  const setClinic = (data: ClinicData) => {
    sessionClinic = data;
    setClinicState(data);
    record("ACTUALIZÓ DATOS DE CLÍNICA", "Configuración", `${data.name} · ${data.nit}`);
  };

  const validateCatalog = (dto: CatalogItemDto, excludeId?: string): string | null => {
    if (!dto.code.trim() || !dto.name.trim() || !dto.category.trim()) return "Completa código, nombre y categoría.";
    if (!Number.isFinite(dto.duration) || dto.duration < 5 || dto.duration > 480) return "La duración debe estar entre 5 y 480 minutos.";
    if (!Number.isFinite(dto.price) || dto.price <= 0) return "El precio debe ser mayor que cero.";
    if (catalog.some((item) => item.id !== excludeId && normalize(item.code) === normalize(dto.code))) return "Ya existe un procedimiento con ese código.";
    if (catalog.some((item) => item.id !== excludeId && normalize(item.name) === normalize(dto.name))) return "Ya existe un procedimiento con ese nombre.";
    return null;
  };

  const addCatalog = (dto: CatalogItemDto): MutationResult => {
    const error = validateCatalog(dto);
    if (error) return { ok: false, error };
    const item = settingsService.createCatalogItem({ ...dto, code: dto.code.trim().toUpperCase(), name: dto.name.trim(), category: dto.category.trim() });
    setCatalog((items) => [...items, item]);
    record("CREÓ PROCEDIMIENTO", "Catálogos", `${item.code} · ${item.name} · Q${item.price.toFixed(2)}`);
    return { ok: true };
  };

  const updateCatalog = (next: CatalogItem): MutationResult => {
    const error = validateCatalog(next, next.id);
    if (error) return { ok: false, error };
    const normalized = { ...next, code: next.code.trim().toUpperCase(), name: next.name.trim(), category: next.category.trim() };
    setCatalog((items) => items.map((item) => item.id === next.id ? normalized : item));
    record("ACTUALIZÓ PROCEDIMIENTO", "Catálogos", `${normalized.code} · ${normalized.name} · Q${normalized.price.toFixed(2)}`);
    return { ok: true };
  };

  const toggleCatalog = (id: string) => {
    const item = catalog.find((entry) => entry.id === id);
    if (!item) return;
    const status = item.status === "Activo" ? "Inactivo" : "Activo";
    setCatalog((items) => items.map((entry) => entry.id === id ? { ...entry, status } : entry));
    record(status === "Activo" ? "ACTIVÓ PROCEDIMIENTO" : "DESACTIVÓ PROCEDIMIENTO", "Catálogos", `${item.code} · ${item.name}`);
  };

  const savePermissions = (role: string, modules: Record<string, PermissionKey[]>) => {
    setPermissions((items) => items.map((item) => item.role === role ? { ...item, modules } : item));
    record("ACTUALIZÓ PERMISOS", "Roles y permisos", `Rol ${role} · matriz guardada`);
  };

  return <Context.Provider value={{
    users,
    catalog,
    clinic,
    permissions,
    audit,
    addUser,
    updateUser,
    resetUserPassword,
    toggleUser,
    setClinic,
    addCatalog,
    updateCatalog,
    toggleCatalog,
    savePermissions,
  }}>{children}</Context.Provider>;
}

export function useSettings() {
  const value = useContext(Context);
  if (!value) throw new Error("useSettings requiere SettingsProvider");
  return value;
}
