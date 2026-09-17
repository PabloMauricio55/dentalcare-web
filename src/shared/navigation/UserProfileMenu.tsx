"use client";

import { ChevronDown, LogOut, Mail, UserCog, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { roles, useApp } from "@/providers/AppProviders";
import styles from "./user-profile-menu.module.css";

export function UserProfileMenu() {
  const router = useRouter();
  const { role, setRole } = useApp();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  const logout = () => {
    sessionStorage.removeItem("dentalcare-role");
    setOpen(false);
    router.push("/login");
  };

  return <div className={styles.profile} ref={rootRef}>
    <button
      className={styles.trigger}
      type="button"
      aria-label="Abrir perfil del usuario"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      <span className={styles.avatar}><UserRound size={18} /></span>
      <span className={styles.identity}><strong>Daniel Sajche</strong><small>{role}</small></span>
      <ChevronDown size={15} aria-hidden="true" />
    </button>

    {open && <section className={styles.panel} role="dialog" aria-modal="false" aria-label="Perfil del usuario actual">
      <header>
        <div className={styles.largeAvatar}>DS</div>
        <div><strong>Daniel Sajche</strong><span>{role}</span></div>
        <button ref={closeRef} type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Cerrar perfil"><X size={18} /></button>
      </header>
      <div className={styles.contact}><Mail size={16} /><div><span>Correo institucional</span><strong>daniel@dentalcare.gt</strong></div></div>
      <label className={styles.roleField}>
        <span><UserCog size={15} /> Perfil simulado</span>
        <select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
          {roles.map((item) => <option key={item}>{item}</option>)}
        </select>
        <small>Esta selección cambia los permisos visibles durante la sesión.</small>
      </label>
      <button type="button" className={styles.logout} onClick={logout}><LogOut size={16} /> Cerrar sesión</button>
    </section>}
  </div>;
}
