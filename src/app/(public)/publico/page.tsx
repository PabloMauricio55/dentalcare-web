import Link from "next/link";

export default function PublicPage() {
  return <main className="standalone-page"><div className="standalone-card"><span className="brand-pill">DentalCare</span><h1>Información de la clínica</h1><p>Ruta pública preparada para el equipo encargado del portal.</p><Link className="button button-primary" href="/login">Ingresar</Link></div></main>;
}
