export type CreatePurchaseItemDto = {
  consumableId: string;
  quantity: number;
  unitCost: number;
};

export type CreatePurchaseDto = {
  code: string;
  supplierId: string;
  purchaseDate: string;
  items: CreatePurchaseItemDto[];
};
