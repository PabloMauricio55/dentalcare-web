import type { CatalogItemDto, CreateUserDto } from "../dtos/settings.dto";
import { settingsAdapter } from "../adapters/settings.adapter";

export const settingsService = {
  createUser: (dto: CreateUserDto) => settingsAdapter.userFromDto(dto),
  createCatalogItem: (dto: CatalogItemDto) => settingsAdapter.catalogFromDto(dto),
  temporaryPassword: (() => {
    let sequence = 0;
    return () => {
      sequence += 1;
      const random = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `DC-${random}-${String(sequence).padStart(2, "0")}`;
    };
  })(),
};
