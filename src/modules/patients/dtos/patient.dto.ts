export type CreatePatientDto = {
  name: string;
  dpi: string;
  birthDate: string;
  gender: "Femenino" | "Masculino" | "Otro";
  phone: string;
  email: string;
  city: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  billingName: string;
  nit: string;
  billingAddress: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
};
