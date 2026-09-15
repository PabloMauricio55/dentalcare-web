"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";
import { initialConsumables } from "@/modules/inventory/mocks/inventory-consumables";
import { initialInstruments } from "@/modules/inventory/mocks/inventory-instruments";
import type { Consumable, InventoryInstrument } from "@/modules/inventory/models/inventory.model";
import { inventoryService } from "@/modules/inventory/services/inventory.service";

type InventoryContextValue = {
  consumables: Consumable[];
  addConsumable: (dto: CreateConsumableDto) => void;
  updateConsumable: (id: string, dto: CreateConsumableDto) => void;
  deactivateConsumable: (id: string) => void;
  instruments: InventoryInstrument[];
  addInstrument: (dto: CreateInstrumentDto) => void;
  updateInstrument: (id: string, dto: CreateInstrumentDto) => void;
  deactivateInstrument: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [consumables, setConsumables] = useState(initialConsumables);
  const [instruments, setInstruments] = useState(initialInstruments);

  const value = useMemo<InventoryContextValue>(() => ({
    consumables,
    addConsumable: (dto) => {
      setConsumables((current) => [...current, inventoryService.createConsumable(dto)]);
    },
    updateConsumable: (id, dto) => {
      setConsumables((current) => current.map((item) => (
        item.id === id ? { ...item, ...dto, expirationDate: dto.expirationDate || undefined } : item
      )));
    },
    deactivateConsumable: (id) => {
      setConsumables((current) => current.map((item) => (
        item.id === id ? { ...item, status: "inactive" } : item
      )));
    },
    instruments,
    addInstrument: (dto) => {
      setInstruments((current) => [...current, inventoryService.createInstrument(dto)]);
    },
    updateInstrument: (id, dto) => {
      setInstruments((current) => current.map((item) => (
        item.id === id ? { ...item, ...dto } : item
      )));
    },
    deactivateInstrument: (id) => {
      setInstruments((current) => current.map((item) => (
        item.id === id ? { ...item, active: false } : item
      )));
    },
  }), [consumables, instruments]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
