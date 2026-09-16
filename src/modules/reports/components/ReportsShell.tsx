import { ReportsFilterBar } from "./ReportsFilterBar";
import { ReportsProvider } from "./ReportsProvider";
import { ReportsTabs } from "./ReportsTabs";

export function ReportsShell({ children }: { children: React.ReactNode }) {
  return <ReportsProvider><div className="page-stack"><ReportsTabs /><ReportsFilterBar />{children}</div></ReportsProvider>;
}
