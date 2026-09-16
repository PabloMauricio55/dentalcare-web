import { SterilizationNavigation } from '@/modules/sterilization/components/SterilizationNavigation';
import { SterilizationProvider } from '@/modules/sterilization/components/SterilizationProvider';

export function SterilizationShell({ children }: { children: React.ReactNode }) {
  return <SterilizationProvider><div className="page-stack"><SterilizationNavigation />{children}</div></SterilizationProvider>;
}