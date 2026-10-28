"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

let openModalCount = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";

export function Modal({ open, title, description, children, footer, onClose }: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    if (openModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    openModalCount += 1;

    return () => {
      openModalCount = Math.max(0, openModalCount - 1);

      if (openModalCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
      }
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><h3>{title}</h3>{description && <p>{description}</p>}</div><button onClick={onClose} aria-label="Cerrar"><X /></button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </section>
    </div>
  );
}
