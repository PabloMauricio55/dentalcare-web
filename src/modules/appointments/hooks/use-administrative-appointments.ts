"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/shared/lib/api-client";
import type { AdministrativeAppointment, AdministrativeAppointmentFilters } from "../models/administrative-appointment";
import { administrativeAppointmentService } from "../services/administrative-appointment.service";

export function useAdministrativeAppointments(filters: AdministrativeAppointmentFilters, enabled = true) {
  const [appointments, setAppointments] = useState<AdministrativeAppointment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const { from, to, patientId, professionalId, status, page = 0, size = 100 } = filters;

  useEffect(() => {
    if (!enabled) {
      setAppointments([]);
      setTotal(0);
      setLoading(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const result = await administrativeAppointmentService.list(
          { from, to, patientId, professionalId, status, page, size },
          controller.signal,
        );
        setAppointments(result.content);
        setTotal(result.totalElements);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setAppointments([]);
        setTotal(0);
        setError(caught instanceof ApiError ? caught.message : "No fue posible consultar las citas.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [enabled, from, page, patientId, professionalId, reloadKey, size, status, to]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  return { appointments, total, loading, error, reload };
}
