import { CheckCircle2, X } from "lucide-react";
export function ActionNotice({message,onClose}:{message:string;onClose?:()=>void}){return <div className="action-notice" role="status"><CheckCircle2 size={19}/><span>{message}</span>{onClose&&<button onClick={onClose} aria-label="Cerrar"><X size={16}/></button>}</div>;}
