import { TreatmentPlansProvider } from "@/modules/treatments/components/TreatmentPlansProvider";
import { TreatmentsTabs } from "@/modules/treatments/components/TreatmentsTabs";
import styles from "./treatments.module.css";

export function TreatmentsShell({ children }: { children: React.ReactNode }) {
  return <TreatmentPlansProvider><div className={`page-stack ${styles.shell}`}><TreatmentsTabs />{children}</div></TreatmentPlansProvider>;
}
