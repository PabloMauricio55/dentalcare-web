import { AppointmentRequest, createMockRequest, mockAppointmentHistory, mockAppointments } from "./appointments.mock";

export { mockAppointmentHistory, mockAppointments } from "./appointments.mock";

export interface PatientAppointmentsRepository {
  getAppointments(): Promise<typeof mockAppointments>;
  getHistory(): Promise<typeof mockAppointmentHistory>;
  createRequest(request: AppointmentRequest): Promise<ReturnType<typeof createMockRequest>>;
}

// Sustituir esta implementación local por el cliente HTTP cuando el backend exponga sus endpoints.
export const patientAppointmentsRepository: PatientAppointmentsRepository = {
  getAppointments: async () => mockAppointments,
  getHistory: async () => mockAppointmentHistory,
  createRequest: async (request) => createMockRequest(request),
};
