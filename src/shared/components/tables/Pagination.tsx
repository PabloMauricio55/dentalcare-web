"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="pagination">
      <span>Página {page} de {totalPages}</span>
      <div>
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Página siguiente"><ChevronRight size={17} /></button>
      </div>
    </div>
  );
}
