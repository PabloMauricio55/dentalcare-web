import type { CatalogItemDto, CreateUserDto } from "../dtos/settings.dto";
import { settingsAdapter } from "../adapters/settings.adapter";

export const settingsService = {
  createUser: (dto: CreateUserDto) => settingsAdapter.userFromDto(dto),
  createCatalogItem: (dto: CatalogItemDto) => settingsAdapter.catalogFromDto(dto),
  temporaryPassword: () => `DC-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
};
