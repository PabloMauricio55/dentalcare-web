import type { CreateSupplierDto } from "@/modules/inventory/dtos/create-supplier.dto";

export type SupplierField = keyof CreateSupplierDto;
export type SupplierErrors = Partial<Record<SupplierField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSupplier(dto: CreateSupplierDto): SupplierErrors {
  const errors: SupplierErrors = {};

  if (!dto.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!dto.contactName.trim()) errors.contactName = "El contacto es obligatorio.";
  if (!dto.phone.trim()) errors.phone = "El teléfono es obligatorio.";
  if (!dto.email.trim()) errors.email = "El correo es obligatorio.";
  else if (!emailPattern.test(dto.email.trim())) errors.email = "Ingresa un correo válido.";

  return errors;
}
