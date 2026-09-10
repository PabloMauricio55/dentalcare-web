export function LoadingState({ rows = 3 }: { rows?: number }) {
  return <div className="loading-state" aria-label="Cargando">{Array.from({ length: rows }).map((_, index) => <div key={index} />)}</div>;
}
