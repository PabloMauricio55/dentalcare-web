"use client";

import { Search, X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="search-input">
      <Search size={19} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {value && <button onClick={() => onChange("")} type="button" aria-label="Limpiar búsqueda"><X size={17} /></button>}
    </label>
  );
}
