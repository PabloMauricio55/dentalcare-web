import { AgendaTabs } from "./AgendaTabs";

export function AgendaShell({ children }: { children: React.ReactNode }) {
  return <div className="page-stack"><AgendaTabs />{children}</div>;
}
