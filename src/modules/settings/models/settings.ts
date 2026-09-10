export type StaffUser = { id: string; name: string; email: string; role: string; status: "Activo" | "Inactivo" | "Bloqueado"; lastAccess: string };
export type ClinicData = { name: string; nit: string; phone: string; email: string; address: string; city: string; schedule: string; receiptPrefix: string };
export type CatalogItem = { id: string; code: string; name: string; category: string; duration: number; price: number; status: "Activo" | "Inactivo" };
export type AuditEntry = { id: string; date: string; user: string; action: string; module: string; detail: string; origin: string };
export type PermissionKey = "view" | "create" | "edit" | "deactivate" | "validate" | "export";
export type RolePermission = { role: string; modules: Record<string, PermissionKey[]> };
