"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Accessibility, BadgeCheck, CarFront, ChevronDown, Clock3, Home, Info, MapPin, MessageCircle, Navigation, Phone, Search, TrainFront, UsersRound, X } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type Zone = "central" | "norte" | "sur";
type Branch = {
  id: Zone;
  name: string;
  zone: string;
  address: string;
  phone: string;
  whatsapp: string;
  weekdayHours: string;
  saturdayHours: string;
  services: string[];
  professionals: string;
  metro: string;
  parking: string;
  image: string;
};

const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuC_cxLP2xSPOyPRcx6z1EV5gN0XIGTAahRrRThsfhxV-6s3_lAB11aTHf7YVr4x2V9f6VawEuGVElj9ZGIRsifRVUKOU9XpI80Vfq87jOyeNCdvCgUVkZkqP1yScY6SuMf67bGFhKRkGcpqAAxdmzWSEMfYAsdaJZ8ERq2guxqOh5uRsyAPqytsTiHDhhXYNrEhhViVSkzMJxBRte-XP134nzaKOZNLFZErE-j-oULY54BVZLc-gEcg";

const branches: Branch[] = [
  { id: "central", name: "Sucursal Central", zone: "Zona Centro", address: "Av. Providencia 1420, Piso 4, Providencia", phone: "+54 11 4567-8900", whatsapp: "+54 9 11 2345-6789", weekdayHours: "Lun - Vie: 08:00 - 20:00 hs", saturdayHours: "Sáb: 09:00 - 14:00 hs", services: ["Odontología general", "Ortodoncia", "Cirugía oral", "Urgencias diurnas"], professionals: "8 profesionales en sede", metro: "Metro Manuel Montt (250 m)", parking: "Estacionamiento convenido subterráneo", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnWuuXSl85tHEPGYbNxQiBKRUQKnvJSvQoJ4arsQ_pxkyk3e3-12Hn-JGL_0r3N_ooGuqaGYpIA95f7CNeV4aug5Y5Wv-N-v6ihFofxvmeCjtyqSUHOU1TDTeS3CqDj60xhA7MBny5h9TraVno5wHJA4-3ANuTs1DE7ZrZf39lWF2G7V03VcDA-CUu8OK5invVGEmgcFhc47QNkFAnmWapy3Ea7SSWTFNtc7rBHxK74E9diMxLgzY" },
  { id: "norte", name: "Sucursal Norte", zone: "Zona Norte", address: "Av. Las Condes 9820, Local 12, Las Condes", phone: "+54 2 2840 5200", whatsapp: "+54 9 11 9876-5432", weekdayHours: "Lun - Vie: 09:00 - 19:30 hs", saturdayHours: "Sáb: 09:00 - 14:00 hs", services: ["Odontopediatría", "Estética dental", "Ortodoncia invisible"], professionals: "6 profesionales en sede", metro: "Metro Los Dominicos (600 m)", parking: "Estacionamiento para pacientes", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkn2tvSLxfPiFcTCLg5um7lP_op6oVGNxCBnOwYwl7ZGrK4KiYXwyB_Bp0-GEDOLJgs5W8I_lv1-mLcCP0noXFiwrg3KowrDbE6oodJBC5fdF5z3lpwexCs7HQSS4OReN_jcOg6cta6nADU42xlQFAI_r9U3ucdlRkF_x8jikUOLDjCI4w1rtyJzoZsoolQs7WeJHpqi5sJjJKFrBYRCaVFBbvYAUPsm747_xM5RNesaghdiNg2LwY" },
  { id: "sur", name: "Sucursal Sur", zone: "Zona Sur", address: "Gran Avenida 5300, Torre Médica B, San Miguel", phone: "+54 2 2840 5300", whatsapp: "+54 9 11 3456-7890", weekdayHours: "Lun - Vie: 08:30 - 19:00 hs", saturdayHours: "Sáb: 09:00 - 13:30 hs", services: ["Endodoncia micros.", "Periodoncia", "Cirugía maxilofacial"], professionals: "5 profesionales en sede", metro: "Metro Ciudad del Niño (400 m)", parking: "Estacionamiento de torre médica", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_hYXXEfC1Gvg64nXD_E-JUfAFBUtdEuS-HtSpdhwWszAPeB79rdBALbNb0-R7zCDOCpOXuGVAhboImmpn0VVY1fFmJ2c5xWyEs9nigQqHZnMqWiuzwOncbFU6Hs94ow7q7y4u9AcMISdJXKRqvrLrKZpi7XlHERzwjJHo0dyT_BrNg_nsN8H0AM1TRGxtRURaD2mVTHRebGcfZXk_qgfI-bBsoLF7MM2yU-9pwM7QQbacR4tFIT0H" },
];

export function BranchesCatalog() {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<"all" | Zone>("all");
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
  const [detailsBranch, setDetailsBranch] = useState<Branch | null>(null);
  const filteredBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return branches.filter((branch) => {
      const matchesQuery = !normalizedQuery || [branch.name, branch.zone, branch.address].join(" ").toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesQuery && (zone === "all" || branch.id === zone);
    });
  }, [query, zone]);
  const selectBranch = (branch: Branch) => setSelectedBranch(branch);
  const resetFilters = () => { setQuery(""); setZone("all"); };

  return <PublicShell><main className={styles.branchesMain}>
    <section className={styles.branchesHero}><div className={styles.branchesHeroCopy}>
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/"><Home size={16} />Inicio</Link><span aria-hidden="true">/</span><strong>Sucursales</strong></nav>
      <span className={styles.eyebrow}><i />Encuéntranos</span><h1>Nuestras sucursales</h1><p>Consulta nuestras ubicaciones, horarios y medios de contacto para encontrar la sede más conveniente para tu tratamiento dental.</p>
      <div className={styles.branchHighlights}><div><strong>3</strong><span>Sedes de alta complejidad</span></div><div><strong>19+</strong><span>Especialistas activos</span></div><div><strong>100%</strong><span>Accesibilidad universal</span></div></div>
    </div><div className={styles.branchesHeroImage} style={{ backgroundImage: `url(${heroImage})` }} role="img" aria-label="Instalación dental moderna de DentalCare"><div><span><BadgeCheck size={20} />Instalaciones con certificación sanitaria</span><small>Equipamiento 2025</small></div></div></section>
    <section className={styles.branchFilters} aria-label="Buscar sucursal"><label className={styles.searchField}><span className="sr-only">Buscar sucursal o zona</span><Search size={20} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar sucursal o zona (ej. Providencia, Las Condes)..." /></label><label className={styles.selectField}><span className="sr-only">Zona</span><select value={zone} onChange={(event) => setZone(event.target.value as "all" | Zone)}><option value="all">Todas las zonas</option><option value="central">Zona Centro</option><option value="norte">Zona Norte</option><option value="sur">Zona Sur</option></select><ChevronDown size={19} aria-hidden="true" /></label><div className={styles.branchFilterActions}><button className={styles.filterButton} type="button">Buscar</button><button type="button" onClick={resetFilters}>Limpiar búsqueda</button></div></section>
    <section className={styles.branchesSection} aria-labelledby="branches-heading"><div className={styles.branchesHeading}><div><h2 id="branches-heading">Centros de atención ambulatoria</h2><p>Infraestructura de punta en puntos estratégicos de fácil conectividad.</p></div><span>Mostrando {filteredBranches.length} {filteredBranches.length === 1 ? "sede disponible" : "sedes disponibles"}</span></div>
      {filteredBranches.length ? <div className={styles.branchesGrid}>{filteredBranches.map((branch) => <article className={styles.branchCatalogCard} key={branch.id}><div><div className={styles.branchPhoto} style={{ backgroundImage: `url(${branch.image})` }} role="img" aria-label={`Instalaciones de ${branch.name}`}><span className={styles.branchOpen}><i />Abierto</span><small>{branch.zone}</small></div><h3>{branch.name}</h3><p className={styles.branchAddress}><MapPin size={18} />{branch.address}</p><div className={styles.branchContact}><p><Phone size={16} />{branch.phone}</p><p><MessageCircle size={16} />{branch.whatsapp}</p><p><Clock3 size={16} />{branch.weekdayHours}</p><p><CalendarIcon />{branch.saturdayHours}</p></div><div className={styles.branchServices}><strong>Servicios clave:</strong><div>{branch.services.map((service) => <span key={service}>{service}</span>)}</div></div><p className={styles.branchProfessionals}><UsersRound size={18} />{branch.professionals}</p></div><div className={styles.branchCardActions}><div><button type="button" className={styles.catalogRequestButton} onClick={() => setDetailsBranch(branch)}><Info size={17} />Ver detalles</button><button type="button" onClick={() => selectBranch(branch)}><MapPin size={17} />Cómo llegar</button></div><a href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`}>Contactar por teléfono</a></div></article>)}</div> : <div className={styles.emptyCatalog}><Search size={28} /><h2>No encontramos sucursales</h2><p>Prueba con otra zona o término de búsqueda.</p><button type="button" onClick={resetFilters}>Limpiar búsqueda</button></div>}
    </section>
    <section className={styles.mapSection} aria-labelledby="map-heading"><div className={styles.mapHeading}><span><MapPin size={18} />Navegación espacial</span><h2 id="map-heading">Ubica nuestras sucursales</h2><p>Representación geográfica de nuestras tres sedes para facilitar tu traslado.</p></div><div className={styles.branchMap}><div className={styles.mapCanvas} aria-label="Mapa esquemático de sucursales"><svg viewBox="0 0 900 600" aria-hidden="true"><rect width="900" height="600" fill="#e8f3f2" /><path d="M50 80Q180 60 260 140T320 300Q200 350 100 280Z" fill="#dae9e6" /><path d="M620 400Q750 380 820 450T780 580Q640 590 600 480Z" fill="#dae9e6" /><path d="M-20 250C180 230 320 280 520 260C680 240 780 190 920 180" fill="none" stroke="#93dbfe" strokeWidth="12" /><g stroke="#fff" strokeOpacity=".8"><path d="M0 120H900M0 420H900M300 0V600M650 0V600" strokeWidth="9" /><path d="M80 0L820 600" strokeWidth="12" /></g><g stroke="#dae5e4" strokeDasharray="6 6" strokeWidth="4"><path d="M80 0L820 600" /><path d="M0 200H900M0 340H900M0 520H900M160 0V600M480 0V600M800 0V600" /></g></svg><span className={styles.mapDisclaimer}>Mapa esquemático interactivo</span>{branches.map((branch) => <button key={branch.id} type="button" className={`${styles.mapPin} ${styles[`mapPin${branch.id[0].toUpperCase()}${branch.id.slice(1)}`]} ${selectedBranch.id === branch.id ? styles.mapPinActive : ""}`} onClick={() => selectBranch(branch)}><small>{branch.name.replace("Sucursal ", "Sede ")}</small><MapPin size={selectedBranch.id === branch.id ? 27 : 22} /></button>)}</div><aside className={styles.mapDetail}><div className={styles.mapDetailTop}><span>Sede seleccionada</span><small><i />Atención continua</small></div><h3>{selectedBranch.name}</h3><p className={styles.branchAddress}><MapPin size={19} />{selectedBranch.address}</p><div className={styles.mapAccess}><p><TrainFront size={18} />{selectedBranch.metro}</p><p><CarFront size={18} />{selectedBranch.parking}</p><p><Accessibility size={18} />Ascensor camillero y rampa de acceso</p></div><p className={styles.mapHours}><Clock3 size={18} />{selectedBranch.weekdayHours} · {selectedBranch.saturdayHours}</p><p className={styles.mapHours}><Phone size={18} />{selectedBranch.phone}</p><div className={styles.mapDetailActions}><button type="button" className={styles.catalogRequestButton} onClick={() => setDetailsBranch(selectedBranch)}><Navigation size={17} />Cómo llegar y detalles de sede</button><Link href="/profesionales"><UsersRound size={16} />Ver odontólogos de esta sede</Link></div></aside></div></section>
    <section className={styles.branchHelp}><span><MessageCircle size={28} /></span><div><h2>¿Necesitas ayuda para elegir una sucursal?</h2><p>Comunícate con nuestro equipo para conocer la ubicación más adecuada según tus necesidades clínicas y la disponibilidad de especialistas.</p></div><div><Link className={styles.catalogRequestButton} href="/contacto"><MessageCircle size={17} />Contactar a la clínica</Link><a href="tel:+541145678900"><Phone size={17} />Llamar ahora</a></div></section>
  </main>{detailsBranch && <BranchDetails branch={detailsBranch} onClose={() => setDetailsBranch(null)} />}</PublicShell>;
}

function CalendarIcon() { return <Clock3 size={16} aria-hidden="true" />; }

function BranchDetails({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  return <div className={styles.serviceDialogBackdrop} role="presentation" onMouseDown={onClose}><section className={styles.serviceDialog} role="dialog" aria-modal="true" aria-labelledby="branch-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className={styles.dialogClose} type="button" onClick={onClose} aria-label="Cerrar detalles"><X size={20} /></button><span className={styles.serviceTag}>{branch.zone}</span><h2 id="branch-dialog-title">{branch.name}</h2><p>{branch.address}</p><div className={styles.branchDetailsGrid}><p><Phone size={17} />{branch.phone}</p><p><MessageCircle size={17} />{branch.whatsapp}</p><p><Clock3 size={17} />{branch.weekdayHours}</p><p><Clock3 size={17} />{branch.saturdayHours}</p></div><p className={styles.dialogBranches}><strong>Servicios disponibles:</strong> {branch.services.join(", ")}.</p><div className={styles.dialogActions}><button type="button" onClick={onClose}>Cerrar</button><a className={styles.catalogRequestButton} href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`}>Llamar a la sede</a></div></section></div>;
}
