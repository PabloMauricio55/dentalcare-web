import { TreatmentsShell } from "@/modules/treatments/components/TreatmentsShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TreatmentsShell>{children}</TreatmentsShell>;
}
