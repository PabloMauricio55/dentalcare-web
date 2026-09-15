"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import { initialConsumables } from "@/modules/inventory/mocks/inventory-consumables";
import type { Consumable } from "@/modules/inventory/models/inventory.model";
import { inventoryService } from "@/modules/inventory/services/inventory.service";

type InventoryContextValue = {
  consumables: Consumable[];
  addConsumable: (dto: CreateConsumableDto) => void;
  updateConsumable: (id: string, dto: CreateConsumableDto) => void;
  deactivateConsumable: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [consumables, setConsumables] = useState(initialConsumables);

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
  }), [consumables]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
