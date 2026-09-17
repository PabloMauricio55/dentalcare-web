export type AppRole = "Administrador" | "Secretaría" | "Odontólogo" | "Asistente" | "Cajero";

export const appRoles: AppRole[] = ["Administrador", "Secretaría", "Odontólogo", "Asistente", "Cajero"];

const routeAccess: Record<AppRole, string[]> = {
  Administrador: ["/panel", "/agenda", "/expediente", "/tratamientos", "/caja", "/inventario", "/esterilizacion", "/reportes", "/configuracion", "/componentes"],
  Secretaría: ["/panel", "/agenda", "/tratamientos", "/caja"],
  Odontólogo: ["/panel", "/agenda", "/expediente", "/tratamientos", "/inventario", "/reportes"],
  Asistente: ["/panel", "/agenda", "/expediente", "/tratamientos", "/inventario", "/esterilizacion"],
  Cajero: ["/panel", "/agenda", "/tratamientos", "/caja", "/reportes"],
};

export const roleAccess = {
  canAccessRoute(role: AppRole, href: string) {
    return routeAccess[role].some((route) => href === route || href.startsWith(`${route}/`));
  },
  canManagePatients(role: AppRole) {
    return role === "Administrador" || role === "Secretaría";
  },
  canManageSettings(role: AppRole) {
    return role === "Administrador";
  },
};
