# Módulos por dominio

Los propósitos delimitan áreas; no añaden requerimientos ni autorizan implementación.

| Módulo | Propósito | Integrante inicial |
| --- | --- | --- |
| auth | Autenticación | 1 |
| public-catalog | Catálogo y área pública | 1 |
| patients | Pacientes | 2 |
| appointments | Agenda y citas | 2 |
| settings | Configuración | 2 |
| medical-history | Historia clínica | 3 |
| clinical-records | Expediente clínico | 3 |
| sterilization | Esterilización | 3 |
| treatments | Tratamientos | 3 |
| inventory | Inventario | 4 |
| billing | Caja, pagos y recibos | 4 |
| reports | Reportes | 4 |

Cada módulo contiene components, dtos, hooks, mappers, models, services, types, validation y constants, vacíos salvo .gitkeep.
No hay index.ts ni ejemplos. Las responsabilidades precisas de historia y expediente deben verificarse en los Issues para evitar duplicación.
GitHub prevalece en asignaciones; las discrepancias requieren revisión humana sin modificar Issues.
Las dependencias del portal hacia otros dominios requieren coordinación con sus responsables.
