# Convenciones futuras

| Elemento | Convención | Ejemplo documental |
| --- | --- | --- |
| Componentes | PascalCase | PatientForm.tsx |
| Hooks | useCamelCase | usePatients.ts |
| Services | singular.service.ts | patient.service.ts |
| DTO | operación-entidad.dto.ts | create-patient.dto.ts |
| Models | singular.model.ts | patient.model.ts |
| Mappers | singular.mapper.ts | patient.mapper.ts |
| Validation | singular.schema.ts | patient.schema.ts |

Imports: @/modules/..., @/shared/... y @/providers/...
Evitar imports relativos profundos como ../../../../.
El alias @/ apunta a src mediante la configuración de TypeScript.
No usar any sin justificación técnica, hacer fetch desde componentes ni colocar lógica compleja en page.tsx.
Organizar DTOs, models, services y mappers por módulo, sin carpetas globales equivalentes.
