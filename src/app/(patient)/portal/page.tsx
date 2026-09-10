import Link from "next/link";

export default function PatientPortalPage() {
  return <main className="standalone-page"><div className="standalone-card"><span className="brand-pill">Portal del paciente</span><h1>Hola, María</h1><p>Ruta preparada para citas, antecedentes, tratamientos y estado de cuenta.</p><Link className="button button-primary" href="/login">Cerrar sesión</Link></div></main>;
}
