"use client";

import { FormEvent, useState } from "react";
import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { Consumable } from "@/modules/inventory/models/inventory.model";
import { validateConsumable, type ConsumableErrors, type ConsumableField } from "@/modules/inventory/validation/consumable.schema";
import { Button } from "@/shared/components";
import styles from "./inventory.module.css";

type ConsumableFormValues = Omit<CreateConsumableDto, "currentStock" | "minimumStock"> & {
  currentStock: string;
  minimumStock: string;
};

const emptyConsumable: ConsumableFormValues = {
  code: "",
  name: "",
  category: "",
  unit: "",
  currentStock: "0",
  minimumStock: "0",
  expirationDate: "",
};

function getInitialValues(consumable?: Consumable): ConsumableFormValues {
  if (!consumable) return emptyConsumable;
  return {
    ...consumable,
    currentStock: String(consumable.currentStock),
    minimumStock: String(consumable.minimumStock),
    expirationDate: consumable.expirationDate ?? "",
  };
}

function toConsumableDto(values: ConsumableFormValues): CreateConsumableDto {
  return {
    ...values,
    currentStock: values.currentStock.trim() === "" ? Number.NaN : Number(values.currentStock),
    minimumStock: values.minimumStock.trim() === "" ? Number.NaN : Number(values.minimumStock),
    expirationDate: values.expirationDate || undefined,
  };
}

type ConsumableFormProps = {
  consumable?: Consumable;
  onCancel: () => void;
  onSubmit: (dto: CreateConsumableDto) => void;
};

export function ConsumableForm({ consumable, onCancel, onSubmit }: ConsumableFormProps) {
  const [values, setValues] = useState<ConsumableFormValues>(() => getInitialValues(consumable));
  const [errors, setErrors] = useState<ConsumableErrors>({});

  const updateField = (field: ConsumableField, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (errors[field]) {
      const nextErrors = validateConsumable(toConsumableDto(nextValues));
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dto = toConsumableDto(values);
    const nextErrors = validateConsumable(dto);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(dto);
  };

  const fieldError = (field: ConsumableField) => errors[field] && (
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
        <input value={values.category} onChange={(event) => updateField("category", event.target.value)} aria-invalid={Boolean(errors.category)} />
        {fieldError("category")}
      </label>
      <label className="field">
        <span>Unidad *</span>
        <input value={values.unit} onChange={(event) => updateField("unit", event.target.value)} aria-invalid={Boolean(errors.unit)} />
        {fieldError("unit")}
      </label>
      <label className="field">
        <span>Existencia actual *</span>
        <input type="number" min="0" value={values.currentStock} onChange={(event) => updateField("currentStock", event.target.value)} aria-invalid={Boolean(errors.currentStock)} />
        {fieldError("currentStock")}
      </label>
      <label className="field">
        <span>Existencia mínima *</span>
        <input type="number" min="0" value={values.minimumStock} onChange={(event) => updateField("minimumStock", event.target.value)} aria-invalid={Boolean(errors.minimumStock)} />
        {fieldError("minimumStock")}
      </label>
      <label className="field full">
        <span>Fecha de vencimiento</span>
        <input type="date" value={values.expirationDate ?? ""} onChange={(event) => updateField("expirationDate", event.target.value)} />
      </label>
      <div className="modal-form-actions full">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar consumible</Button>
      </div>
    </form>
  );
}
