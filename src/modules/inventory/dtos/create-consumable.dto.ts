export type CreateConsumableDto = {
  code: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  expirationDate?: string;
};
