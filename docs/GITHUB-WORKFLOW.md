# Trabajo con GitHub

Los GitHub Issues son la fuente oficial de requerimientos, criterios de aceptación, responsables, prioridades y estado. Los archivos `TASKS.md` son únicamente un índice; ante cualquier diferencia prevalece el Issue vigente.

## Recorrido de una tarea

`Issue → In progress → rama desde develop → implementación → verificaciones → Pull Request a develop → Ready → revisión → merge`

- Relacionar el Pull Request y los commits con el número real del Issue.
- No trabajar directamente sobre `develop` ni `main`.
- No mezclar módulos ajenos al alcance del ticket.
- Ejecutar como mínimo `npm run lint` y `npm run build` antes de solicitar revisión.
- Documentar los cambios relevantes en los `.md` correspondientes.
- El estado del tablero no reemplaza el estado técnico del Pull Request.

## Entregas de Daniel700392

| Issue | Alcance | Pull Request | Estado |
| --- | --- | --- | --- |
| #1 | Arquitectura, estilos, componentes y layout privado | #14 | Integrado en `develop` |
| #4 | Agenda y gestión de pacientes | #15 | Integrado en `develop` |
| #5 | Usuarios, roles, clínica y auditoría | #16 | Integrado en `develop` |
