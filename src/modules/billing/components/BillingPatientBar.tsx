"use client";

import { useClinicSession } from "@/modules/appointments/components/ClinicSessionProvider";
import { PatientSummary } from "@/modules/patients/components/PatientSummary";

export function BillingPatientBar() {
  const { patients, selectedPatientId, selectPatient } = useClinicSession();
  const patient = patients.find((item) => item.id === selectedPatientId);
  return (
    <section className="card patient-search-card">
      {patient ? <PatientSummary patient={patient} /> : <span>Selecciona un paciente para trabajar su cuenta, sus recibos y sus operaciones de caja.</span>}
      <label className="compact-field">
        <span>Paciente en caja</span>
        <select value={selectedPatientId ?? ""} onChange={(event) => selectPatient(event.target.value || null)}>
          <option value="">Sin seleccionar</option>
          {patients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
    </section>
  );
}
