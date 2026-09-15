import type { AuditEntry, CatalogItem, ClinicData, RolePermission, StaffUser } from "../models/settings";

export const initialUsers: StaffUser[] = [
  { id: "u1", name: "Daniel Sajche", email: "daniel@dentalcare.gt", role: "Administrador", status: "Activo", lastAccess: "Hoy, 08:12" },
  { id: "u2", name: "Laura Ramírez", email: "laura@dentalcare.gt", role: "Secretaría", status: "Activo", lastAccess: "Hoy, 07:48" },
  { id: "u3", name: "Dra. Elena Castillo", email: "elena@dentalcare.gt", role: "Odontólogo", status: "Activo", lastAccess: "Hoy, 08:03" },
  { id: "u4", name: "Andrea Pérez", email: "andrea@dentalcare.gt", role: "Asistente", status: "Activo", lastAccess: "Ayer, 17:40" },
  { id: "u5", name: "Mario López", email: "caja@dentalcare.gt", role: "Cajero", status: "Bloqueado", lastAccess: "08 sep, 16:20" },
];

export const initialClinic: ClinicData = { name: "DentalCare Clínica Odontológica", nit: "548796-2", phone: "+502 2222-4500", email: "contacto@dentalcare.gt", address: "12 avenida 4-52, zona 10", city: "Ciudad de Guatemala", schedule: "Lun–Vie 08:00–18:00 · Sáb 08:00–13:00", receiptPrefix: "DC-" };

export const initialCatalog: CatalogItem[] = [
  { id: "s1", code: "PROC-001", name: "Evaluación odontológica", category: "Consulta", duration: 30, price: 150, status: "Activo" },
  { id: "s2", code: "PROC-014", name: "Restauración con resina", category: "Restauración", duration: 60, price: 475, status: "Activo" },
  { id: "s3", code: "PROC-022", name: "Extracción simple", category: "Cirugía", duration: 45, price: 650, status: "Activo" },
  { id: "s4", code: "PROC-030", name: "Profilaxis dental", category: "Prevención", duration: 45, price: 350, status: "Inactivo" },
];

export const initialPermissions: RolePermission[] = [
  { role: "Administrador", modules: { Agenda: ["view","create","edit","deactivate","export"], Expediente: ["view","create","edit","export"], Tratamientos: ["view","create","edit","export"], Caja: ["view","create","edit","export"], Inventario: ["view","create","edit","deactivate","export"], Configuración: ["view","create","edit","deactivate","export"] } },
  { role: "Secretaría", modules: { Agenda: ["view","create","edit"], Expediente: [], Tratamientos: ["view"], Caja: ["view"], Inventario: [], Configuración: [] } },
  { role: "Odontólogo", modules: { Agenda: ["view"], Expediente: ["view","create","edit","validate"], Tratamientos: ["view","create","edit","validate"], Caja: ["view"], Inventario: ["view"], Configuración: [] } },
  { role: "Asistente", modules: { Agenda: ["view","edit"], Expediente: ["view","create","edit"], Tratamientos: ["view","edit"], Caja: [], Inventario: ["view","edit"], Configuración: [] } },
  { role: "Cajero", modules: { Agenda: ["view"], Expediente: [], Tratamientos: ["view"], Caja: ["view","create","edit","export"], Inventario: [], Configuración: [] } },
];

export const initialAudit: AuditEntry[] = [
  { id: "a1", date: "2026-09-10 08:14", user: "Laura Ramírez", action: "CONFIRMÓ CITA", module: "Agenda", detail: "Cita C-1048 · Ana Lucía Pérez", origin: "192.168.0.18" },
  { id: "a2", date: "2026-09-10 08:10", user: "Daniel Sajche", action: "ACTUALIZÓ USUARIO", module: "Configuración", detail: "Asignó rol Cajero a Mario López", origin: "192.168.0.5" },
  { id: "a3", date: "2026-09-10 08:02", user: "Dra. Elena Castillo", action: "VALIDÓ ANTECEDENTES", module: "Expediente", detail: "Paciente PAC-00124", origin: "192.168.0.22" },
  { id: "a4", date: "2026-09-09 17:58", user: "Sistema", action: "BLOQUEÓ ACCESO", module: "Seguridad", detail: "5 intentos fallidos · Mario López", origin: "192.168.0.31" },
];
