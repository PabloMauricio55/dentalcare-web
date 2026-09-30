import { ClockAlert } from "lucide-react";
import { EmptyState, PageHeader } from "@/shared/components";

export function WaitingRoomView() {
  return <>
    <PageHeader
      title="Sala de espera"
      description="Esta sección se habilitará cuando dentalcare-api publique el contrato del flujo de llegada y preparación."
    />
    <section className="card">
      <EmptyState
        title="Funcionalidad pendiente de integración con backend"
        description="El contrato actual no incluye llegada, tiempo de espera, preparación ni atención en curso. No se muestran datos simulados para evitar confundirlos con información clínica real."
        action={<ClockAlert size={24} aria-hidden="true" />}
      />
    </section>
  </>;
}
