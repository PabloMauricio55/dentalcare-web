import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  CalendarDays,
  Clock3,
  Cross,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  UsersRound,
} from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type Service = { title: string; description: string; icon: LucideIcon };
type Professional = { name: string; specialty: string; experience: string; branch: string; image: string };
type Branch = { name: string; address: string; hours: string; phone: string; image: string };

const images = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQt2BVpz7hQ0E8uxa0l8dyoiN42XFCmU2povO6wS4PbM-sof0x6NdYSwZwYQpskGmwKwmWi9KtjFO7qnFOjssMk-PVhwct3FLBDTnQTNeFWRLNCCXZkET7YGQWxkkUKraIt404OzrrpG3Y1uBDsgIUrzRp3LBKItGm52u0NTUuECEN3vsKRY9B5eOIxfNeUtJfQB8KXsmegUqJ4FMNKOkOnWGhYAq_qAPODRmrREGGbAEuVdN1zMQ4",
  valentina: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOB85GNJoCHui7Jl7D6PJVRuBN4OEw4KjkE6VpBimIjmmRE_iUwWxvaGL4w2X3g18nZfR3qqPvRY1HisvPADaQ4DxZVClhYEcxLuY9ShfiY9G_rEmXZY0WY-YI9WGK9Gn9w2oQ5yHoR7MSMZpVmUovMNyGwwznTHogJgIITOKrFLRCGt_tamNc-aeOQ9AssxFpI2Lj9qsN3TC9Wa_N5bEhrVQ8I1dLucl8HyUsk3xP7ecDSJNQZ2bb",
  carlos: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeCJTznl4jwg_igOzS802qWQ-Zlbo5OVCauQBOi8GpmpaJmMHDY3f_GYHllcLkYDlXszNsBZpP-5_Yp_Vi-goKqC9twRCqEWTbRiwglQpDV89rgG2GXYjvuvBc0FEoF3rvMvY11x8drxlxvKCL181gCOZH3D4VFCR3Lx3q_-xRrREE-NEV2ND3CZ5Sn79hiaLiL7RMzH8rzCI6EHhxTMzKGytSJOI48ux6zQF4ET4bTB_O3AOONtQa",
  camila: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAcO-B0wKwb3jkwz3iAwlpNAHC60wCOhs0zHBOsuZaqVXUGd_x6thGsEZ67LkFwk6WCynELqPoP1h0TMnzNNxhy7FiJEoodqkVj22nBXHoQHFyJwtJraNsW1cHlJE_mR_lSv149-MOCx9Ft_xyRakALY0szYkl_0v_BjI9sBWKHaRY2sjailQ4d7-QNYJ7g1A_gpzBmhAUOPIhIhzrvWo3KTzcfk7infEJBJlIoPL11ZBWbzu7Mzeu",
  central: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQHS25csL6dEHmPEU7tJTuYaeaU2bgPc8MwhBYcnwk_JWSIsuPbN5Ct-1GLK93Td5lAY6F5p3ki75FXgkJm755ojyvqyrnClRImWm6RbNcm_6NhwEKDmtO72Js0QG3qEDUGUbS5nc6qqJlBVBKrXcsx4Lsw8E_FIcye4lcjA9fiZoGL7AuBZ_bRshmQWL1F3dStqaQqoKgEgauzCpdpWdLM0t8edCQc6shDiz5eDaPT5qYJgUUpw-S",
  norte: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcCYJnRSKzX1JUbKHU0440nH3c3kgDQ9uVCOBWbf2chKLts2cH2B2B5Xwh01Y7BXilzQq91-uVkBNGACwb_x5xXAi1MP5CByAhaXkOnEopR-wpDGqVvof2PrlXOs6m5au3gxZs9JpthoCvWq65V_xHWuZivXdB_2puv6UBu47Xt_i_fC396rdOKaq2SdrkK58NpHxTEhEje74Th9vrt_ZKN86oItie1GdXqk7lCle2bd0j5EL2oeN2",
  sur: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2RposYAIrD3wLYlPw-PPSRABmPMqJvT84HmvWAb5-uWcPLoueKuoxyj5TR8N7P5d3jmok7gxfRtPy6UXshNtQQX_8qFgd1cZaaFCIRvU7h4XATnewDs9trcJ62SGmlfOFlM0bJo5PN28NPcxFS3rrUsc3yLR3x6dPa5frdj_v4dG9hKvaR4R59nvh71JAM96ZaTG1Df1WHVYpo7qmFYJwWTWHu6hzZbPTuBJ0-XryQe_WYJGV2zKr",
};

