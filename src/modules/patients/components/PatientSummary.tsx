import type { Patient } from "../models/patient";
import { StatusBadge } from "@/shared/components";

export function PatientSummary({ patient }: { patient: Patient }) {
  return <div className="patient-summary"><span className="patient-avatar large">{patient.name.split(" ").slice(0,2).map((part) => part[0]).join("")}</span><div><strong>{patient.name}</strong><small>{patient.code} · DPI {patient.dpi}</small></div><StatusBadge status={patient.accessStatus} /></div>;
}
