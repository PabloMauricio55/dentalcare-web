# Módulos por dominio

| Módulo | Propósito | Estado al 2026-09-30 |
| --- | --- | --- |
| `auth` | Autenticación | Base visual preparada |
| `public-catalog` | Web pública | Base visual preparada |
| `patients` | Pacientes y ficha administrativa | Implementado en #4 |
| `appointments` | Panel, agenda, solicitudes, espera y atenciones | Agenda, atenciones programadas e indicadores compatibles conectados a `dentalcare-api`; solicitudes y espera pendientes de contrato |
| `settings` | Usuarios, roles, clínica, catálogos y auditoría | Implementado en #5 |
| `medical-history` | Antecedentes clínicos | Estructura preparada |
| `clinical-records` | Expediente clínico | Estructura preparada |
| `treatments` | Tratamientos | Pantalla temporal |
| `billing` | Caja y pagos | Pantalla temporal |
| `inventory` | Inventario | Pantalla temporal |
| `sterilization` | Esterilización | Pantalla temporal |
| `reports` | Reportes | Pantalla temporal |

Los módulos implementados usan `models`, `dtos`, `adapters`, `services`, `components` y `mocks` cuando todavía no existe contrato real. La agenda administrativa ya consulta y modifica citas mediante `dentalcare-api`; el resto continúa migrándose por ticket.

La propiedad de un módulo no autoriza a desarrollar requisitos que no estén incluidos en el Issue vigente. Las dependencias entre dominios deben coordinarse con el responsable correspondiente.
