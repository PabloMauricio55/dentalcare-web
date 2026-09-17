"use client";

import { Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ActionNotice, Button, PageHeader, RoleAccessNotice } from "@/shared/components";
import { useApp } from "@/providers/AppProviders";
import { roleAccess } from "@/shared/constants/role-access";
import { useSettings } from "./SettingsProvider";

const modules = ["Agenda","Expediente","Tratamientos","Caja","Inventario","Esterilización","Reportes","Configuración"];
const permissions = [["view","Ver"],["create","Crear"],["edit","Editar"],["deactivate","Desactivar"],["validate","Validar"],["export","Exportar"]];

export function RolesView() {
  const { role: currentRole } = useApp();
  const canManage = roleAccess.canManageSettings(currentRole);
  const { permissions: roles,togglePermission }=useSettings(); const [selectedRole,setSelectedRole]=useState("Secretaría"); const [notice,setNotice]=useState(""); const selected=roles.find((item)=>item.role===selectedRole)!;
  return <><PageHeader title="Roles y permisos" description="Define qué información y acciones puede utilizar cada perfil." actions={canManage ? <Button onClick={()=>setNotice("La matriz de permisos se guardó para esta sesión.")}><Save size={17}/> Guardar permisos</Button> : undefined}/>{!canManage&&<RoleAccessNotice role={currentRole}>La matriz de permisos solo puede ser modificada por Administración. Esta vista permanece disponible únicamente como explicación visual.</RoleAccessNotice>}{notice&&<ActionNotice message={notice} onClose={()=>setNotice("")}/>}<section className="card role-intro"><div className="role-selector"><span>{canManage ? "Configurar rol" : "Consultar rol"}</span><select value={selectedRole} onChange={(event)=>setSelectedRole(event.target.value)}>{roles.map((item)=><option key={item.role}>{item.role}</option>)}</select></div><div className="security-note"><ShieldCheck size={20}/><p><strong>Principio de mínimo acceso</strong><span>El cajero no accede al expediente clínico y la secretaría no valida antecedentes ni diagnósticos.</span></p></div></section><section className="card management-table-card"><div className="permission-wrap"><table className="permission-table"><thead><tr><th>Módulo</th>{permissions.map(([,label])=><th key={label}>{label}</th>)}</tr></thead><tbody>{modules.map((module)=><tr key={module}><td><strong>{module}</strong></td>{permissions.map(([key,label])=><td key={key}><label className="permission-check"><input type="checkbox" aria-label={`${label} ${module}`} checked={(selected.modules[module]??[]).includes(key as never)} disabled={!canManage} onChange={()=>togglePermission(selectedRole,module,key)}/><span/></label></td>)}</tr>)}</tbody></table></div></section></>;
}
