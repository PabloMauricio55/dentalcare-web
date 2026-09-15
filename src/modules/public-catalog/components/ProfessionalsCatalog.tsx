"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Award, BadgeCheck, ChevronDown, Home, Info, Languages, LockKeyhole, MapPin, ScanLine, Search, X } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type Branch = "Central" | "Norte" | "Sur";
type Professional = {
  name: string;
  registration: string;
  specialty: string;
  summary: string;
  experience: string;
  branches: Branch[];
  languages: string;
  image: string;
};

const teamImage = "https://lh3.googleusercontent.com/aida/AEtjO1URhm5C1pVXGD68teqewAZKTY7Qt_wW2AgsTXYWlYuhtrGIw5MqfYCVEmMEfoID5PVTgSwgWKc3DpzdU62yMUezlzpyPGAfMIp4jAPRHJFmacSVc2oUqA_v5agtrCtCCc_hW-Hu4TzEJCoh-0IemQFwAw6aHf-rfwMv7v6Cfj93Ejl9U15d754b812-mQ--yeVVws9ds-Nm0bjsrYW0zionjGAi4Sw9dSUeq6jfB3K8D1CXj0Hc1StQNSU";
const malePortrait = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0JHAMl6h6KbblXc0xrJs_vtPBAbSc8Jjsb738NSKStTjha6C9XLZV7_51rhkPAAo-3ZaHp56II12TTylbtTX9clpACCetxpU0-0ytkj8CgLkh-Wh9R0p8nlC1nuh2ojspvcsiZjZ3H4TNBn1FMQZiKKRAkrwIn_fXXSXtPgP4ZF028pQiTUyFRx9EJlHq22R_AWZZ8U8VnLlbA2Dmo44-VzwHbPXb9-KvKI4Xw5xyAk4p1qxtGXC1";
const femalePortrait = "https://lh3.googleusercontent.com/aida-public/AB6AXuCzl1Ci33e6qqmbnoaeVNnQ-u49BL_QnsK4E9se2HM7oxgiZkGuR8cV6yfwfWR8S4vzkIILrcgb4LwpstN2D4_FYfPBFAugEvY4U-ichHsjQHUTzhK_HrSoxYr5q3EvkegKfIueEC6csIbMwSJIAFmuTU_uk7g2nd1gGd03xxGTneFrQeQ4V_X1TMRKbWOnWGJYuOUWmdwcas0cYf_J7lS4p8VLaUAu4f1RQ0hW4vs_XYwhhZqRYICl";

const professionals: Professional[] = [
  { name: "Dr. Carlos Méndez", registration: "MN: 48921", specialty: "Odontología general", summary: "Diagnóstico integral, operatoria dental, prevención personalizada y estética dental mínimamente invasiva.", experience: "8 años de experiencia clínica", branches: ["Central"], languages: "Español", image: malePortrait },
  { name: "Dra. Andrea López", registration: "MN: 52140", specialty: "Ortodoncia", summary: "Alineadores invisibles, ortodoncia interceptiva en adolescentes y corrección funcional de mordidas complejas.", experience: "10 años de experiencia clínica", branches: ["Norte"], languages: "Español e inglés", image: femalePortrait },
  { name: "Dra. Sofía Ramírez", registration: "MN: 63102", specialty: "Odontopediatría", summary: "Atención respetuosa y lúdica para niños y adolescentes, selladores, fluoración y manejo de ansiedad dental.", experience: "7 años de experiencia clínica", branches: ["Central"], languages: "Español", image: teamImage },
  { name: "Dr. José Morales", registration: "MN: 39801", specialty: "Endodoncia", summary: "Tratamiento microquirúrgico de conductos radiculares, preservación de piezas comprometidas y urgencias pulpares.", experience: "12 años de experiencia clínica", branches: ["Sur"], languages: "Español", image: malePortrait },
  { name: "Dra. Mariana Castillo", registration: "MN: 55439", specialty: "Periodoncia", summary: "Salud de encías, injertos periodontales, terapia de soporte y preparación de lechos para implantes dentales.", experience: "9 años de experiencia clínica", branches: ["Central", "Norte"], languages: "Español", image: femalePortrait },
  { name: "Dr. Luis Herrera", registration: "MN: 31084", specialty: "Cirugía oral", summary: "Extracción quirúrgica de terceros molares complejos, regeneración ósea y cirugía maxilofacial ambulatoria.", experience: "14 años de experiencia clínica", branches: ["Sur"], languages: "Español e inglés", image: teamImage },
];

const branches: Array<{ value: "all" | Branch; label: string }> = [
  { value: "all", label: "Todas las sucursales" }, { value: "Central", label: "Sucursal Central" }, { value: "Norte", label: "Sucursal Norte" }, { value: "Sur", label: "Sucursal Sur" },
];

