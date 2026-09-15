import { InventoryShell } from "@/modules/inventory/components/InventoryShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <InventoryShell>{children}</InventoryShell>;
}
