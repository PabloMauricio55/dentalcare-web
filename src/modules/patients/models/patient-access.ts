export type PatientAccessCredentials = {
  patientId: string;
  username: string;
  temporaryPassword: string;
  generatedAt: string;
  operation: "Creación" | "Restablecimiento";
};
