"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, HeartPulse, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./PublicLogin.module.css";

type LoginErrors = Partial<Record<"cui" | "password", string>>;

export function PublicLogin() {
  const router = useRouter();
  const [cui, setCui] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: LoginErrors = {};

    if (!/^\d{13}$/.test(cui)) nextErrors.cui = "Ingresa los 13 dígitos de tu DPI o CUI.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) router.push("/portal");
  };

  return (
    <PublicShell>
      <main className={styles.loginMain}>
        <section className={styles.loginLayout} aria-labelledby="login-title">
          <aside className={styles.loginAside}>
            <span className={styles.loginEyebrow}><ShieldCheck size={16} aria-hidden="true" />Portal del paciente</span>
            <h1>Tu información dental, siempre contigo.</h1>
            <p>Accede de forma segura para consultar tus próximas atenciones y el seguimiento de tu salud bucal.</p>
            <ul>
              <li><span><LockKeyhole size={18} aria-hidden="true" /></span><div><strong>Acceso seguro</strong><p>Tu información está asociada a tu DPI o CUI.</p></div></li>
              <li><span><HeartPulse size={18} aria-hidden="true" /></span><div><strong>Atención conectada</strong><p>Consulta tu información desde un solo lugar.</p></div></li>
            </ul>
          </aside>

          <section className={styles.loginPanel}>
            <Link className={styles.loginBrand} href="/"><span aria-hidden="true"><HeartPulse size={21} /></span>DentalCare</Link>
            <div className={styles.loginHeading}>
              <h2 id="login-title">Iniciar sesión</h2>
              <p>Ingresa con los datos que registró la clínica para ti.</p>
            </div>
            <form className={styles.loginForm} onSubmit={submit} noValidate>
              <label className={styles.loginField} htmlFor="login-cui">
                <span>DPI o CUI <b>*</b></span>
                <div className={errors.cui ? styles.loginInputError : ""}><UserRound size={19} aria-hidden="true" /><input id="login-cui" name="cui" value={cui} onChange={(event) => { setCui(event.target.value.replace(/\D/g, "").slice(0, 13)); setErrors((current) => ({ ...current, cui: undefined })); }} inputMode="numeric" autoComplete="username" placeholder="Ingresa tus 13 dígitos" aria-invalid={Boolean(errors.cui)} aria-describedby={errors.cui ? "login-cui-error" : undefined} /></div>
                {errors.cui && <small id="login-cui-error" className={styles.loginError}>{errors.cui}</small>}
              </label>
              <label className={styles.loginField} htmlFor="login-password">
                <span>Contraseña <b>*</b></span>
                <div className={errors.password ? styles.loginInputError : ""}><KeyRound size={19} aria-hidden="true" /><input id="login-password" name="password" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Ingresa tu contraseña" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div>
                {errors.password && <small id="login-password-error" className={styles.loginError}>{errors.password}</small>}
              </label>
              <button className={styles.loginSubmit} type="submit">Ingresar al portal <ArrowRight size={18} aria-hidden="true" /></button>
            </form>
            <p className={styles.loginAssistance}>¿Olvidaste tu contraseña? <Link href="/contacto">Comunícate con la clínica</Link></p>
            <div className={styles.loginActivation}><span><KeyRound size={19} aria-hidden="true" /></span><div><strong>¿Aún no activaste tu cuenta?</strong><p>La clínica te proporciona una contraseña temporal para configurar tu acceso.</p><Link href="/activar-cuenta">Activar mi cuenta</Link></div></div>
            <p className={styles.loginNotice}><ShieldCheck size={16} aria-hidden="true" />Esta pantalla es una demostración visual; no guarda datos ni inicia una sesión real.</p>
          </section>
        </section>
      </main>
    </PublicShell>
  );
}
