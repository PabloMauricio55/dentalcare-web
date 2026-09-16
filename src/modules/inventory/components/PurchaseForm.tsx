"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CreatePurchaseDto } from "@/modules/inventory/dtos/create-purchase.dto";
import type { Consumable, Supplier } from "@/modules/inventory/models/inventory.model";
import { validatePurchase, type PurchaseErrors } from "@/modules/inventory/validation/purchase.schema";
import { formatCurrency } from "@/shared/lib/currency";
import { Button } from "@/shared/components";
import styles from "./inventory.module.css";

type PurchaseItemFormValues = {
  rowId: string;
  consumableId: string;
  quantity: string;
  unitCost: string;
};

type PurchaseFormValues = {
  code: string;
  supplierId: string;
  purchaseDate: string;
  items: PurchaseItemFormValues[];
};

let itemSequence = 0;
function createEmptyItem(): PurchaseItemFormValues {
  itemSequence += 1;
  return { rowId: `purchase-item-${itemSequence}`, consumableId: "", quantity: "1", unitCost: "0" };
}

function toNumber(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function toPurchaseDto(values: PurchaseFormValues): CreatePurchaseDto {
  return {
    code: values.code,
    supplierId: values.supplierId,
    purchaseDate: values.purchaseDate,
    items: values.items.map((item) => ({
      consumableId: item.consumableId,
      quantity: toNumber(item.quantity),
      unitCost: toNumber(item.unitCost),
    })),
  };
}

type PurchaseFormProps = {
  suppliers: Supplier[];
  consumables: Consumable[];
  onCancel: () => void;
  onSubmit: (dto: CreatePurchaseDto) => void;
};

export function PurchaseForm({ suppliers, consumables, onCancel, onSubmit }: PurchaseFormProps) {
  const [values, setValues] = useState<PurchaseFormValues>(() => ({
    code: "",
    supplierId: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    items: [createEmptyItem()],
  }));
  const [errors, setErrors] = useState<PurchaseErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const refreshErrors = (nextValues: PurchaseFormValues) => {
    if (submitted) setErrors(validatePurchase(toPurchaseDto(nextValues)));
  };

  const updateValue = (field: "code" | "supplierId" | "purchaseDate", value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    refreshErrors(nextValues);
  };

  const updateItem = (rowId: string, field: "consumableId" | "quantity" | "unitCost", value: string) => {
    const nextValues = {
      ...values,
      items: values.items.map((item) => item.rowId === rowId ? { ...item, [field]: value } : item),
    };
    setValues(nextValues);
    refreshErrors(nextValues);
  };

  const addItem = () => {
    const nextValues = { ...values, items: [...values.items, createEmptyItem()] };
    setValues(nextValues);
    refreshErrors(nextValues);
  };

  const removeItem = (rowId: string) => {
    const nextValues = { ...values, items: values.items.filter((item) => item.rowId !== rowId) };
    setValues(nextValues);
    refreshErrors(nextValues);
  };

  const total = useMemo(() => values.items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const unitCost = Number(item.unitCost);
    return sum + (Number.isFinite(quantity) && Number.isFinite(unitCost) ? quantity * unitCost : 0);
  }, 0), [values.items]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const dto = toPurchaseDto(values);
    const nextErrors = validatePurchase(dto);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(dto);
  };

  return (
    <form className={styles.purchaseForm} onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="field">
          <span>Código *</span>
          <input value={values.code} onChange={(event) => updateValue("code", event.target.value)} aria-invalid={Boolean(errors.code)} />
          {errors.code && <span className={styles.fieldError} role="alert">{errors.code}</span>}
        </label>
        <label className="field">
          <span>Proveedor *</span>
          <select value={values.supplierId} onChange={(event) => updateValue("supplierId", event.target.value)} aria-invalid={Boolean(errors.supplierId)}>
            <option value="">Seleccionar proveedor</option>
            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
          </select>
          {errors.supplierId && <span className={styles.fieldError} role="alert">{errors.supplierId}</span>}
        </label>
        <label className="field full">
          <span>Fecha de compra *</span>
          <input type="date" value={values.purchaseDate} onChange={(event) => updateValue("purchaseDate", event.target.value)} aria-invalid={Boolean(errors.purchaseDate)} />
          {errors.purchaseDate && <span className={styles.fieldError} role="alert">{errors.purchaseDate}</span>}
        </label>
      </div>

      <div className={styles.purchaseItemsHeader}>
        <div><strong>Consumibles</strong><span>Agrega los materiales incluidos en la compra.</span></div>
        <Button variant="secondary" type="button" onClick={addItem}><Plus size={16} /> Agregar item</Button>
      </div>
      {errors.items && <p className="form-error">{errors.items}</p>}

      <div className={styles.purchaseItems}>
        {values.items.map((item, index) => {
          const itemErrors = errors.itemErrors?.[index];
          return (
            <div className={styles.purchaseItem} key={item.rowId}>
              <label className="field">
                <span>Consumible *</span>
                <select value={item.consumableId} onChange={(event) => updateItem(item.rowId, "consumableId", event.target.value)} aria-invalid={Boolean(itemErrors?.consumableId)}>
                  <option value="">Seleccionar consumible</option>
                  {consumables.map((consumable) => <option key={consumable.id} value={consumable.id}>{consumable.code} · {consumable.name}</option>)}
                </select>
                {itemErrors?.consumableId && <span className={styles.fieldError} role="alert">{itemErrors.consumableId}</span>}
              </label>
              <label className="field">
                <span>Cantidad *</span>
                <input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateItem(item.rowId, "quantity", event.target.value)} aria-invalid={Boolean(itemErrors?.quantity)} />
                {itemErrors?.quantity && <span className={styles.fieldError} role="alert">{itemErrors.quantity}</span>}
              </label>
              <label className="field">
                <span>Costo unitario *</span>
                <input type="number" min="0" step="0.01" value={item.unitCost} onChange={(event) => updateItem(item.rowId, "unitCost", event.target.value)} aria-invalid={Boolean(itemErrors?.unitCost)} />
                {itemErrors?.unitCost && <span className={styles.fieldError} role="alert">{itemErrors.unitCost}</span>}
              </label>
              <Button className={styles.removeItem} variant="ghost" type="button" onClick={() => removeItem(item.rowId)} aria-label={`Eliminar item ${index + 1}`}><Trash2 size={17} /></Button>
            </div>
          );
        })}
      </div>

      <div className={styles.purchaseFormFooter}>
        <p>Total estimado <strong>{formatCurrency(total)}</strong></p>
        <div><Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button><Button type="submit">Guardar compra</Button></div>
      </div>
    </form>
  );
}
