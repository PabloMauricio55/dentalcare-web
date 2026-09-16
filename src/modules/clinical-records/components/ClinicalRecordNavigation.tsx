"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ClinicalRecordSectionKey } from "@/modules/clinical-records/types/clinical-record-session.type";

type ClinicalRecordTab = {
  key: ClinicalRecordSectionKey;
  label: string;
};

const tabs: ClinicalRecordTab[] = [
  { key: "attention", label: "Atención actual" },
  { key: "antecedentes", label: "Antecedentes" },
  { key: "preparacion", label: "Preparación" },
  { key: "evolucion", label: "Consultas y evolución" },
  { key: "odontograma", label: "Odontograma" },
  { key: "diagnosticos", label: "Diagnósticos" },
  { key: "archivos", label: "Archivos" },
  { key: "historial", label: "Historial y trazabilidad" },
];

export function ClinicalRecordNavigation() {
  const pathname = usePathname();
  const params = useParams<{ patientId: string }>();
  const basePath = `/expediente/${params.patientId}`;

  return (
    <nav className="section-tabs" aria-label="Secciones del expediente clínico">
      {tabs.map(({ key, label }) => {
        const href = key === "attention" ? basePath : `${basePath}/${key}`;
        const active = pathname === href;

        return (
          <Link className={active ? "active" : ""} href={href} key={key}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
