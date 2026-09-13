import type { ReactNode } from 'react';
import { ClinicalRecordProvider } from '@/modules/clinical-records/components/ClinicalRecordProvider';
import { ClinicalRecordNavigation } from '@/modules/clinical-records/components/ClinicalRecordNavigation';

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
      <ClinicalRecordNavigation />
      {children}
    </ClinicalRecordProvider>
  );
}