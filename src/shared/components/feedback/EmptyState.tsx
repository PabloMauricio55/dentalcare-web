import { Inbox } from "lucide-react";

export function EmptyState({ title = "Sin resultados", description = "No encontramos información para mostrar.", action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span><Inbox size={25} /></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
