"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { appRoles, type AppRole } from "@/shared/constants/role-access";

type AppContextValue = {
  role: AppRole;
  setRole: (role: AppRole) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const roles = appRoles;

const roleListeners = new Set<() => void>();
const subscribeRole = (listener: () => void) => {
  roleListeners.add(listener);
  return () => roleListeners.delete(listener);
};
const getServerRole = (): AppRole => "Administrador";
const getStoredRole = (): AppRole => {
  const storedValue = sessionStorage.getItem("dentalcare-role");
  const stored = storedValue === "Caja" ? "Cajero" : storedValue as AppRole | null;
  return stored && roles.includes(stored) ? stored : "Administrador";
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribeRole, getStoredRole, getServerRole);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setRole = (nextRole: AppRole) => {
    sessionStorage.setItem("dentalcare-role", nextRole);
    roleListeners.forEach((listener) => listener());
  };

  const value = useMemo(
    () => ({ role, setRole, sidebarOpen, setSidebarOpen }),
    [role, sidebarOpen],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe utilizarse dentro de AppProviders");
  return context;
}