const services: Service[] = [
  { title: "Odontología general", description: "Revisiones preventivas, limpiezas profundas y diagnósticos integrales para mantener tu salud dental.", icon: Stethoscope },
  { title: "Ortodoncia", description: "Alineación dental con brackets tradicionales o alineadores invisibles de última generación.", icon: Sparkles },
  { title: "Endodoncia", description: "Tratamientos especializados para salvar piezas dentales y aliviar molestias profundas.", icon: Syringe },
  { title: "Odontopediatría", description: "Atención cálida y cuidadosa para el cuidado bucal de niños y adolescentes.", icon: Baby },
  { title: "Periodoncia", description: "Tratamiento preventivo y terapéutico de encías y tejidos de soporte dental.", icon: HeartPulse },
  { title: "Cirugía oral", description: "Procedimientos seguros para extracción de terceros molares e implantes dentales.", icon: Cross },
];

const professionals: Professional[] = [
  { name: "Dra. Valentina Morales", specialty: "Ortodoncia y Estética Dental", experience: "12 años de experiencia", branch: "Sucursal Central", image: images.valentina },
  { name: "Dr. Carlos Mendoza", specialty: "Endodoncia y Microcirugía", experience: "9 años de experiencia", branch: "Sucursal Norte", image: images.carlos },
  { name: "Dra. Camila Soto", specialty: "Odontopediatría Integral", experience: "8 años de experiencia", branch: "Sucursal Sur", image: images.camila },
];

const branches: Branch[] = [
  { name: "Sucursal Central", address: "Av. Providencia 1420, Piso 4, Santiago", hours: "Lun - Vie: 08:30 - 20:00 · Sáb: 09:00 - 14:00", phone: "+56 2 2840 5100", image: images.central },
  { name: "Sucursal Norte", address: "Av. Las Condes 9820, Local 12, Las Condes", hours: "Lun - Vie: 09:00 - 19:30 · Sáb: 09:00 - 14:00", phone: "+56 2 2840 5200", image: images.norte },
  { name: "Sucursal Sur", address: "Gran Avenida 5300, Torre Médica B, San Miguel", hours: "Lun - Vie: 08:30 - 19:00 · Sáb: 09:00 - 13:30", phone: "+56 2 2840 5300", image: images.sur },
];

const quickLinks = [
  { title: "Explorar servicios", text: "Descubre nuestros tratamientos odontológicos especializados diseñados para cuidar tu salud bucal.", href: "/servicios", icon: Stethoscope, action: "Ver servicios" },
  { title: "Conocer odontólogos", text: "Un equipo médico multidisciplinario, cálido y altamente capacitado para brindarte la mejor experiencia clínica.", href: "/profesionales", icon: UsersRound, action: "Ver profesionales" },
  { title: "Encontrar una sucursal", text: "Instalaciones modernas equipadas con la última tecnología médica y ubicaciones de fácil acceso.", href: "/sucursales", icon: MapPin, action: "Ver sucursales" },
];

