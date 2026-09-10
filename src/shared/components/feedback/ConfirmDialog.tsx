"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "./Modal";

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirmar", danger = false, onConfirm, onClose }: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button></>}>
      <div className="confirm-message"><span><AlertTriangle size={23} /></span><p>{message}</p></div>
    </Modal>
  );
}
