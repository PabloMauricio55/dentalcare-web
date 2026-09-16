import { InventoryProvider } from "@/modules/inventory/components/InventoryProvider";
import { InventoryTabs } from "@/modules/inventory/components/InventoryTabs";
import styles from "./inventory.module.css";

export function InventoryShell({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <div className={`page-stack ${styles.shell}`}>
        <InventoryTabs />
        {children}
      </div>
    </InventoryProvider>
  );
}
