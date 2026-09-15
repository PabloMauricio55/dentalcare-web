import type { CatalogItemDto, CreateUserDto } from "../dtos/settings.dto";
import type { CatalogItem, StaffUser } from "../models/settings";

export const settingsAdapter = {
  userFromDto(dto: CreateUserDto): StaffUser { return { ...dto, id: `u${Date.now()}`, status: "Activo", lastAccess: "Nunca" }; },
  catalogFromDto(dto: CatalogItemDto): CatalogItem { return { ...dto, id: `s${Date.now()}`, status: "Activo" }; },
};
