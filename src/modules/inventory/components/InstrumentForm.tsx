"use client";

import { FormEvent, useState } from "react";
import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";
import type { InventoryInstrument } from "@/modules/inventory/models/inventory.model";
import { validateInstrument, type InstrumentErrors, type InstrumentField } from "@/modules/inventory/validation/instrument.schema";
import { Button } from "@/shared/components";
import styles from "./inventory.module.css";

type InstrumentFormValues = Omit<CreateInstrumentDto, "totalQuantity" | "availableQuantity"> & {
  totalQuantity: string;
  availableQuantity: string;
};

const emptyInstrument: InstrumentFormValues = {
  code: "",
  name: "",
  category: "",
  totalQuantity: "0",
  availableQuantity: "0",
  location: "",
};

function getInitialValues(instrument?: InventoryInstrument): InstrumentFormValues {
  if (!instrument) return emptyInstrument;
  return {
    ...instrument,
    totalQuantity: String(instrument.totalQuantity),
    availableQuantity: String(instrument.availableQuantity),
  };
}

function toInstrumentDto(values: InstrumentFormValues): CreateInstrumentDto {
  return {
    ...values,
    totalQuantity: values.totalQuantity.trim() === "" ? Number.NaN : Number(values.totalQuantity),
    availableQuantity: values.availableQuantity.trim() === "" ? Number.NaN : Number(values.availableQuantity),
  };
}

type InstrumentFormProps = {
  instrument?: InventoryInstrument;
  onCancel: () => void;
  onSubmit: (dto: CreateInstrumentDto) => void;
};

export function InstrumentForm({ instrument, onCancel, onSubmit }: InstrumentFormProps) {
  const [values, setValues] = useState<InstrumentFormValues>(() => getInitialValues(instrument));
  const [errors, setErrors] = useState<InstrumentErrors>({});

  const updateField = (field: InstrumentField, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (errors[field] || (field === "totalQuantity" && errors.availableQuantity)) {
      const nextErrors = validateInstrument(toInstrumentDto(nextValues));
      setErrors((current) => ({
        ...current,
        [field]: nextErrors[field],
        ...(field === "totalQuantity" ? { availableQuantity: nextErrors.availableQuantity } : {}),
      }));
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dto = toInstrumentDto(values);
    const nextErrors = validateInstrument(dto);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(dto);
  };

  const fieldError = (field: InstrumentField) => errors[field] && (
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
        <span>Ubicación *</span>
        <input value={values.location} onChange={(event) => updateField("location", event.target.value)} aria-invalid={Boolean(errors.location)} />
        {fieldError("location")}
      </label>
      <label className="field">
        <span>Cantidad total *</span>
        <input type="number" min="0" step="1" value={values.totalQuantity} onChange={(event) => updateField("totalQuantity", event.target.value)} aria-invalid={Boolean(errors.totalQuantity)} />
        {fieldError("totalQuantity")}
      </label>
      <label className="field">
        <span>Unidades disponibles *</span>
        <input type="number" min="0" step="1" value={values.availableQuantity} onChange={(event) => updateField("availableQuantity", event.target.value)} aria-invalid={Boolean(errors.availableQuantity)} />
        {fieldError("availableQuantity")}
      </label>
      <div className="modal-form-actions full">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar instrumento</Button>
      </div>
    </form>
  );
}
