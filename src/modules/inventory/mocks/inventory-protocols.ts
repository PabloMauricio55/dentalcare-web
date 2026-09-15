import type { InventoryProtocol } from "@/modules/inventory/models/inventory.model";

export const initialInventoryProtocols: InventoryProtocol[] = [
  {
    id: "protocol-001",
    code: "PRT-001",
    name: "Recepción de consumibles",
    category: "receiving",
    responsible: "Encargado de inventario",
    description: "Verificar cantidades, estado del empaque y fechas de vencimiento al recibir consumibles.",
    active: true,
  },
  {
    id: "protocol-002",
    code: "PRT-002",
    name: "Control de vencimientos",
    category: "expiration_control",
    responsible: "Asistente administrativo",
    description: "Revisar periódicamente las fechas de vencimiento y separar los productos que ya no pueden utilizarse.",
    active: true,
  },
  {
    id: "protocol-003",
    code: "PRT-003",
    name: "Reposición de existencia baja",
    category: "replenishment",
    responsible: "Encargado de compras",
    description: "Preparar la reposición de consumibles que alcanzaron o descendieron de su existencia mínima.",
    active: true,
  },
  {
    id: "protocol-004",
    code: "PRT-004",
    name: "Almacenamiento de anestésicos",
    category: "storage",
    responsible: "Coordinador de clínica",
    description: "Conservar los anestésicos en el área designada y bajo las condiciones indicadas por el fabricante.",
    active: true,
  },
  {
    id: "protocol-005",
    code: "PRT-005",
    name: "Manejo de productos vencidos",
    category: "expiration_control",
    responsible: "Encargado de inventario",
    description: "Identificar, separar y registrar internamente los consumibles vencidos para evitar su utilización.",
    active: false,
  },
];
