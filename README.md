# dentalcare-web
Frontend de DentalCare: web pública, portal del paciente y sistema privado de la clínica.

## Estado y stack objetivo

Preparación organizativa para cuatro integrantes. Stack objetivo: Next.js, App Router y TypeScript; colaboración mediante GitHub Issues, ramas individuales y Codex.
El repositorio inicial solo tenía este README. No hay framework instalado, versión definida, dependencias, aliases ni aplicación funcional.

## Instalación y ejecución

Actualmente no se puede instalar o ejecutar la aplicación: no existe package.json.
Inicializar el framework, TypeScript, aliases, dependencias y scripts requiere una tarea posterior respaldada por un Issue y la autorización correspondiente.
Cuando existan package.json y package-lock.json coherentes, el flujo previsto es npm ci para instalar, npm run dev para desarrollar y npm run lint / npm run build para validar, verificando primero los scripts reales.
Esta preparación no instala dependencias ni crea configuración.

## Arquitectura y estructura

- src/app: Route Groups (public), (auth), (patient) y (private).
- src/modules: dominios con capas vacías salvo .gitkeep.
- src/shared: components, layouts, hooks, lib, mocks, types, constants, validation y styles.
- src/providers: espacio futuro para providers.
- team/integrante-1 a integrante-4: AGENT.md, SCOPE.md y TASKS.md.
- docs: arquitectura y colaboración.
- .github: plantilla de PR y CODEOWNERS comentado.

Módulos: auth, public-catalog, patients, appointments, medical-history, clinical-records, treatments, sterilization, inventory, billing, reports y settings.
No se crean páginas, layout.tsx, globals.css ni middleware.ts ficticios.

## Trabajo en equipo

Los GitHub Issues son la fuente oficial de tareas, requerimientos, criterios, asignaciones, prioridades y estado.
TASKS.md es solo un índice. Consultar siempre el Issue actualizado.
Flujo: Issue → asignación → feature/integrante-X → PR → test → pruebas de integración → PR → main.
main es estable; test integra. Ramas individuales previstas: feature/integrante-1, feature/integrante-2, feature/integrante-3 y feature/integrante-4.
No se han creado ramas en esta preparación. No desarrollar directamente en main ni usar feature → main como flujo normal.

Antes de trabajar, indicar «Soy el integrante X y trabajaré el Issue #N», leer [AGENTS.md](AGENTS.md) y los documentos de alcance.
Respetar módulos ajenos, advertir cambios compartidos y no hacer commit/push/merge automáticamente.
La distribución inicial debe contrastarse con GitHub; no se pudieron verificar Issues ni asignaciones por un fallo de conexión.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Módulos](docs/MODULES.md)
- [Rutas](docs/ROUTES.md)
- [Ramas](docs/BRANCHING.md)
- [Convenciones](docs/CONVENTIONS.md)
- [Componentes](docs/COMPONENTS.md)
- [Contratos de API](docs/API-CONTRACTS.md)
- [Permisos](docs/PERMISSIONS.md)
- [Flujo GitHub](docs/GITHUB-WORKFLOW.md)
- [Árbol completo e inventario](docs/PREPARATION-REPORT.md)
