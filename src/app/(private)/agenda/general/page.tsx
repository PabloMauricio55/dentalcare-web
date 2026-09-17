import { GeneralAgendaView } from "@/modules/appointments/components/GeneralAgendaView";

export default async function Page({ searchParams }: { searchParams: Promise<{ patientId?: string; firstAppointment?: string }> }) {
  const params = await searchParams;
  return <GeneralAgendaView initialPatientId={params.patientId} openSchedule={params.firstAppointment === "1"} />;
}
