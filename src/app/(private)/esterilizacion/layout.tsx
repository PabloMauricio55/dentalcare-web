import { SterilizationShell } from '@/modules/sterilization/components/SterilizationShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SterilizationShell>{children}</SterilizationShell>;
}