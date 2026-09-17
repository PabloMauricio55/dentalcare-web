"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, SearchInput, type Column } from "@/shared/components";
import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";

type ClinicalRecordsPatient = {
  id: string;
  name: string;
  code: string;
  dpi: string;
};

export function ClinicalRecordsPatientList() {
  const { patients } = useClinicSession();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPatients = useMemo(
    () => patients.filter((patient) => [patient.name, patient.code, patient.dpi].some((value) => value.toLowerCase().includes(normalizedQuery))),
    [normalizedQuery, patients],
  );
  const columns: Column<ClinicalRecordsPatient>[] = [
    { key: "name", header: "Paciente", cell: (patient) => <strong>{patient.name}</strong> },
    { key: "identifier", header: "Código / DPI", cell: (patient) => <div className="cell-stack"><span>{patient.code}</span><small>{patient.dpi}</small></div> },
    { key: "action", header: "", className: "actions-cell", cell: (patient) => <Link className="button button-secondary" href={`/expediente/${patient.id}`}>Abrir expediente</Link> },
  ];

  return <><section className="card patient-search-card"><SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, código o DPI..." /><span>{filteredPatients.length} pacientes</span></section><section className="card"><DataTable<ClinicalRecordsPatient> columns={columns} rows={filteredPatients} emptyMessage="No hay pacientes que coincidan con la búsqueda." /></section></>;
}