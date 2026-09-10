const tones: Record<string, string> = {
  confirmada: "blue",
  pendiente: "amber",
  solicitada: "neutral",
  "en espera": "amber",
  "en atención": "teal",
  atendida: "green",
  activo: "green",
  inactivo: "neutral",
  cancelada: "red",
  rechazado: "red",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = tones[status.toLowerCase()] ?? "neutral";
  return <span className={`status-badge status-${tone}`}><i />{status}</span>;
}
