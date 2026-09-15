import { Construction } from "lucide-react";
import { PageHeader } from "@/shared/components";
import styles from "./treatments.module.css";

export function PendingTreatmentView({ title }: { title: string }) {
  return <><PageHeader title={title} description="Esta sección continuará en la siguiente iteración del Issue #8." /><section className={`card ${styles.pending}`}><span><Construction size={24} /></span><h3>Vista preparada</h3><p>La navegación ya está disponible. Su flujo funcional se implementará en una próxima iteración.</p></section></>;
}
