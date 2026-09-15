import type { Supplier } from "@/modules/inventory/models/inventory.model";

export const initialSuppliers: Supplier[] = [
  {
    id: "supplier-001",
    name: "Dental Supply Guatemala",
    contactName: "María López",
    phone: "+502 2458-1100",
    email: "ventas@dentalsupply.example",
    active: true,
  },
  {
    id: "supplier-002",
    name: "Insumos Médicos del Norte",
    contactName: "Carlos Méndez",
    phone: "+502 7764-2080",
    email: "pedidos@insumosnorte.example",
    active: true,
  },
  {
    id: "supplier-003",
    name: "Distribuidora Clínica Central",
    contactName: "Sofía Castillo",
    phone: "+502 2290-4455",
    email: "contacto@distribuidoracentral.example",
    active: false,
  },
];
