import type { InventoryProtocolCategory } from "@/modules/inventory/models/inventory.model";

export type CreateProtocolDto = {
  code: string;
  name: string;
  category: InventoryProtocolCategory | "";
  responsible: string;
  description: string;
};
