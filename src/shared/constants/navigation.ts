import {
  CalendarDays,
  ClipboardList,
  FileHeart,
  LayoutDashboard,
  PackageOpen,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export const navigation = [
  {
    label: "Principal",
    items: [{ label: "Panel de inicio", href: "/panel", icon: LayoutDashboard }],
  },
  {
    label: "Atención",
    items: [
      { label: "Agenda y pacientes", href: "/agenda", icon: CalendarDays },
      { label: "Expediente clínico", href: "/expediente", icon: FileHeart },
      { label: "Tratamientos", href: "/tratamientos", icon: Stethoscope },
    ],
  },
  {
    label: "Administración",
    items: [
      { label: "Caja y pagos", href: "/caja", icon: ReceiptText },
      { label: "Inventario", href: "/inventario", icon: PackageOpen },
      { label: "Esterilización", href: "/esterilizacion", icon: Sparkles },
      { label: "Reportes", href: "/reportes", icon: ClipboardList },
      { label: "Configuración", href: "/configuracion", icon: Settings },
      { label: "Componentes", href: "/componentes", icon: ShieldCheck },
    ],
  },
];

export const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/panel": { title: "Panel de inicio", subtitle: "Resumen de la operación de hoy" },
  "/agenda": { title: "Agenda y pacientes", subtitle: "Organiza citas y flujo de atención" },
  "/expediente": { title: "Expediente clínico", subtitle: "Historia y evaluación del paciente" },
  "/tratamientos": { title: "Tratamientos", subtitle: "Planes, procedimientos e indicaciones" },
  "/caja": { title: "Caja y pagos", subtitle: "Cargos, pagos y estado de cuenta" },
  "/inventario": { title: "Inventario", subtitle: "Consumibles, instrumental y movimientos" },
  "/esterilizacion": { title: "Esterilización", subtitle: "Cargas y trazabilidad instrumental" },
  "/reportes": { title: "Reportes", subtitle: "Indicadores clínicos y administrativos" },
  "/configuracion": { title: "Configuración", subtitle: "Usuarios, permisos y catálogos" },
  "/componentes": { title: "Componentes compartidos", subtitle: "Referencia visual para el equipo" },
};
