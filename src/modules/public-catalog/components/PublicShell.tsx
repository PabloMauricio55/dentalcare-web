"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import styles from "./public-catalog.module.css";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/profesionales", label: "Odontólogos" },
  { href: "/servicios", label: "Servicios y especialidades" },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/contacto", label: "Contacto" },
];

type PublicShellProps = { children: ReactNode };

export function PublicShell({ children }: PublicShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" onClick={closeMenu}>
            <span className={styles.brandMark} aria-hidden="true"><HeartPulse size={20} /></span>
            <span>DentalCare</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.activationLink} href="/activar-cuenta">Activar mi cuenta</Link>
            <Link className={styles.primaryButton} href="/login">Soy paciente / Iniciar sesión</Link>
            <span className={styles.userIcon} aria-hidden="true"><UserRound size={17} /></span>
            <button
              className={styles.menuButton}
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Navegación móvil">
            {navigation.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
            <Link href="/activar-cuenta" onClick={closeMenu}>Activar mi cuenta</Link>
          </nav>
        )}
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.brand}><span className={styles.brandMark} aria-hidden="true"><HeartPulse size={18} /></span><span>DentalCare</span></div>
            <p>Clínica odontológica de alta precisión dedicada a brindar excelencia médica y confort en cada tratamiento.</p>
          </div>
          <div>
            <h2>Navegación</h2>
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/emergencias">Emergencias</Link>
          </div>
          <div>
            <h2>Contacto y atención</h2>
            <p>+54 11 4567-8900</p>
            <p>atencion@dentalcare.com</p>
            <p>Lun - Vie: 08:00 - 20:00<br />Sáb: 09:00 - 14:00</p>
          </div>
          <div>
            <h2>Legales</h2>
            <a href="#privacidad">Aviso de privacidad</a>
            <a href="#terminos">Términos y condiciones</a>
          </div>
        </div>
        <div className={styles.footerBottom}><span>© 2025 DentalCare. Todos los derechos reservados.</span><span>Atención odontológica personalizada y segura.</span></div>
      </footer>
    </div>
  );
}
