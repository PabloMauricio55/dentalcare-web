"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Baby, BadgeCheck, CalendarCheck2, ChevronDown, Cross, HeartPulse, Home, ScanLine, Search, ShieldCheck, Sparkles, Stethoscope, Syringe, X } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type Branch = "Central" | "Norte" | "Sur";
type Service = { id: string; title: string; category: string; description: string; branches: Branch[]; icon: LucideIcon };

const clinicImage = "https://lh3.googleusercontent.com/aida/AEtjO1Wfv8KXW-psF8autX_iBVUnTZHTxV0sOp-vlE7263gves8EolexEt8d4lKXMCpBscYmk8JQNa7ta2NGnUnUMpOi5J-GfRuRbi1lczDn_U0A0xNXO_AQ2W_ugCxP2ndBb4JKfaiTiF-DHek15JkjPQ13ClLfQeOX1OjO8o1CjO2MjKLyw7Ihcwywc4n7r80PBwlK-3NU750IaVH2x4B3Hv_pSllr_DeacN7XrN7JNxjS1_5P3tN6uafWfZI";

const services: Service[] = [
  { id: "general", title: "Odontología general", category: "Prevención y diagnóstico", description: "Evaluaciones completas, limpieza dental profiláctica y prevención integral para conservar tu salud bucal en óptimas condiciones.", branches: ["Central", "Norte", "Sur"], icon: Stethoscope },
  { id: "ortodoncia", title: "Ortodoncia", category: "Ortodoncia y ortopedia maxilar", description: "Evaluación y seguimiento de alineación dental mediante brackets estéticos y alineadores invisibles de alta precisión anatómica.", branches: ["Central", "Norte"], icon: Sparkles },
  { id: "endodoncia", title: "Endodoncia", category: "Microcirugía y preservación dental", description: "Atención especializada del interior del diente para salvar piezas dentales comprometidas con técnicas rotatorias modernas y suaves.", branches: ["Central", "Sur"], icon: Syringe },
  { id: "odontopediatria", title: "Odontopediatría", category: "Odontología pediátrica", description: "Atención dental para niños y adolescentes en un entorno lúdico, empático y libre de estrés, fomentando hábitos de higiene temprana.", branches: ["Central", "Norte", "Sur"], icon: Baby },
  { id: "periodoncia", title: "Periodoncia", category: "Salud periodontal", description: "Prevención y atención de encías y tejidos de soporte para evitar retracciones y sangrado, asegurando firmeza estructural.", branches: ["Central", "Sur"], icon: HeartPulse },
  { id: "cirugia", title: "Cirugía oral", category: "Cirugía bucomaxilofacial", description: "Valoración y realización de procedimientos quirúrgicos dentales e implantes de forma segura con protocolos clínicos rigurosos.", branches: ["Central", "Norte"], icon: Cross },
  { id: "rehabilitacion", title: "Rehabilitación oral", category: "Función y estética", description: "Recuperación de la función masticatoria y la armonía de tu sonrisa con planes de tratamiento personalizados.", branches: ["Central", "Norte", "Sur"], icon: ScanLine },
  { id: "protesis", title: "Prótesis dental", category: "Restauración dental", description: "Soluciones fijas y removibles diseñadas para devolver comodidad, seguridad y naturalidad a tu sonrisa.", branches: ["Central", "Sur"], icon: ShieldCheck },
  { id: "estetica", title: "Estética dental", category: "Diseño de sonrisa", description: "Tratamientos conservadores para mejorar el color, la forma y la proporción de tus dientes.", branches: ["Central", "Norte"], icon: BadgeCheck },
];

const branches: Array<{ value: "all" | Branch; label: string }> = [
  { value: "all", label: "Todas las sucursales" }, { value: "Central", label: "Sucursal Central" }, { value: "Norte", label: "Sucursal Norte" }, { value: "Sur", label: "Sucursal Sur" },
];

