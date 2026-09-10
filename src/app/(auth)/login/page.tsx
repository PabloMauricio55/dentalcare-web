import Link from "next/link";

export default function LoginPage() {
  return <main className="standalone-page"><form className="standalone-card"><span className="brand-pill">DentalCare</span><h1>Iniciar sesión</h1><p>Acceso para personal y pacientes registrados.</p><label className="field"><span>Usuario</span><input placeholder="usuario@clinica.com" /></label><label className="field"><span>Contraseña</span><input type="password" placeholder="••••••••" /></label><Link className="button button-primary" href="/panel">Ingresar al sistema</Link></form></main>;
}
