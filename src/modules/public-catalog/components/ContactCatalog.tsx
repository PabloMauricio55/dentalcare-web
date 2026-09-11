"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, BadgeCheck, CheckCircle2, ChevronDown, CircleAlert, Clock3, HelpCircle, Home, Info, KeyRound, LogIn, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type ContactForm = { name: string; email: string; phone: string; reason: string; message: string; consent: boolean };
type FormErrors = Partial<Record<keyof ContactForm, string>>;

const initialForm: ContactForm = { name: "", email: "", phone: "", reason: "", message: "", consent: false };
const heroImage = "https://lh3.googleusercontent.com/aida/AEtjO1Wfv8KXW-psF8autX_iBVUnTZHTxV0sOp-vlE7263gves8EolexEt8d4lKXMCpBscYmk8JQNa7ta2NGnUnUMpOi5J-GfRuRbi1lczDn_U0A0xNXO_AQ2W_ugCxP2ndBb4JKfaiTiF-DHek15JkjPQ13ClLfQeOX1OjO8o1CjO2MjKLyw7Ihcwywc4n7r80PBwlK-3NU750IaVH2x4B3Hv_pSllr_DeacN7XrN7JNxjS1_5P3tN6uafWfZI";

const faqs = [
  { question: "¿Cómo activo mi cuenta?", answer: "La clínica crea la cuenta del paciente de manera presencial o tras tu primera atención y te entrega un código de activación único o usuario para configurar tu contraseña de forma segura." },
  { question: "¿Necesito iniciar sesión para solicitar una cita?", answer: "Sí, la solicitud de citas está reservada a pacientes registrados con sesión activa para proteger la disponibilidad médica y vincular tu expediente clínico." },
  { question: "¿Cuándo queda confirmada una cita?", answer: "Una solicitud enviada no significa que la cita esté confirmada automáticamente. El equipo de recepción revisa la agenda y se comunica contigo para la confirmación formal del horario." },
  { question: "¿Cómo informo una emergencia?", answer: "Las emergencias no deben enviarse por formulario ni solicitud de citas web. Llama directamente a nuestra línea de atención telefónica (+502 2222 0000) para una atención prioritaria." },
  { question: "¿Cómo puedo contactar una sucursal específica?", answer: "Puedes consultar las direcciones, teléfonos directos y canales de WhatsApp de cada sede en nuestra sección de Sucursales." },
];

