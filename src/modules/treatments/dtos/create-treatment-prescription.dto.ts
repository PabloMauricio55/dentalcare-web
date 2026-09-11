export type CreatePrescriptionMedicationDto = {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  notes: string;
};

export type CreateTreatmentPrescriptionDto = {
  patientId: string;
  treatmentPlanId: string;
  procedureRecordId: string;
  professional: string;
  instructions: {
    generalCare: string;
    recommendations: string;
    restrictions: string;
    nextControl: string;
    observations: string;
  };
  medications: CreatePrescriptionMedicationDto[];
};
