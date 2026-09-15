"use client";

import { Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ActionNotice, Button, PageHeader } from "@/shared/components";
import { useSettings } from "./SettingsProvider";

const modules = ["Agenda","Expediente","Tratamientos","Caja","Inventario","Configuración"];
const permissions = [["view","Ver"],["create","Crear"],["edit","Editar"],["deactivate","Desactivar"],["validate","Validar"],["export","Exportar"]];

export function RolesView() {
  const { permissions: roles,togglePermission }=useSettings(); const [role,setRole]=useState("Secretaría"); const [notice,setNotice]=useState(""); const selected=roles.find((item)=>item.role===role)!;
  return <><PageHeader title="Roles y permisos" description="Define qué información y acciones puede utilizar cada perfil." actions={<Button onClick={()=>setNotice("La matriz de permisos se guardó para esta sesión.")}><Save size={17}/> Guardar permisos</Button>}/>{notice&&<ActionNotice message={notice} onClose={()=>setNotice("")}/>}<section className="card role-intro"><div className="role-selector"><span>Configurar rol</span><select value={role} onChange={(event)=>setRole(event.target.value)}>{roles.map((item)=><option key={item.role}>{item.role}</option>)}</select></div><div className="security-note"><ShieldCheck size={20}/><p><strong>Principio de mínimo acceso</strong><span>El cajero no accede al expediente clínico y la secretaría no valida antecedentes ni diagnósticos.</span></p></div></section><section className="card permission-wrap"><table className="permission-table"><thead><tr><th>Módulo</th>{permissions.map(([,label])=><th key={label}>{label}</th>)}</tr></thead><tbody>{modules.map((module)=><tr key={module}><td><strong>{module}</strong></td>{permissions.map(([key,label])=><td key={key}><label className="permission-check"><input type="checkbox" aria-label={`${label} ${module}`} checked={(selected.modules[module]??[]).includes(key as never)} onChange={()=>togglePermission(role,module,key)}/><span/></label></td>)}</tr>)}</tbody></table></section></>;
}
