import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "./PageHeader";

export function ModulePlaceholder({ title, description, issue }: { title: string; description: string; issue: string }) {
  return (
    <div className="page-stack">
      <PageHeader title={title} description={description} />
      <section className="card placeholder-card">
        <span className="placeholder-icon"><CheckCircle2 size={30} /></span>
        <h3>Ruta preparada</h3>
        <p>Este espacio ya utiliza el layout privado, la navegación y los estilos compartidos de DentalCare.</p>
        <span className="issue-chip">Módulo asignado a {issue}</span>
        <Link className="text-link" href="/componentes">Ver componentes compartidos <ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
