"use client";

import { FormEvent, useState } from "react";
import type { CreateSupplierDto } from "@/modules/inventory/dtos/create-supplier.dto";
import type { Supplier } from "@/modules/inventory/models/inventory.model";
import { validateSupplier, type SupplierErrors, type SupplierField } from "@/modules/inventory/validation/supplier.schema";
import { Button } from "@/shared/components";
import styles from "./inventory.module.css";

const emptySupplier: CreateSupplierDto = { name: "", contactName: "", phone: "", email: "" };

type SupplierFormProps = {
  supplier?: Supplier;
  onCancel: () => void;
  onSubmit: (dto: CreateSupplierDto) => void;
};

export function SupplierForm({ supplier, onCancel, onSubmit }: SupplierFormProps) {
  const [values, setValues] = useState<CreateSupplierDto>(supplier ?? emptySupplier);
  const [errors, setErrors] = useState<SupplierErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: SupplierField, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (submitted) setErrors(validateSupplier(nextValues));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateSupplier(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(values);
  };

  const fieldError = (field: SupplierField) => errors[field] && (
    <span className={styles.fieldError} role="alert">{errors[field]}</span>
  );

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <label className="field full">
        <span>Nombre del proveedor *</span>
        <input value={values.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
        {fieldError("name")}
      </label>
      <label className="field">
        <span>Nombre de contacto *</span>
        <input value={values.contactName} onChange={(event) => updateField("contactName", event.target.value)} aria-invalid={Boolean(errors.contactName)} />
        {fieldError("contactName")}
      </label>
      <label className="field">
        <span>Teléfono *</span>
        <input value={values.phone} onChange={(event) => updateField("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} />
        {fieldError("phone")}
      </label>
      <label className="field full">
        <span>Correo electrónico *</span>
        <input type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
        {fieldError("email")}
      </label>
      <div className="modal-form-actions full">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar proveedor</Button>
      </div>
    </form>
  );
}
