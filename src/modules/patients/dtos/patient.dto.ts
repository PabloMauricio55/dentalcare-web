export type CreatePatientDto = {
  name: string;
  dpi: string;
  birthDate: string;
  gender: "Femenino" | "Masculino" | "Otro";
  phone: string;
  email: string;
  city: string;
  address: string;
};
