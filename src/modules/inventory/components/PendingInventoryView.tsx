import { Clock3 } from "lucide-react";
import { PageHeader } from "@/shared/components";
import styles from "./inventory.module.css";

export function PendingInventoryView({ section }: { section: string }) {
  return (
    <>
      <PageHeader title={section} description="Esta sección forma parte del módulo de inventario." />
      <section className={`card ${styles.pending}`}>
        <span className={styles.pendingIcon}><Clock3 size={28} /></span>
        <h3>Disponible próximamente</h3>
        <p>La funcionalidad de esta sección se incorporará en una siguiente etapa del Issue #9.</p>
      </section>
    </>
  );
}
