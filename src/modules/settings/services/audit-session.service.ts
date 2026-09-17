import { initialAudit } from "../mocks/settings";
import type { AuditEntry } from "../models/settings";

const STORAGE_KEY = "dentalcare.audit.session";
const listeners = new Set<() => void>();
let sessionEvents: AuditEntry[] | null = null;
let snapshot: AuditEntry[] = initialAudit;

declare global {
  interface Window {
    __dentalCareAuditEvents?: AuditEntry[];
  }
}

function readSessionEvents() {
  if (typeof window === "undefined") return [];
  if (sessionEvents && window.__dentalCareAuditEvents === sessionEvents) return sessionEvents;
  if (window.__dentalCareAuditEvents) {
    sessionEvents = window.__dentalCareAuditEvents;
    snapshot = [...sessionEvents, ...initialAudit];
    return sessionEvents;
  }
  if (sessionEvents) return sessionEvents;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    sessionEvents = stored ? JSON.parse(stored) as AuditEntry[] : [];
  } catch {
    sessionEvents = [];
  }
  window.__dentalCareAuditEvents = sessionEvents;
  snapshot = [...sessionEvents, ...initialAudit];
  return sessionEvents;
}

function auditTimestamp() {
  const now = new Date();
  const date = now.toLocaleDateString("en-CA", { timeZone: "America/Guatemala" });
  const time = now.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Guatemala" });
  return `${date} ${time}`;
}

export const auditSessionService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    readSessionEvents();
    return snapshot;
  },
  getServerSnapshot() {
    return initialAudit;
  },
  recordPatientAccess(patientCode: string, patientName: string, operation: "Creación" | "Restablecimiento") {
    const current = readSessionEvents();
    const entry: AuditEntry = {
      id: `access-${Date.now()}`,
      date: auditTimestamp(),
      user: "Daniel Sajche",
      action: operation === "Creación" ? "CREÓ ACCESO PACIENTE" : "RESTABLECIÓ ACCESO PACIENTE",
      module: "Pacientes",
      detail: `${patientCode} · ${patientName}`,
      origin: "Sesión local",
    };
    sessionEvents = [entry, ...current];
    window.__dentalCareAuditEvents = sessionEvents;
    snapshot = [...sessionEvents, ...initialAudit];
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionEvents));
    } catch {
      // El registro continúa disponible en memoria durante la navegación actual.
    }
    listeners.forEach((listener) => listener());
  },
};
