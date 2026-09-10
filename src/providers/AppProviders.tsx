"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Role = "Administrador" | "Secretaría" | "Odontólogo" | "Asistente" | "Caja";

type AppContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const roles: Role[] = ["Administrador", "Secretaría", "Odontólogo", "Asistente", "Caja"];

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === "undefined") return "Administrador";
    const stored = sessionStorage.getItem("dentalcare-role") as Role | null;
    return stored && roles.includes(stored) ? stored : "Administrador";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
    sessionStorage.setItem("dentalcare-role", nextRole);
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
