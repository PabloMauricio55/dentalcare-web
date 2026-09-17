import { ReportsFilterBar } from "./ReportsFilterBar";
import { ReportsProvider } from "./ReportsProvider";
import { ReportsTabs } from "./ReportsTabs";
import styles from "./reports.module.css";

export function ReportsShell({ children }: { children: React.ReactNode }) {
  return <ReportsProvider><div className={`page-stack ${styles.stack}`}><ReportsTabs /><ReportsFilterBar />{children}</div></ReportsProvider>;
}