export function ContactCatalog() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const setField = <K extends keyof ContactForm>(field: K, value: ContactForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Ingresa tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Ingresa un correo válido";
    if (!form.reason) nextErrors.reason = "Selecciona un motivo";
    if (!form.message.trim()) nextErrors.message = "Escribe tu mensaje";
    if (!form.consent) nextErrors.consent = "Debes aceptar el uso de tus datos";
    return nextErrors;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  };
  const restart = () => { setForm(initialForm); setErrors({}); setSubmitted(false); };

  return <PublicShell><main className={styles.contactMain}>
    <section className={styles.contactHero}><div className={styles.contactHeroCopy}>
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/"><Home size={16} />Inicio</Link><span aria-hidden="true">/</span><strong>Contacto</strong></nav>
      <span className={styles.eyebrow}><i />Estamos para ayudarte</span><h1>Contacta a <em>DentalCare</em></h1><p>Comunícate con nuestro equipo para resolver consultas generales, conocer nuestros servicios o recibir ayuda con el acceso y las solicitudes de citas médicas.</p>
      <div className={styles.contactHeroTags}><span><BadgeCheck size={20} />Sede Central Zona 10</span><span><Clock3 size={20} />Atención activa hoy</span></div>
    </div><div className={styles.contactHeroImage} style={{ backgroundImage: `url(${heroImage})` }} role="img" aria-label="Consultorio odontológico moderno de DentalCare"><div><span><MessageCircle size={22} /></span><p><small>Compromiso clínico</small>Atención y soporte continuo a pacientes</p></div></div></section>
    <section className={styles.contactChannels} aria-label="Medios de contacto"><ContactChannel icon={<Phone size={26} />} title="Teléfono" subtitle="Recepción y citas médicas" value="+502 2222 0000" href="tel:+50222220000" action="Llamar" /><ContactChannel icon={<MessageCircle size={26} />} title="WhatsApp" subtitle="Asistente y consultas rápidas" value="+502 5555 0000" href="https://wa.me/50255550000" action="Abrir WhatsApp" primary external /><ContactChannel icon={<Mail size={26} />} title="Correo electrónico" subtitle="Consultas administrativas" value="contacto@dentalcare.com" href="mailto:contacto@dentalcare.com" action="Enviar correo" /><article className={styles.contactChannel}><div><div className={styles.contactChannelIcon}><Clock3 size={26} /></div><span className={styles.openStatus}><i />Abierto</span><h2>Horarios de atención</h2><p>Atención en clínica</p><strong className={styles.hours}><b>Lun a Vie:</b> 8:00 a. m. – 6:00 p. m.<br /><b>Sábado:</b> 8:00 a. m. – 12:00 p. m.</strong></div><small><Info size={16} />Domingos cerrado</small></article></section>
    <section className={styles.contactMessageSection}><aside className={styles.contactInformation}><div><h2>Envíanos un mensaje</h2><p>Utiliza este formulario únicamente para consultas generales y requerimientos informativos.</p></div><div className={styles.responseNotice}><Clock3 size={24} /><p><strong>Tiempo estimado de atención</strong>Responderemos dentro de nuestro horario de atención habitual, generalmente en menos de 24 horas hábiles.</p></div><a className={styles.faqJump} href="#preguntas-frecuentes"><HelpCircle size={18} />Ver preguntas frecuentes antes de escribir<ArrowDown size={16} /></a><div className={styles.emergencyNotice}><div><CircleAlert size={28} /><h3>¿Necesitas atención urgente?</h3></div><p>Para una emergencia dental —dolor agudo, traumatismo o sangrado activo— comunícate directamente por teléfono con la clínica.</p><strong>No utilices el formulario de contacto ni la solicitud de citas para una emergencia.</strong><div><a href="tel:+50222220000"><Phone size={18} />Llamar ahora (+502 2222 0000)</a><Link href="/emergencias">Ver emergencias</Link></div></div></aside>
      <section className={styles.contactFormCard} aria-label="Formulario de contacto">{submitted ? <SuccessPanel onRestart={restart} /> : <form onSubmit={submit} noValidate><ContactInput label="Nombre completo" value={form.name} error={errors.name} onChange={(value) => setField("name", value)} placeholder="Ingresa tu nombre y apellido" /><ContactInput label="Correo electrónico" value={form.email} error={errors.email} onChange={(value) => setField("email", value)} placeholder="ejemplo@correo.com" type="email" /><label className={styles.contactField}><span>Número de teléfono</span><div className={styles.phoneField}><b>🇬🇹 +502</b><input value={form.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="5555 1234" type="tel" /></div></label><label className={styles.contactField}><span>Motivo del mensaje <i>*</i></span><div className={styles.contactSelect}><select value={form.reason} onChange={(event) => setField("reason", event.target.value)} aria-invalid={Boolean(errors.reason)}><option value="">Selecciona un motivo</option><option value="general">Información general</option><option value="servicios">Consulta sobre servicios</option><option value="odontologos">Consulta sobre odontólogos</option><option value="sucursales">Consulta sobre sucursales</option><option value="cita">Ayuda con una solicitud de cita</option><option value="activar">Ayuda para activar mi cuenta</option><option value="otro">Otro</option></select><ChevronDown size={20} /></div>{errors.reason && <small className={styles.fieldError}>{errors.reason}</small>}</label><label className={styles.contactField}><span>Mensaje <i>*</i><small>{form.message.length}/500</small></span><textarea value={form.message} onChange={(event) => setField("message", event.target.value)} placeholder="Escribe tu consulta detalladamente..." maxLength={500} rows={5} aria-invalid={Boolean(errors.message)} />{errors.message && <small className={styles.fieldError}>{errors.message}</small>}</label><label className={styles.consentField}><input type="checkbox" checked={form.consent} onChange={(event) => setField("consent", event.target.checked)} /><span>Acepto el uso de mis datos para responder esta consulta de conformidad con el <a href="#privacidad">Aviso de privacidad</a>.</span></label>{errors.consent && <small className={styles.fieldError}>{errors.consent}</small>}<button className={styles.contactSubmit} type="submit"><Send size={20} />Enviar mensaje</button><p className={styles.contactDisclaimer}>Este formulario no está destinado a emergencias médicas o dentales.</p></form>}</section>
    </section>
    <section className={styles.accountHelp}><span><KeyRound size={30} /></span><div><small>Portal del paciente</small><h2>¿Necesitas ayuda con tu cuenta?</h2><p>Si la clínica ya creó tu cuenta, utiliza el código o usuario recibido para activar tu acceso digital y consultar tu historial.</p><strong><KeyRound size={16} />Por tu seguridad, no hay registro libre en línea: la cuenta se emite exclusivamente en clínica.</strong></div><div><Link className={styles.catalogRequestButton} href="/activar-cuenta">Activar mi cuenta</Link><Link href="/login"><LogIn size={18} />Iniciar sesión</Link></div></section>
    <section className={styles.faqSection} id="preguntas-frecuentes"><div className={styles.faqHeading}><span>Resolución rápida</span><h2>Preguntas frecuentes</h2><p>Encuentra respuestas inmediatas a las consultas más usuales sobre citas, accesos y atención médica.</p></div><div className={styles.faqList}>{faqs.map((item, index) => <article key={item.question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq((current) => current === index ? null : index)}><span><i>{index + 1}</i>{item.question}</span><ChevronDown size={21} /></button>{openFaq === index && <p>{item.answer}{index === 4 && <> <Link href="/sucursales">Ver sucursales.</Link></>}</p>}</article>)}</div></section>
  </main></PublicShell>;
}

function ContactChannel({ icon, title, subtitle, value, href, action, primary = false, external = false }: { icon: ReactNode; title: string; subtitle: string; value: string; href: string; action: string; primary?: boolean; external?: boolean }) {
  return <article className={styles.contactChannel}><div><span className={styles.contactChannelIcon}>{icon}</span><h2>{title}</h2><p>{subtitle}</p><strong>{value}</strong></div><a className={primary ? styles.catalogRequestButton : ""} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{primary && <Send size={18} />}{action}</a></article>;
}

function ContactInput({ label, value, error, onChange, placeholder, type = "text" }: { label: string; value: string; error?: string; onChange: (value: string) => void; placeholder: string; type?: "text" | "email" }) {
  return <label className={styles.contactField}><span>{label} <i>*</i></span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} aria-invalid={Boolean(error)} />{error && <small className={styles.fieldError}>{error}</small>}</label>;
}

function SuccessPanel({ onRestart }: { onRestart: () => void }) {
  return <div className={styles.contactSuccess}><span><CheckCircle2 size={48} /></span><h2>Consulta preparada</h2><p>Validamos los datos de esta demostración. Para enviar tu consulta al equipo, utiliza el teléfono, WhatsApp o correo de arriba.</p><div><Info size={20} />Este proyecto no envía formularios porque aún no tiene backend conectado.</div><button type="button" onClick={onRestart}>Enviar otra consulta</button></div>;
}