export function ServicesCatalog() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [branch, setBranch] = useState<"all" | Branch>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return services.filter((service) => {
      const matchesQuery = !normalizedQuery || [service.title, service.category, service.description].join(" ").toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesQuery && (specialty === "all" || service.id === specialty) && (branch === "all" || service.branches.includes(branch));
    });
  }, [branch, query, specialty]);
  const resetFilters = () => { setQuery(""); setSpecialty("all"); setBranch("all"); };

  return <PublicShell><main className={styles.catalogMain}>
    <section className={styles.catalogIntro}>
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/"><Home size={16} />Inicio</Link><span aria-hidden="true">/</span><strong>Servicios y especialidades</strong></nav>
      <div className={styles.catalogHero}><div className={styles.catalogHeroCopy}>
        <span className={styles.eyebrow}><i />Atención odontológica</span>
        <h1>Servicios para cuidar tu salud dental</h1>
        <p>Conoce las especialidades y atenciones disponibles en DentalCare. Nuestros tratamientos combinan tecnología diagnóstica avanzada y un trato cercano y personalizado para toda tu familia.</p>
        <ul className={styles.serviceBenefits}><li><BadgeCheck size={20} />Especialistas acreditados</li><li><ScanLine size={20} />Diagnóstico digital 3D</li><li><CalendarCheck2 size={20} />Atención coordinada</li></ul>
      </div><div className={styles.catalogHeroImage} style={{ backgroundImage: `url(${clinicImage})` }} role="img" aria-label="Instalaciones clínicas odontológicas de DentalCare" /></div>
    </section>
    <section className={styles.catalogFilters} aria-label="Buscador y filtros">
      <label className={styles.searchField}><span className="sr-only">Buscar servicio</span><Search size={20} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar servicio o especialidad..." /></label>
      <label className={styles.selectField}><span className="sr-only">Especialidad</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option value="all">Todas las especialidades</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select><ChevronDown size={19} aria-hidden="true" /></label>
      <label className={styles.selectField}><span className="sr-only">Sucursal</span><select value={branch} onChange={(event) => setBranch(event.target.value as "all" | Branch)}>{branches.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={19} aria-hidden="true" /></label>
      <button className={styles.filterButton} type="button">Filtrar</button><button className={styles.resetButton} type="button" onClick={resetFilters} aria-label="Limpiar filtros" title="Limpiar filtros"><X size={20} /></button>
    </section>
    <section className={styles.catalogSection} aria-labelledby="services-heading"><div className={styles.catalogSectionHeading}><h2 id="services-heading">Especialidades clínicas disponibles</h2><span>{filteredServices.length} {filteredServices.length === 1 ? "servicio" : "servicios"}</span></div>
      {filteredServices.length ? <div className={styles.catalogGrid}>{filteredServices.map((service) => { const Icon = service.icon; return <article className={styles.catalogCard} key={service.id}><div><div className={styles.catalogCardHeader}><span className={styles.catalogIcon}><Icon size={26} /></span><span className={styles.serviceTag}>{service.category}</span></div><h3>{service.title}</h3><p>{service.description}</p></div><div className={styles.catalogCardActions}><button type="button" onClick={() => setSelectedService(service)}>Ver detalles</button><Link className={styles.catalogRequestButton} href="/login">Solicitar cita</Link></div></article>; })}</div> : <div className={styles.emptyCatalog}><Search size={28} /><h3>No encontramos servicios con esos filtros</h3><p>Prueba buscando otro término o vuelve a mostrar todas las especialidades.</p><button type="button" onClick={resetFilters}>Limpiar filtros</button></div>}
    </section>
  </main>{selectedService && <div className={styles.serviceDialogBackdrop} role="presentation" onMouseDown={() => setSelectedService(null)}><section className={styles.serviceDialog} role="dialog" aria-modal="true" aria-labelledby="service-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className={styles.dialogClose} type="button" onClick={() => setSelectedService(null)} aria-label="Cerrar detalles"><X size={20} /></button><span className={styles.serviceTag}>{selectedService.category}</span><h2 id="service-dialog-title">{selectedService.title}</h2><p>{selectedService.description}</p><p className={styles.dialogBranches}><strong>Disponible en:</strong> {selectedService.branches.map((item) => `Sucursal ${item}`).join(", ")}.</p><div className={styles.dialogActions}><button type="button" onClick={() => setSelectedService(null)}>Cerrar</button><Link className={styles.catalogRequestButton} href="/login">Solicitar cita</Link></div></section></div>}</PublicShell>;
}
