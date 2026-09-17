"use client";

import { RotateCcw, Save, ShieldCheck, Undo2 } from "lucide-react";
import { useState } from "react";
import { ActionNotice, Button, PageHeader, RoleAccessNotice } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
import type { PermissionKey, RolePermission } from "../models/settings";
import { initialPermissions } from "../mocks/settings";
import { useSettings } from "./SettingsProvider";

const modules = ["Agenda", "Expediente", "Tratamientos", "Caja", "Inventario", "Esterilización", "Reportes", "Configuración"];
const permissionColumns: [PermissionKey, string][] = [["view", "Ver"], ["create", "Crear"], ["edit", "Editar"], ["deactivate", "Desactivar"], ["validate", "Validar"], ["export", "Exportar"]];
const cloneModules = (value: Record<string, PermissionKey[]>) => Object.fromEntries(modules.map((module) => [module, [...(value[module] ?? [])]]));

function PermissionEditor({ saved, defaults, canManage, onSave }: {
  saved: RolePermission;
  defaults: RolePermission;
  canManage: boolean;
  onSave: (modules: Record<string, PermissionKey[]>) => void;
}) {
  const [draft, setDraft] = useState(() => cloneModules(saved.modules));
  const savedSnapshot = JSON.stringify(cloneModules(saved.modules));
  const dirty = JSON.stringify(draft) !== savedSnapshot;
  const toggle = (module: string, permission: PermissionKey) => setDraft((current) => {
    const values = current[module] ?? [];
    const next = values.includes(permission) ? values.filter((value) => value !== permission) : [...values, permission];
    return { ...current, [module]: next };
  });

  return <>
    {canManage && <div className="card-heading">
      <div><h3>Matriz de {saved.role}</h3><p>{dirty ? "Hay cambios sin guardar." : "No hay cambios pendientes."}</p></div>
      <div className="page-actions">
        <Button variant="ghost" disabled={!dirty} onClick={() => setDraft(cloneModules(saved.modules))}><Undo2 size={16} /> Cancelar cambios</Button>
        <Button variant="secondary" onClick={() => setDraft(cloneModules(defaults.modules))}><RotateCcw size={16} /> Restablecer valores</Button>
        <Button disabled={!dirty} onClick={() => onSave(cloneModules(draft))}><Save size={16} /> Guardar permisos</Button>
      </div>
    </div>}
    <div className="permission-wrap"><table className="permission-table"><thead><tr><th>Módulo</th>{permissionColumns.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{modules.map((module) => <tr key={module}><td><strong>{module}</strong></td>{permissionColumns.map(([key, label]) => <td key={key}><label className="permission-check"><input type="checkbox" aria-label={`${label} ${module}`} checked={(draft[module] ?? []).includes(key)} disabled={!canManage} onChange={() => toggle(module, key)} /><span /></label></td>)}</tr>)}</tbody></table></div>
  </>;
}

export function RolesView() {
  const { role: currentRole } = useApp();
  const canManage = roleAccess.canManageSettings(currentRole);
  const { permissions: roles, savePermissions } = useSettings();
  const [selectedRole, setSelectedRole] = useState("Secretaría");
  const [notice, setNotice] = useState("");
  const selected = roles.find((item) => item.role === selectedRole)!;
  const defaults = initialPermissions.find((item) => item.role === selectedRole)!;

  return <>
    <PageHeader title="Roles y permisos" description="Los cambios se preparan como borrador y solo se aplican al presionar Guardar permisos." />
    {!canManage && <RoleAccessNotice role={currentRole}>La matriz de permisos solo puede ser modificada por Administración. Esta vista permanece disponible únicamente como explicación visual.</RoleAccessNotice>}
    {notice && <ActionNotice message={notice} onClose={() => setNotice("")} />}
    <section className="card role-intro">
      <div className="role-selector"><span>{canManage ? "Configurar rol" : "Consultar rol"}</span><select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>{roles.map((item) => <option key={item.role}>{item.role}</option>)}</select></div>
      <div className="security-note"><ShieldCheck size={20} /><p><strong>Principio de mínimo acceso</strong><span>El cajero no accede al expediente clínico y la secretaría no valida antecedentes ni diagnósticos.</span></p></div>
    </section>
    <section className="card management-table-card">
      <PermissionEditor
        key={selectedRole}
        saved={selected}
        defaults={defaults}
        canManage={canManage}
        onSave={(modules) => { savePermissions(selectedRole, modules); setNotice(`Permisos de ${selectedRole} guardados para esta sesión.`); }}
      />
    </section>
  </>;
}
