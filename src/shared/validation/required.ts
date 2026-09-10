export function isRequired(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
}
