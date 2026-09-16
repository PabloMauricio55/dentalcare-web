import { EmptyState } from "@/shared/components/feedback/EmptyState";

type SectionUnderConstructionProps = {
  label: string;
};

export function SectionUnderConstruction({ label }: SectionUnderConstructionProps) {
  return (
    <div className="page-stack">
      <EmptyState
        title={`${label} en construcción`}
        description="Esta sección del expediente estará disponible próximamente."
      />
    </div>
  );
}
