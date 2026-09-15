import { PrivateLayout } from "@/shared/layouts/PrivateLayout";
import { ClinicSessionProvider } from "@/modules/appointments/components/ClinicSessionProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClinicSessionProvider><PrivateLayout>{children}</PrivateLayout></ClinicSessionProvider>;
}