export function PublicHome() {
  return (
    <PublicShell>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><i />Cuidamos tu sonrisa</span>
            <h1>Atención dental profesional y cercana</h1>
            <p>Conoce nuestros servicios, profesionales y sucursales. Si ya eres paciente, activa tu cuenta o inicia sesión para solicitar una cita.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/login">Soy paciente / Iniciar sesión</Link>
              <Link className={styles.secondaryButton} href="/activar-cuenta">Activar mi cuenta</Link>
            </div>
            <Link className={styles.textLink} href="/contacto">Contactar a la clínica <ArrowRight size={16} /></Link>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroPhoto} style={{ backgroundImage: `url(${images.hero})` }} role="img" aria-label="Atención odontológica cálida en DentalCare" />
            <div className={styles.heroBadge}><ShieldCheck size={20} /><span><strong>Atención segura y profesional</strong><small>Protocolos clínicos certificados</small></span></div>
          </div>
        </section>

        <section className={styles.quickGrid} aria-label="Accesos rápidos">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return <article className={styles.quickCard} key={item.title}>
              <span className={styles.cardIcon}><Icon size={21} /></span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link href={item.href}>{item.action}<ArrowRight size={15} /></Link>
            </article>;
          })}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><h2>Servicios para cuidar tu salud dental</h2><p>Abordajes integrales con tecnología de vanguardia y excelencia de cada tratamiento.</p></div>
          <div className={styles.serviceGrid}>
            {services.map((service) => {
              const Icon = service.icon;
              return <article className={styles.serviceCard} key={service.title}>
                <span className={styles.cardIcon}><Icon size={19} /></span><h3>{service.title}</h3><p>{service.description}</p><Link href="/servicios">Ver detalles <ArrowRight size={14} /></Link>
              </article>;
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><h2>Conoce a nuestros profesionales</h2><p>Especialistas con alta formación académica y calidez humana al servicio de tu bienestar.</p></div>
          <div className={styles.peopleGrid}>
            {professionals.map((professional) => <article className={styles.personCard} key={professional.name}>
              <div className={styles.personImage} style={{ backgroundImage: `url(${professional.image})` }} role="img" aria-label={`Retrato de ${professional.name}`} />
              <div className={styles.personContent}><h3>{professional.name}</h3><strong>{professional.specialty}</strong><p><Clock3 size={15} />{professional.experience}</p><p><MapPin size={15} />{professional.branch}</p><Link className={styles.secondaryButton} href="/profesionales">Ver perfil</Link></div>
            </article>)}
          </div>
          <div className={styles.centerAction}><Link className={styles.secondaryButton} href="/profesionales">Ver todos los odontólogos</Link></div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><h2>Encuentra tu sucursal más cercana</h2><p>Espacios confortables y accesibles, con instalaciones diseñadas para tu tranquilidad.</p></div>
          <div className={styles.peopleGrid}>
            {branches.map((branch) => <article className={styles.branchCard} key={branch.name}>
              <div className={styles.branchImage} style={{ backgroundImage: `url(${branch.image})` }} role="img" aria-label={`Instalaciones de ${branch.name}`} />
              <div className={styles.branchContent}><h3>{branch.name}</h3><p><MapPin size={15} />{branch.address}</p><p><Clock3 size={15} />{branch.hours}</p><p><Phone size={15} />{branch.phone}</p></div><Link className={styles.secondaryButton} href="/sucursales">Ver sucursal</Link>
            </article>)}
          </div>
        </section>

        <section className={styles.appointmentPanel}>
          <span className={styles.appointmentIcon}><CalendarDays size={28} /></span><h2>¿Necesitas solicitar una cita?</h2><p className={styles.appointmentLead}>Esta función está disponible únicamente para pacientes registrados por la clínica.</p><p>La clínica crea las cuentas de paciente en tu primera visita física o consulta. Activa tu acceso con el código recibido para gestionar tus citas en línea.</p>
          <div className={styles.centerActions}><Link className={styles.primaryButton} href="/login">Iniciar sesión</Link><Link className={styles.secondaryButton} href="/activar-cuenta">Activar mi cuenta</Link><Link className={styles.outlineButton} href="/contacto">Contactar a la clínica</Link></div>
        </section>

        <section className={styles.emergencyPanel}>
          <span className={styles.emergencyIcon}><Phone size={26} /></span><div><h2>¿Tienes una emergencia dental?</h2><p>Para recibir atención urgente, comunícate directamente con la clínica.</p><small>No utilices el formulario de contacto ni la solicitud de citas para una emergencia.</small></div><Link className={styles.emergencyButton} href="/emergencias"><Phone size={16} />Llamar a emergencias</Link>
        </section>
      </main>
    </PublicShell>
  );
}
