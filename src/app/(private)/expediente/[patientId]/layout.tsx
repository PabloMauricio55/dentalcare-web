import type { ReactNode } from 'react';
import { ClinicalRecordProvider } from '@/modules/clinical-records/components/ClinicalRecordProvider';

type ClinicalRecordLayoutProps = {
  children: ReactNode;
  params: Promise<{ patientId: string }>;
};

export default async function ClinicalRecordLayout({
  children,
  params,
}: ClinicalRecordLayoutProps) {
  const { patientId } = await params;

  return (
    <ClinicalRecordProvider patientId={patientId}>
      {children}
    </ClinicalRecordProvider>
  );
}