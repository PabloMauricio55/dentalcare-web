"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Check, CheckCircle2, Eye, EyeOff, HeartPulse, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { PublicShell } from "@/modules/public-catalog/components/PublicShell";
import styles from "./ActivateAccount.module.css";

type ActivationStep = "verify" | "password" | "success";
type VerificationErrors = Partial<Record<"cui" | "temporaryPassword", string>>;
type PasswordErrors = Partial<Record<"password" | "confirmation", string>>;

const passwordRequirements = [
  { label: "Mínimo 8 caracteres", matches: (value: string) => value.length >= 8 },
  { label: "Una letra mayúscula", matches: (value: string) => /[A-Z]/.test(value) },
  { label: "Una letra minúscula", matches: (value: string) => /[a-z]/.test(value) },
  { label: "Un número", matches: (value: string) => /\d/.test(value) },
];

export function ActivateAccount() {
  const [step, setStep] = useState<ActivationStep>("verify");
  const [cui, setCui] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [verificationErrors, setVerificationErrors] = useState<VerificationErrors>({});
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const verifyAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: VerificationErrors = {};
    const normalizedCui = cui.replace(/\s/g, "");

    if (!/^\d{13}$/.test(normalizedCui)) nextErrors.cui = "Ingresa los 13 dígitos de tu DPI o CUI.";
    if (!temporaryPassword.trim()) nextErrors.temporaryPassword = "Ingresa la contraseña temporal entregada por la clínica.";

    setVerificationErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep("password");
  };

  const activateAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: PasswordErrors = {};
    if (!passwordRequirements.every((requirement) => requirement.matches(password))) nextErrors.password = "Crea una contraseña que cumpla todos los requisitos.";
    if (!confirmation) nextErrors.confirmation = "Confirma tu nueva contraseña.";
    else if (confirmation !== password) nextErrors.confirmation = "Las contraseñas no coinciden.";

    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep("success");
  };

  return (
    <PublicShell>
      <main className={styles.activationMain}>
        <section className={styles.activationLayout} aria-labelledby="activation-title">
          <aside className={styles.activationAside}>
            <Link className={styles.activationBrand} href="/"><span aria-hidden="true"><HeartPulse size={23} /></span>DentalCare</Link>
            <div className={styles.activationAsideCopy}>
              <span className={styles.activationEyebrow}><ShieldCheck size={15} aria-hidden="true" />Acceso seguro para pacientes</span>
              <h1>Tu salud, siempre a un paso.</h1>
              <p>Activa el acceso que la clínica creó para ti y consulta tu información dental de manera segura.</p>
            </div>
            <ul className={styles.activationBenefits}>
              <li><span><KeyRound size={19} aria-hidden="true" /></span><div><strong>Cuenta creada por la clínica</strong><p>No existe registro libre en línea.</p></div></li>
              <li><span><UserRound size={19} aria-hidden="true" /></span><div><strong>Acceso a tu información</strong><p>Gestiona tus próximas atenciones desde un mismo lugar.</p></div></li>
              <li><span><BadgeCheck size={19} aria-hidden="true" /></span><div><strong>Proceso guiado y privado</strong><p>Configura una contraseña personal para continuar.</p></div></li>
            </ul>
            <p className={styles.activationAsideNote}><LockKeyhole size={16} aria-hidden="true" />Tus datos se validan únicamente como una demostración visual.</p>
          </aside>

          <section className={styles.activationPanel}>
            <div className={styles.activationMobileBrand}><Link className={styles.activationBrand} href="/"><span aria-hidden="true"><HeartPulse size={21} /></span>DentalCare</Link></div>
            {step !== "success" && <ol className={styles.activationSteps} aria-label="Progreso de activación">
              <li className={step === "verify" ? styles.activationStepCurrent : styles.activationStepDone}><span>{step === "verify" ? "1" : <Check size={14} aria-hidden="true" />}</span><span>Verificar</span></li>
              <li className={step === "password" ? styles.activationStepCurrent : ""}><span>2</span><span>Contraseña</span></li>
              <li><span>3</span><span>Listo</span></li>
            </ol>}

            {step === "verify" && <form className={styles.activationForm} onSubmit={verifyAccount} noValidate>
              <div className={styles.activationFormHeading}><span><KeyRound size={26} aria-hidden="true" /></span><div><h2 id="activation-title">Activa tu cuenta</h2><p>Ingresa los datos que recibiste de la clínica para configurar tu acceso.</p></div></div>
              <p className={styles.activationNotice}><ShieldCheck size={18} aria-hidden="true" />Las cuentas de pacientes son creadas previamente por la clínica. No existe registro libre.</p>
              <label className={styles.activationField} htmlFor="activation-cui"><span>DPI o CUI <b>*</b></span><div className={verificationErrors.cui ? styles.activationInputError : ""}><UserRound size={19} aria-hidden="true" /><input id="activation-cui" name="cui" value={cui} onChange={(event) => { setCui(event.target.value.replace(/\D/g, "").slice(0, 13)); setVerificationErrors((current) => ({ ...current, cui: undefined })); }} inputMode="numeric" autoComplete="username" placeholder="Ingresa tus 13 dígitos" aria-invalid={Boolean(verificationErrors.cui)} aria-describedby={verificationErrors.cui ? "activation-cui-error" : undefined} /></div>{verificationErrors.cui && <small id="activation-cui-error" className={styles.activationError}>{verificationErrors.cui}</small>}</label>
              <label className={styles.activationField} htmlFor="activation-temporary-password"><span>Contraseña temporal <b>*</b></span><div className={verificationErrors.temporaryPassword ? styles.activationInputError : ""}><KeyRound size={19} aria-hidden="true" /><input id="activation-temporary-password" name="temporary-password" value={temporaryPassword} onChange={(event) => { setTemporaryPassword(event.target.value); setVerificationErrors((current) => ({ ...current, temporaryPassword: undefined })); }} type={showTemporaryPassword ? "text" : "password"} autoComplete="current-password" placeholder="Ingresa la contraseña temporal" aria-invalid={Boolean(verificationErrors.temporaryPassword)} aria-describedby={verificationErrors.temporaryPassword ? "activation-temporary-password-error" : undefined} /><PasswordToggle shown={showTemporaryPassword} onClick={() => setShowTemporaryPassword((shown) => !shown)} /></div>{verificationErrors.temporaryPassword && <small id="activation-temporary-password-error" className={styles.activationError}>{verificationErrors.temporaryPassword}</small>}</label>
              <button className={styles.activationSubmit} type="submit">Verificar mi cuenta</button>
              <p className={styles.activationHelp}>¿No encuentras tu contraseña temporal? <Link href="/contacto">Comunícate con la clínica</Link></p>
            </form>}

            {step === "password" && <form className={styles.activationForm} onSubmit={activateAccount} noValidate>
              <div className={styles.activationPatientFound}><span><CheckCircle2 size={24} aria-hidden="true" /></span><div><small>Paciente encontrado</small><strong>Brayan M.</strong><p>Tu cuenta está lista para activarse.</p></div></div>
              <div className={styles.activationFormHeading}><span><LockKeyhole size={26} aria-hidden="true" /></span><div><h2 id="activation-title">Crea tu contraseña</h2><p>Elige una contraseña segura para tus próximos ingresos.</p></div></div>
              <label className={styles.activationField} htmlFor="activation-new-password"><span>Nueva contraseña <b>*</b></span><div className={passwordErrors.password ? styles.activationInputError : ""}><LockKeyhole size={19} aria-hidden="true" /><input id="activation-new-password" name="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordErrors((current) => ({ ...current, password: undefined })); }} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Crea una contraseña" aria-invalid={Boolean(passwordErrors.password)} aria-describedby={passwordErrors.password ? "activation-password-error" : "activation-password-requirements"} /><PasswordToggle shown={showPassword} onClick={() => setShowPassword((shown) => !shown)} /></div>{passwordErrors.password && <small id="activation-password-error" className={styles.activationError}>{passwordErrors.password}</small>}</label>
              <ul id="activation-password-requirements" className={styles.activationRequirements} aria-label="Requisitos de contraseña">{passwordRequirements.map((requirement) => <li className={requirement.matches(password) ? styles.activationRequirementMet : ""} key={requirement.label}><Check size={14} aria-hidden="true" />{requirement.label}</li>)}</ul>
              <label className={styles.activationField} htmlFor="activation-confirm-password"><span>Confirma tu contraseña <b>*</b></span><div className={passwordErrors.confirmation ? styles.activationInputError : ""}><LockKeyhole size={19} aria-hidden="true" /><input id="activation-confirm-password" name="confirm-password" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setPasswordErrors((current) => ({ ...current, confirmation: undefined })); }} type={showConfirmation ? "text" : "password"} autoComplete="new-password" placeholder="Repite tu contraseña" aria-invalid={Boolean(passwordErrors.confirmation)} aria-describedby={passwordErrors.confirmation ? "activation-confirm-password-error" : undefined} /><PasswordToggle shown={showConfirmation} onClick={() => setShowConfirmation((shown) => !shown)} /></div>{passwordErrors.confirmation && <small id="activation-confirm-password-error" className={styles.activationError}>{passwordErrors.confirmation}</small>}</label>
              <button className={styles.activationSubmit} type="submit">Activar cuenta</button>
              <button className={styles.activationBack} type="button" onClick={() => setStep("verify")}>Volver a verificar datos</button>
            </form>}

            {step === "success" && <section className={styles.activationSuccess} aria-labelledby="activation-title"><span><CheckCircle2 size={52} aria-hidden="true" /></span><h2 id="activation-title">Cuenta activada correctamente</h2><p>Ya puedes iniciar sesión y acceder al portal del paciente.</p><div><Link className={styles.activationSubmit} href="/login">Iniciar sesión</Link><Link className={styles.activationSecondary} href="/"><ArrowLeft size={17} aria-hidden="true" />Volver al inicio</Link></div></section>}
            {step !== "success" && <p className={styles.activationLoginPrompt}>¿Ya activaste tu cuenta? <Link href="/login">Iniciar sesión</Link></p>}
          </section>
        </section>
      </main>
    </PublicShell>
  );
}

function PasswordToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return <button className={styles.activationVisibilityToggle} type="button" onClick={onClick} aria-label={shown ? "Ocultar contraseña" : "Mostrar contraseña"}>{shown ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button>;
}
