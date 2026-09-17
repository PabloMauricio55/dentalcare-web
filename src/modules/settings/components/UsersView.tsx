"use client";

import { ClipboardCopy, KeyRound, Pencil, Plus, Power } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ActionNotice, Button, ConfirmDialog, DataTable, Modal, PageHeader, RoleAccessNotice, SearchInput, StatusBadge, type Column } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
import type { StaffUser } from "../models/settings";
import { useSettings } from "./SettingsProvider";

type CredentialPreview = { user: StaffUser; password: string };

export function UsersView() {
  const { role: currentRole } = useApp();
  const canManage = roleAccess.canManageSettings(currentRole);
  const { users, addUser, updateUser, resetUserPassword, toggleUser } = useSettings();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | "credentials" | null>(null);
  const [active, setActive] = useState<StaffUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<"toggle" | "reset" | null>(null);
  const [credentials, setCredentials] = useState<CredentialPreview | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const rows = useMemo(
    () => users.filter((item) => [item.name, item.email, item.role, item.status].join(" ").toLowerCase().includes(query.toLowerCase())),
    [users, query],
  );

  const columns: Column<StaffUser>[] = [
    { key: "user", header: "Usuario", cell: (row) => <div className="cell-stack"><strong>{row.name}</strong><small>{row.email}</small></div> },
    { key: "role", header: "Rol", cell: (row) => row.role },
    { key: "access", header: "Último acceso", cell: (row) => row.lastAccess },
    { key: "status", header: "Estado", cell: (row) => <StatusBadge status={row.status} /> },
    ...(canManage ? [{
      key: "actions",
      header: "Acciones",
      className: "actions-cell",
      cell: (row: StaffUser) => <div className="table-actions">
        <button title="Editar" onClick={() => { setActive(row); setError(""); setModal("edit"); }}><Pencil size={16} /></button>
        <button title="Restablecer contraseña" onClick={() => { setActive(row); setConfirmAction("reset"); }}><KeyRound size={16} /></button>
        <button className={row.status === "Activo" ? "danger-icon" : ""} title={row.status === "Activo" ? "Desactivar" : "Activar"} onClick={() => { setActive(row); setConfirmAction("toggle"); }}><Power size={16} /></button>
      </div>,
    }] : []),
  ];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const role = String(data.get("role"));
    if (!name || !email.includes("@")) {
      setError("Ingresa un nombre y un correo válido.");
      return;
    }
    if (modal === "new") {
      const result = addUser({ name, email, role });
      if (!result.ok) { setError(result.error); return; }
      setCredentials({ user: result.user, password: result.password });
      setModal("credentials");
      setNotice("Usuario creado. Entrega la contraseña temporal por un medio seguro.");
    } else if (active) {
      const result = updateUser({ ...active, name, email, role });
      if (!result.ok) { setError(result.error); return; }
      setModal(null);
      setNotice("Usuario actualizado.");
    }
    setError("");
  };

  const confirmUserAction = () => {
    if (!active || !confirmAction) return;
    if (confirmAction === "toggle") {
      toggleUser(active.id);
      setConfirmAction(null);
      setNotice("Estado del usuario actualizado.");
      return;
    }
    const result = resetUserPassword(active.id);
    setConfirmAction(null);
    if (!result.ok) { setNotice(result.error); return; }
    setCredentials({ user: result.user, password: result.password });
    setModal("credentials");
    setNotice("Contraseña restablecida. La nueva credencial temporal está lista para entregar.");
  };

  const copyCredentials = async () => {
    if (!credentials) return;
    const text = `DentalCare\nUsuario: ${credentials.user.email}\nContraseña temporal: ${credentials.password}\nDebe cambiarla en el primer ingreso.`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Credenciales copiadas al portapapeles.");
    } catch {
      setNotice("No fue posible copiar automáticamente; selecciona los datos mostrados.");
    }
  };

  return <>
    <PageHeader title="Usuarios" description="Cuentas del personal, roles, accesos y bloqueos." actions={canManage ? <Button onClick={() => { setActive(null); setError(""); setModal("new"); }}><Plus size={17} /> Nuevo usuario</Button> : undefined} />
    {!canManage && <RoleAccessNotice role={currentRole}>Solo Administración puede crear, editar, bloquear o restablecer el acceso del personal.</RoleAccessNotice>}
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className="card patient-search-card"><SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, correo, rol o estado..." /><span>{rows.length} usuarios</span></section>
    <section className="card management-table-card"><DataTable columns={columns} rows={rows} /></section>

    <Modal open={canManage && (modal === "new" || modal === "edit")} title={modal === "new" ? "Crear usuario" : "Editar usuario"} description="El acceso es exclusivo para personal autorizado." onClose={() => setModal(null)}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field full"><span>Nombre completo *</span><input name="name" defaultValue={active?.name} /></label>
        <label className="field full"><span>Correo *</span><input name="email" type="email" defaultValue={active?.email} /></label>
        <label className="field full"><span>Rol *</span><select name="role" defaultValue={active?.role ?? "Secretaría"}><option>Administrador</option><option>Secretaría</option><option>Odontólogo</option><option>Asistente</option><option>Cajero</option></select></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="modal-form-actions full"><Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Guardar</Button></div>
      </form>
    </Modal>

    <Modal open={canManage && modal === "credentials" && !!credentials} title="Credenciales temporales" description="Solo se muestran durante esta sesión. Entrégalas por un medio seguro." onClose={() => setModal(null)}>
      {credentials && <div className="detail-stack">
        <div className="info-grid">
          <div className="full"><span>Usuario</span><strong>{credentials.user.name}</strong></div>
          <div className="full"><span>Correo de acceso</span><strong>{credentials.user.email}</strong></div>
          <div className="full"><span>Contraseña temporal</span><strong>{credentials.password}</strong></div>
        </div>
        <div className="clinical-warning"><KeyRound size={19} /><p><strong>Cambio obligatorio</strong><span>El trabajador debe cambiar esta contraseña durante su primer ingreso.</span></p></div>
        <div className="modal-form-actions"><Button variant="secondary" onClick={copyCredentials}><ClipboardCopy size={16} /> Copiar credenciales</Button><Button onClick={() => setModal(null)}>Cerrar</Button></div>
      </div>}
    </Modal>

    <ConfirmDialog
      open={canManage && confirmAction !== null}
      title={confirmAction === "reset" ? "Restablecer contraseña" : active?.status === "Activo" ? "Desactivar usuario" : "Activar usuario"}
      message={confirmAction === "reset" ? `Se generará una contraseña temporal nueva para ${active?.name}. La anterior dejará de utilizarse en esta simulación.` : active?.status === "Activo" ? `Se impedirá el acceso de ${active?.name}; su historial permanecerá intacto.` : `Se permitirá nuevamente el acceso de ${active?.name}.`}
      danger={confirmAction === "toggle" && active?.status === "Activo"}
      confirmLabel={confirmAction === "reset" ? "Generar contraseña" : active?.status === "Activo" ? "Desactivar" : "Activar"}
      onClose={() => setConfirmAction(null)}
      onConfirm={confirmUserAction}
    />
  </>;
}
