import { SettingsProvider } from "./SettingsProvider";
import { SettingsTabs } from "./SettingsTabs";
export function SettingsShell({ children }: { children: React.ReactNode }) { return <SettingsProvider><div className="page-stack"><SettingsTabs />{children}</div></SettingsProvider>; }