export function ProfessionalsCatalog() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [branch, setBranch] = useState<"all" | Branch>("all");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const filteredProfessionals = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return professionals.filter((professional) => {
      const matchesQuery = !normalizedQuery || [professional.name, professional.specialty, professional.summary].join(" ").toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesQuery && (specialty === "all" || professional.specialty === specialty) && (branch === "all" || professional.branches.includes(branch));
    });
  }, [branch, query, specialty]);
  const resetFilters = () => { setQuery(""); setSpecialty("all"); setBranch("all"); };

  return <PublicShell><main className={styles.professionalsMain}>
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/"><Home size={16} />Inicio</Link><span aria-hidden="true">/</span><strong>Odontólogos</strong></nav>
    <section className={styles.professionalsHero}><div className={styles.professionalsHeroCopy}>
      <span className={styles.eyebrow}><i />Nuestro equipo</span><h1>Conoce a nuestros odontólogos</h1>
      <p>Consulta la experiencia, especialidades y sucursales de atención de nuestro equipo profesional de alta precisión médica y cuidado humano.</p>
      <ul className={styles.serviceBenefits}><li><BadgeCheck size={20} />100% colegiados</li><li><Award size={20} />Posgrados acreditados</li><li><ScanLine size={20} />Tecnología guiada</li></ul>
    </div><div className={styles.professionalsHeroImage} style={{ backgroundImage: `url(${teamImage})` }} role="img" aria-label="Equipo médico odontológico en consulta"><span><BadgeCheck size={18} />Equipo médico colegiado y en constante formación</span></div></section>
    <section className={styles.professionalsFilters} aria-label="Buscar odontólogos">
      <label className={styles.professionalSearchField}><span>Buscar profesional o enfoque</span><div><Search size={20} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o especialidad..." /></div></label>
      <label className={styles.professionalSelectField}><span>Especialidad</span><div><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option value="all">Todas las especialidades</option>{Array.from(new Set(professionals.map((professional) => professional.specialty))).map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={19} aria-hidden="true" /></div></label>
      <label className={styles.professionalSelectField}><span>Sucursal</span><div><select value={branch} onChange={(event) => setBranch(event.target.value as "all" | Branch)}>{branches.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={19} aria-hidden="true" /></div></label>
      <div className={styles.professionalFilterActions}><button type="button" className={styles.filterButton}>Filtrar</button><button type="button" className={styles.clearButton} onClick={resetFilters}>Limpiar</button></div>
    </section>
    <section className={styles.professionalsSection} aria-labelledby="professionals-heading"><div className={styles.professionalsResults}><p id="professionals-heading">Mostrando <strong>{filteredProfessionals.length}</strong> odontólogos activos</p><span><BadgeCheck size={16} />Cuerpo facultativo verificado</span></div>
      {filteredProfessionals.length ? <div className={styles.professionalsGrid}>{filteredProfessionals.map((professional) => <article className={styles.professionalCard} key={professional.name}><div><div className={styles.professionalPhoto} style={{ backgroundImage: `url(${professional.image})` }} role="img" aria-label={`Retrato de ${professional.name}`}><span><i />Disponible para solicitudes</span></div><div className={styles.professionalName}><h2>{professional.name}</h2><small>{professional.registration}</small></div><h3>{professional.specialty}</h3><p>{professional.summary}</p><ul className={styles.professionalMeta}><li><Award size={18} />{professional.experience}</li><li><MapPin size={18} />Sucursal {professional.branches.join(" y ")}</li><li><Languages size={18} />{professional.languages}</li></ul></div><div className={styles.professionalCardActions}><button type="button" onClick={() => setSelectedProfessional(professional)}>Ver perfil</button><button type="button" className={styles.catalogRequestButton} onClick={() => setSelectedProfessional(professional)}>Solicitar cita</button></div></article>)}</div> : <div className={styles.emptyCatalog}><Search size={28} /><h2>No encontramos odontólogos</h2><p>Prueba con otro nombre, especialidad o sucursal para encontrar al especialista que necesitas.</p><button type="button" onClick={resetFilters}>Limpiar filtros</button></div>}
      <aside className={styles.availabilityNotice}><Info size={22} /><p><strong>Información de agenda:</strong> La disponibilidad mostrada es referencial para la solicitud. La fecha y el horario definitivos serán revisados, asignados y confirmados por la recepción clínica de acuerdo con el plan de tratamiento.</p></aside>
    </section>
  </main>{selectedProfessional && <div className={styles.serviceDialogBackdrop} role="presentation" onMouseDown={() => setSelectedProfessional(null)}><section className={styles.serviceDialog} role="dialog" aria-modal="true" aria-labelledby="professional-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className={styles.dialogClose} type="button" onClick={() => setSelectedProfessional(null)} aria-label="Cerrar ventana"><X size={20} /></button><div className={styles.protectedDialogHeading}><span><LockKeyhole size={25} /></span><div><h2 id="professional-dialog-title">Accede para solicitar una cita</h2><p>{selectedProfessional.name} · {selectedProfessional.specialty}</p></div></div><p>Esta función está disponible únicamente para pacientes registrados en DentalCare. Inicia sesión o comunícate con el equipo de la clínica para gestionar tu turno.</p><div className={styles.protectedDialogNote}><LockKeyhole size={20} /><p><strong>Importante:</strong> La clínica crea directamente las cuentas de historia clínica. El paciente únicamente activa su acceso con su usuario o código recibido por SMS o correo institucional.</p></div><div className={styles.protectedDialogActions}><Link className={styles.catalogRequestButton} href="/login">Iniciar sesión</Link><Link href="/activar-cuenta">Activar mi cuenta</Link><Link href="/contacto">Contactar a la clínica</Link></div><button className={styles.dialogTextClose} type="button" onClick={() => setSelectedProfessional(null)}>Cerrar</button></section></div>}</PublicShell>;
}
