"use client";

import { Building2, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { ActionNotice, Button, PageHeader } from "@/shared/components";
import type { ClinicData } from "../models/settings";
import { useSettings } from "./SettingsProvider";

export function ClinicView() {
  const {clinic,setClinic}=useSettings(); const [notice,setNotice]=useState("");
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setClinic(Object.fromEntries(new FormData(event.currentTarget)) as unknown as ClinicData);setNotice("Datos de la clínica actualizados.");};
  return <><PageHeader title="Datos de la clínica" description="Información que aparecerá en presupuestos, recetas, recibos y documentos."/>{notice&&<ActionNotice message={notice} onClose={()=>setNotice("")}/>}<form className="card clinic-form" onSubmit={submit}><div className="form-section-title"><span><Building2/></span><div><h3>Información general</h3><p>Datos institucionales y de contacto.</p></div></div><div className="form-grid"><label className="field full"><span>Nombre comercial *</span><input name="name" defaultValue={clinic.name} required/></label><label className="field"><span>NIT *</span><input name="nit" defaultValue={clinic.nit} required/></label><label className="field"><span>Teléfono *</span><input name="phone" defaultValue={clinic.phone} required/></label><label className="field"><span>Correo</span><input name="email" type="email" defaultValue={clinic.email}/></label><label className="field"><span>Ciudad</span><input name="city" defaultValue={clinic.city}/></label><label className="field full"><span>Dirección</span><input name="address" defaultValue={clinic.address}/></label><label className="field full"><span>Horario de atención</span><input name="schedule" defaultValue={clinic.schedule}/></label><label className="field"><span>Prefijo de recibos</span><input name="receiptPrefix" defaultValue={clinic.receiptPrefix}/></label></div><div className="form-submit"><Button type="submit"><Save size={17}/> Guardar cambios</Button></div></form></>;
}
