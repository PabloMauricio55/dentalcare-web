import { BillingPatientBar } from "./BillingPatientBar";
import { BillingProvider } from "./BillingProvider";
import { BillingTabs } from "./BillingTabs";

export function BillingShell({ children }: { children: React.ReactNode }) {
  return <BillingProvider><div className="page-stack"><BillingTabs /><BillingPatientBar />{children}</div></BillingProvider>;
}
