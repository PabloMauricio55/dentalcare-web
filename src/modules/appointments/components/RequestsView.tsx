import { FileClock } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/components";

export function RequestsView() {
  return <>
    <PageHeader
      title="Solicitudes de citas"
      description="Esta sección se habilitará cuando dentalcare-api publique el contrato de solicitudes y propuestas de horario."
    />
    <section className="card">
      <EmptyState
        title="Funcionalidad pendiente de integración con backend"
        description="El contrato actual solo admite citas programadas, completadas y canceladas. Todavía no existen endpoints para solicitar, aceptar, rechazar o proponer horarios."
        action={<FileClock size={24} aria-hidden="true" />}
      />
    </section>
  </>;
}
