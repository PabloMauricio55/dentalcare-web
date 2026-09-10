import { EmptyState, PageHeader } from "@/shared/components";

export function BillingPendingView({ title, description }: { title: string; description: string }) {
  return <><PageHeader title={title} description={description} /><section className="card"><EmptyState title="Vista en preparación" description="Esta pantalla del ticket #10 se implementa en los siguientes commits del módulo de caja." /></section></>;
}
