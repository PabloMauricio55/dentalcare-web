"use client";

import { FormEvent, useState } from "react";
import type { CreateProtocolDto } from "@/modules/inventory/dtos/create-protocol.dto";
import type { InventoryProtocol } from "@/modules/inventory/models/inventory.model";
import { validateProtocol, type ProtocolErrors, type ProtocolField } from "@/modules/inventory/validation/protocol.schema";
import { Button } from "@/shared/components";
import styles from "./inventory.module.css";

const emptyProtocol: CreateProtocolDto = {
  code: "",
  name: "",
  category: "",
  responsible: "",
  description: "",
};

type ProtocolFormProps = {
  protocol?: InventoryProtocol;
  onCancel: () => void;
  onSubmit: (dto: CreateProtocolDto) => void;
};

export function ProtocolForm({ protocol, onCancel, onSubmit }: ProtocolFormProps) {
  const [values, setValues] = useState<CreateProtocolDto>(() => protocol ? {
    code: protocol.code,
    name: protocol.name,
    category: protocol.category,
    responsible: protocol.responsible,
    description: protocol.description,
  } : emptyProtocol);
  const [errors, setErrors] = useState<ProtocolErrors>({});

  const updateField = (field: ProtocolField, value: string) => {
    const nextValues = { ...values, [field]: value } as CreateProtocolDto;
    setValues(nextValues);
    if (errors[field]) {
      const nextErrors = validateProtocol(nextValues);
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateProtocol(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(values);
  };

  const fieldError = (field: ProtocolField) => errors[field] && (
    <span className={styles.fieldError} role="alert">{errors[field]}</span>
  );

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <label className="field">
        <span>Código *</span>
        <input value={values.code} onChange={(event) => updateField("code", event.target.value)} aria-invalid={Boolean(errors.code)} />
        {fieldError("code")}
      </label>
      <label className="field">
        <span>Nombre *</span>
        <input value={values.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
        {fieldError("name")}
      </label>
      <label className="field">
        <span>Categoría *</span>
        <select value={values.category} onChange={(event) => updateField("category", event.target.value)} aria-invalid={Boolean(errors.category)}>
          <option value="">Seleccionar categoría</option>
          <option value="receiving">Recepción</option>
          <option value="storage">Almacenamiento</option>
          <option value="replenishment">Reposición</option>
          <option value="expiration_control">Control de vencimientos</option>
        </select>
        {fieldError("category")}
      </label>
      <label className="field">
        <span>Responsable *</span>
        <input value={values.responsible} onChange={(event) => updateField("responsible", event.target.value)} aria-invalid={Boolean(errors.responsible)} />
        {fieldError("responsible")}
      </label>
      <label className="field full">
        <span>Descripción *</span>
        <textarea rows={4} value={values.description} onChange={(event) => updateField("description", event.target.value)} aria-invalid={Boolean(errors.description)} />
        {fieldError("description")}
      </label>
      <div className="modal-form-actions full">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar protocolo</Button>
      </div>
    </form>
  );
}
