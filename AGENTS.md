# Contrato principal para Codex

## Fuente oficial

Los GitHub Issues son la fuente oficial de tareas y requerimientos.

TASKS.md sirve únicamente como guía o índice.

Antes de implementar una tarea se debe consultar siempre el GitHub Issue correspondiente.

Si existe cualquier diferencia entre TASKS.md y el GitHub Issue, prevalece siempre el contenido actual del GitHub Issue.

GitHub determina requerimientos, tickets, descripciones, criterios de aceptación, asignaciones, prioridades y estado.
El Issue define QUÉ hacer; SCOPE.md define DÓNDE trabajar; ARCHITECTURE.md define CÓMO organizarse; AGENTS.md define las REGLAS.

## Lectura obligatoria

Antes de implementar: /AGENTS.md → /docs/ARCHITECTURE.md → /docs/CONVENTIONS.md → /docs/BRANCHING.md → /team/integrante-X/AGENT.md → /team/integrante-X/SCOPE.md → GitHub Issue actualizado.
Leer explícitamente los AGENT.md individuales; su nombre singular no sustituye este contrato raíz.

## Reglas obligatorias

1. No implementar un Issue sin leerlo.
2. No asumir requerimientos no escritos.
3. No modificar módulos de otros integrantes. Si el Issue lo exige, DETENERSE e informar la dependencia, módulo e integrante involucrado.
4. No hacer fetch directamente desde componentes.
5. No colocar lógica compleja en page.tsx.
6. No crear src/dtos, src/models, src/services ni src/mappers globales. Organizar la lógica por módulo.
7. No duplicar componentes shared.
8. No mover archivos entre módulos sin necesidad.
9. No instalar dependencias automáticamente salvo autorización.
10. No utilizar any salvo justificación técnica.
11. No borrar código funcional.
12. No realizar refactors masivos durante un Issue pequeño.
13. Modificar la menor cantidad posible de archivos.
14. No hacer commit automáticamente.
15. No hacer push automáticamente.
16. No hacer merge automáticamente.
17. Nunca desarrollar directamente en main.
18. Antes de modificar archivos compartidos, advertirlo.

## Flujo futuro de Codex

Ante «Soy el integrante 2 y trabajaré el Issue #X»:

1. Identificar al integrante y verificar la rama actual.
2. Completar la lectura obligatoria.
3. Consultar el Issue y verificar asignación y alcance.
4. Inspeccionar el código existente e identificar los archivos necesarios.
5. Mostrar qué archivos se crearán/modificarán; informar antes de tocar archivos compartidos.
6. Implementar únicamente el Issue.
7. Ejecutar lint/build cuando existan y separar errores previos de errores del cambio.
8. Mostrar cambios y esperar instrucciones antes de commit/push/merge.

Si no se puede consultar el Issue, no implementar a partir de TASKS.md.
Si la asignación contradice el alcance, documentar la discrepancia para revisión humana sin modificar GitHub. GitHub prevalece para determinar el asignado.
Tener acceso a un módulo no autoriza a implementar todas sus funcionalidades.
El portal no autoriza al integrante 1 a modificar módulos ajenos.

## Archivos compartidos de alto riesgo de conflicto

- src/shared/**
- src/providers/**
- src/app/layout.tsx
- src/app/globals.css
- src/middleware.ts
- package.json
- package-lock.json
- tsconfig.json
- next.config.*

También coordinar cambios en documentación común, AGENTS.md y .github/**.
La lista incluye archivos futuros. Modificarlos solo si el Issue lo necesita, advirtiendo antes del cambio y explicando el impacto.

## Estado del proyecto

La preparación inicial ya concluyó. El proyecto ejecutable, el layout privado y los componentes compartidos del Issue #1, Agenda y pacientes del Issue #4, y Configuración del Issue #5 están integrados en `develop`.

El desarrollo continúa con una rama por ticket creada desde `develop` y un Pull Request hacia `develop`. Los módulos pendientes conservan pantallas o estructuras temporales que solo debe reemplazar su responsable según el Issue vigente.
