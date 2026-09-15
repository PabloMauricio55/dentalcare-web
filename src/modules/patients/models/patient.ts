export type Patient = {
  id: string;
  code: string;
  name: string;
  dpi: string;
  birthDate: string;
  gender: "Femenino" | "Masculino" | "Otro";
  phone: string;
  email: string;
  city: string;
  address: string;
  emergencyContact: string;
  billingName: string;
  nit: string;
  accessStatus: "Activo" | "Pendiente" | "Bloqueado";
  lastVisit: string;
};
