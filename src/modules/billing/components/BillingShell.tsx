import { BillingPatientBar } from "./BillingPatientBar";
import { BillingProvider } from "./BillingProvider";
import { BillingTabs } from "./BillingTabs";
import styles from "./billing.module.css";

export function BillingShell({ children }: { children: React.ReactNode }) {
  return <BillingProvider><div className={`page-stack ${styles.stack}`}><BillingTabs /><BillingPatientBar />{children}</div></BillingProvider>;
}
