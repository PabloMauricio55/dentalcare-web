import { ShieldAlert } from "lucide-react";
import type { AppRole } from "@/shared/constants/role-access";

export function RoleAccessNotice({ role, children }: { role: AppRole; children: React.ReactNode }) {
  return (
    <section className="role-access-notice" role="status">
      <span><ShieldAlert size={21} /></span>
      <div>
        <strong>Vista de {role}</strong>
        <p>{children}</p>
      </div>
    </section>
  );
}
