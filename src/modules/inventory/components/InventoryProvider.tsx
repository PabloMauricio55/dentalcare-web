"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CreateConsumableDto } from "@/modules/inventory/dtos/create-consumable.dto";
import type { CreateInstrumentDto } from "@/modules/inventory/dtos/create-instrument.dto";
import type { CreatePurchaseDto } from "@/modules/inventory/dtos/create-purchase.dto";
import type { CreateSupplierDto } from "@/modules/inventory/dtos/create-supplier.dto";
import { initialConsumables } from "@/modules/inventory/mocks/inventory-consumables";
import { initialInstruments } from "@/modules/inventory/mocks/inventory-instruments";
import { initialInventoryMovements } from "@/modules/inventory/mocks/inventory-movements";
import { initialPurchases } from "@/modules/inventory/mocks/inventory-purchases";
import { initialSuppliers } from "@/modules/inventory/mocks/inventory-suppliers";
import type { Consumable, InventoryInstrument, InventoryMovement, Purchase, Supplier } from "@/modules/inventory/models/inventory.model";
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
  suppliers: Supplier[];
  addSupplier: (dto: CreateSupplierDto) => void;
  updateSupplier: (id: string, dto: CreateSupplierDto) => void;
  deactivateSupplier: (id: string) => void;
  purchases: Purchase[];
  addPurchase: (dto: CreatePurchaseDto) => void;
  receivePurchase: (id: string) => boolean;
  movements: InventoryMovement[];
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [consumables, setConsumables] = useState(initialConsumables);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [movements, setMovements] = useState<InventoryMovement[]>(initialInventoryMovements);

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
    suppliers,
    addSupplier: (dto) => {
      setSuppliers((current) => [...current, inventoryService.createSupplier(dto)]);
    },
    updateSupplier: (id, dto) => {
      setSuppliers((current) => current.map((item) => item.id === id ? { ...item, ...dto } : item));
    },
    deactivateSupplier: (id) => {
      setSuppliers((current) => current.map((item) => item.id === id ? { ...item, active: false } : item));
    },
    purchases,
    addPurchase: (dto) => {
      setPurchases((current) => [...current, inventoryService.createPurchase(dto)]);
    },
    receivePurchase: (id) => {
      const purchase = purchases.find((item) => item.id === id);
      if (!purchase) return false;
      const result = inventoryService.receivePurchase(purchase, consumables);
      if (!result) return false;

      setPurchases((current) => current.map((item) => item.id === id ? result.purchase : item));
      setConsumables(result.consumables);
      setMovements((current) => [...current, ...result.movements]);
      return true;
    },
    movements,
  }), [consumables, instruments, movements, purchases, suppliers]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
