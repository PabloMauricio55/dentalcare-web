export type AdministrativeAppointmentStatusDto = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type AdministrativeAppointmentDto = {
  id: string;
  patient: {
    id: string;
    code: string;
    name: string;
    phone: string;
  };
  professional: {
    id: string;
    fullName: string;
  };
  scheduledAt: string;
  status: AdministrativeAppointmentStatusDto;
  createdAt: string;
  updatedAt: string;
};

export type AdministrativeAppointmentPageDto = {
  content: AdministrativeAppointmentDto[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type CreateAdministrativeAppointmentDto = {
  patientId: string;
  professionalId: string;
  scheduledAt: string;
};

export type RescheduleAdministrativeAppointmentDto = Pick<CreateAdministrativeAppointmentDto, "scheduledAt">;

export type UpdateAdministrativeAppointmentStatusDto = {
  status: "COMPLETED" | "CANCELLED";
};
