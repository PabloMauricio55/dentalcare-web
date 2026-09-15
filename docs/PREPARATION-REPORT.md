# Informe de preparación

> Documento histórico de la preparación inicial. Describe el estado anterior a la implementación y no debe utilizarse como guía del estado actual. Consultar `README.md`, `docs/ARCHITECTURE.md`, `docs/ROUTES.md` y `docs/MODULES.md` para la información vigente al 2026-09-10.

## Inspección inicial

Solo existía README.md, en main, con árbol de trabajo limpio.
No había Next.js, App Router operativo, TypeScript, src, rutas, componentes, código funcional, estilos, configuración, dependencias o aliases.
README.md conserva su título y descripción originales y amplía la guía de colaboración.
La consulta de Issues falló por conexión al proxy; no se verificaron referencias ni asignaciones.

## Árbol final completo

Incluye todos los archivos del proyecto; excluye únicamente los metadatos internos de .git.

```text
dentalcare-web/
├── .github/
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── AGENTS.md
├── README.md
├── docs/
│   ├── API-CONTRACTS.md
│   ├── ARCHITECTURE.md
│   ├── BRANCHING.md
│   ├── COMPONENTS.md
│   ├── CONVENTIONS.md
│   ├── GITHUB-WORKFLOW.md
│   ├── MODULES.md
│   ├── PERMISSIONS.md
│   ├── PREPARATION-REPORT.md
│   └── ROUTES.md
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── activar-cuenta/
│   │   │   │   └── .gitkeep
│   │   │   ├── login/
│   │   │   │   └── .gitkeep
│   │   │   └── recuperar-password/
│   │   │       └── .gitkeep
│   │   ├── (patient)/
│   │   │   └── portal/
│   │   │       ├── citas/
│   │   │       │   └── solicitar/
│   │   │       │       └── .gitkeep
│   │   │       ├── historial/
│   │   │       │   └── .gitkeep
│   │   │       ├── pagos/
│   │   │       │   └── .gitkeep
│   │   │       ├── perfil/
│   │   │       │   └── .gitkeep
│   │   │       ├── recetas/
│   │   │       │   └── .gitkeep
│   │   │       ├── recibos/
│   │   │       │   └── .gitkeep
│   │   │       └── tratamientos/
│   │   │           └── .gitkeep
│   │   ├── (private)/
│   │   │   ├── agenda/
│   │   │   │   └── .gitkeep
│   │   │   ├── caja/
│   │   │   │   ├── pagos/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── recibos/
│   │   │   │       └── .gitkeep
│   │   │   ├── configuracion/
│   │   │   │   ├── auditoria/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── clinica/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── roles/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── usuarios/
│   │   │   │       └── .gitkeep
│   │   │   ├── dashboard/
│   │   │   │   └── .gitkeep
│   │   │   ├── esterilizacion/
│   │   │   │   └── .gitkeep
│   │   │   ├── expediente/
│   │   │   │   └── [patientId]/
│   │   │   │       └── odontograma/
│   │   │   │           └── .gitkeep
│   │   │   ├── inventario/
│   │   │   │   ├── compras/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── consumibles/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── instrumental/
│   │   │   │       └── .gitkeep
│   │   │   ├── pacientes/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── nuevo/
│   │   │   │       └── .gitkeep
│   │   │   ├── reportes/
│   │   │   │   └── .gitkeep
│   │   │   └── tratamientos/
│   │   │       └── .gitkeep
│   │   └── (public)/
│   │       ├── contacto/
│   │       │   └── .gitkeep
│   │       ├── emergencias/
│   │       │   └── .gitkeep
│   │       ├── profesionales/
│   │       │   └── .gitkeep
│   │       ├── servicios/
│   │       │   └── .gitkeep
│   │       └── sucursales/
│   │           └── .gitkeep
│   ├── modules/
│   │   ├── appointments/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── billing/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── clinical-records/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── inventory/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── medical-history/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── patients/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── public-catalog/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── settings/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   ├── sterilization/
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── constants/
│   │   │   │   └── .gitkeep
│   │   │   ├── dtos/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── mappers/
│   │   │   │   └── .gitkeep
│   │   │   ├── models/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   ├── types/
│   │   │   │   └── .gitkeep
│   │   │   └── validation/
│   │   │       └── .gitkeep
│   │   └── treatments/
│   │       ├── components/
│   │       │   └── .gitkeep
│   │       ├── constants/
│   │       │   └── .gitkeep
│   │       ├── dtos/
│   │       │   └── .gitkeep
│   │       ├── hooks/
│   │       │   └── .gitkeep
│   │       ├── mappers/
│   │       │   └── .gitkeep
│   │       ├── models/
│   │       │   └── .gitkeep
│   │       ├── services/
│   │       │   └── .gitkeep
│   │       ├── types/
│   │       │   └── .gitkeep
│   │       └── validation/
│   │           └── .gitkeep
│   ├── providers/
│   │   └── .gitkeep
│   └── shared/
│       ├── components/
│       │   ├── data-display/
│       │   │   └── .gitkeep
│       │   ├── feedback/
│       │   │   └── .gitkeep
│       │   ├── forms/
│       │   │   └── .gitkeep
│       │   ├── navigation/
│       │   │   └── .gitkeep
│       │   ├── tables/
│       │   │   └── .gitkeep
│       │   └── ui/
│       │       └── .gitkeep
│       ├── constants/
│       │   └── .gitkeep
│       ├── hooks/
│       │   └── .gitkeep
│       ├── layouts/
│       │   └── .gitkeep
│       ├── lib/
│       │   └── .gitkeep
│       ├── mocks/
│       │   └── .gitkeep
│       ├── styles/
│       │   └── .gitkeep
│       ├── types/
│       │   └── .gitkeep
│       └── validation/
│           └── .gitkeep
└── team/
    ├── integrante-1/
    │   ├── AGENT.md
    │   ├── SCOPE.md
    │   └── TASKS.md
    ├── integrante-2/
    │   ├── AGENT.md
    │   ├── SCOPE.md
    │   └── TASKS.md
    ├── integrante-3/
    │   ├── AGENT.md
    │   ├── SCOPE.md
    │   └── TASKS.md
    └── integrante-4/
        ├── AGENT.md
        ├── SCOPE.md
        └── TASKS.md
```

## Archivos creados

- .github/CODEOWNERS
- .github/PULL_REQUEST_TEMPLATE.md
- AGENTS.md
- docs/API-CONTRACTS.md
- docs/ARCHITECTURE.md
- docs/BRANCHING.md
- docs/COMPONENTS.md
- docs/CONVENTIONS.md
- docs/GITHUB-WORKFLOW.md
- docs/MODULES.md
- docs/PERMISSIONS.md
- docs/PREPARATION-REPORT.md
- docs/ROUTES.md
- src/app/(auth)/activar-cuenta/.gitkeep
- src/app/(auth)/login/.gitkeep
- src/app/(auth)/recuperar-password/.gitkeep
- src/app/(patient)/portal/citas/solicitar/.gitkeep
- src/app/(patient)/portal/historial/.gitkeep
- src/app/(patient)/portal/pagos/.gitkeep
- src/app/(patient)/portal/perfil/.gitkeep
- src/app/(patient)/portal/recetas/.gitkeep
- src/app/(patient)/portal/recibos/.gitkeep
- src/app/(patient)/portal/tratamientos/.gitkeep
- src/app/(private)/agenda/.gitkeep
- src/app/(private)/caja/pagos/.gitkeep
- src/app/(private)/caja/recibos/.gitkeep
- src/app/(private)/configuracion/auditoria/.gitkeep
- src/app/(private)/configuracion/clinica/.gitkeep
- src/app/(private)/configuracion/roles/.gitkeep
- src/app/(private)/configuracion/usuarios/.gitkeep
- src/app/(private)/dashboard/.gitkeep
- src/app/(private)/esterilizacion/.gitkeep
- src/app/(private)/expediente/[patientId]/odontograma/.gitkeep
- src/app/(private)/inventario/compras/.gitkeep
- src/app/(private)/inventario/consumibles/.gitkeep
- src/app/(private)/inventario/instrumental/.gitkeep
- src/app/(private)/pacientes/[id]/.gitkeep
- src/app/(private)/pacientes/nuevo/.gitkeep
- src/app/(private)/reportes/.gitkeep
- src/app/(private)/tratamientos/.gitkeep
- src/app/(public)/contacto/.gitkeep
- src/app/(public)/emergencias/.gitkeep
- src/app/(public)/profesionales/.gitkeep
- src/app/(public)/servicios/.gitkeep
- src/app/(public)/sucursales/.gitkeep
- src/modules/appointments/components/.gitkeep
- src/modules/appointments/constants/.gitkeep
- src/modules/appointments/dtos/.gitkeep
- src/modules/appointments/hooks/.gitkeep
- src/modules/appointments/mappers/.gitkeep
- src/modules/appointments/models/.gitkeep
- src/modules/appointments/services/.gitkeep
- src/modules/appointments/types/.gitkeep
- src/modules/appointments/validation/.gitkeep
- src/modules/auth/components/.gitkeep
- src/modules/auth/constants/.gitkeep
- src/modules/auth/dtos/.gitkeep
- src/modules/auth/hooks/.gitkeep
- src/modules/auth/mappers/.gitkeep
- src/modules/auth/models/.gitkeep
- src/modules/auth/services/.gitkeep
- src/modules/auth/types/.gitkeep
- src/modules/auth/validation/.gitkeep
- src/modules/billing/components/.gitkeep
- src/modules/billing/constants/.gitkeep
- src/modules/billing/dtos/.gitkeep
- src/modules/billing/hooks/.gitkeep
- src/modules/billing/mappers/.gitkeep
- src/modules/billing/models/.gitkeep
- src/modules/billing/services/.gitkeep
- src/modules/billing/types/.gitkeep
- src/modules/billing/validation/.gitkeep
- src/modules/clinical-records/components/.gitkeep
- src/modules/clinical-records/constants/.gitkeep
- src/modules/clinical-records/dtos/.gitkeep
- src/modules/clinical-records/hooks/.gitkeep
- src/modules/clinical-records/mappers/.gitkeep
- src/modules/clinical-records/models/.gitkeep
- src/modules/clinical-records/services/.gitkeep
- src/modules/clinical-records/types/.gitkeep
- src/modules/clinical-records/validation/.gitkeep
- src/modules/inventory/components/.gitkeep
- src/modules/inventory/constants/.gitkeep
- src/modules/inventory/dtos/.gitkeep
- src/modules/inventory/hooks/.gitkeep
- src/modules/inventory/mappers/.gitkeep
- src/modules/inventory/models/.gitkeep
- src/modules/inventory/services/.gitkeep
- src/modules/inventory/types/.gitkeep
- src/modules/inventory/validation/.gitkeep
- src/modules/medical-history/components/.gitkeep
- src/modules/medical-history/constants/.gitkeep
- src/modules/medical-history/dtos/.gitkeep
- src/modules/medical-history/hooks/.gitkeep
- src/modules/medical-history/mappers/.gitkeep
- src/modules/medical-history/models/.gitkeep
- src/modules/medical-history/services/.gitkeep
- src/modules/medical-history/types/.gitkeep
- src/modules/medical-history/validation/.gitkeep
- src/modules/patients/components/.gitkeep
- src/modules/patients/constants/.gitkeep
- src/modules/patients/dtos/.gitkeep
- src/modules/patients/hooks/.gitkeep
- src/modules/patients/mappers/.gitkeep
- src/modules/patients/models/.gitkeep
- src/modules/patients/services/.gitkeep
- src/modules/patients/types/.gitkeep
- src/modules/patients/validation/.gitkeep
- src/modules/public-catalog/components/.gitkeep
- src/modules/public-catalog/constants/.gitkeep
- src/modules/public-catalog/dtos/.gitkeep
- src/modules/public-catalog/hooks/.gitkeep
- src/modules/public-catalog/mappers/.gitkeep
- src/modules/public-catalog/models/.gitkeep
- src/modules/public-catalog/services/.gitkeep
- src/modules/public-catalog/types/.gitkeep
- src/modules/public-catalog/validation/.gitkeep
- src/modules/reports/components/.gitkeep
- src/modules/reports/constants/.gitkeep
- src/modules/reports/dtos/.gitkeep
- src/modules/reports/hooks/.gitkeep
- src/modules/reports/mappers/.gitkeep
- src/modules/reports/models/.gitkeep
- src/modules/reports/services/.gitkeep
- src/modules/reports/types/.gitkeep
- src/modules/reports/validation/.gitkeep
- src/modules/settings/components/.gitkeep
- src/modules/settings/constants/.gitkeep
- src/modules/settings/dtos/.gitkeep
- src/modules/settings/hooks/.gitkeep
- src/modules/settings/mappers/.gitkeep
- src/modules/settings/models/.gitkeep
- src/modules/settings/services/.gitkeep
- src/modules/settings/types/.gitkeep
- src/modules/settings/validation/.gitkeep
- src/modules/sterilization/components/.gitkeep
- src/modules/sterilization/constants/.gitkeep
- src/modules/sterilization/dtos/.gitkeep
- src/modules/sterilization/hooks/.gitkeep
- src/modules/sterilization/mappers/.gitkeep
- src/modules/sterilization/models/.gitkeep
- src/modules/sterilization/services/.gitkeep
- src/modules/sterilization/types/.gitkeep
- src/modules/sterilization/validation/.gitkeep
- src/modules/treatments/components/.gitkeep
- src/modules/treatments/constants/.gitkeep
- src/modules/treatments/dtos/.gitkeep
- src/modules/treatments/hooks/.gitkeep
- src/modules/treatments/mappers/.gitkeep
- src/modules/treatments/models/.gitkeep
- src/modules/treatments/services/.gitkeep
- src/modules/treatments/types/.gitkeep
- src/modules/treatments/validation/.gitkeep
- src/providers/.gitkeep
- src/shared/components/data-display/.gitkeep
- src/shared/components/feedback/.gitkeep
- src/shared/components/forms/.gitkeep
- src/shared/components/navigation/.gitkeep
- src/shared/components/tables/.gitkeep
- src/shared/components/ui/.gitkeep
- src/shared/constants/.gitkeep
- src/shared/hooks/.gitkeep
- src/shared/layouts/.gitkeep
- src/shared/lib/.gitkeep
- src/shared/mocks/.gitkeep
- src/shared/styles/.gitkeep
- src/shared/types/.gitkeep
- src/shared/validation/.gitkeep
- team/integrante-1/AGENT.md
- team/integrante-1/SCOPE.md
- team/integrante-1/TASKS.md
- team/integrante-2/AGENT.md
- team/integrante-2/SCOPE.md
- team/integrante-2/TASKS.md
- team/integrante-3/AGENT.md
- team/integrante-3/SCOPE.md
- team/integrante-3/TASKS.md
- team/integrante-4/AGENT.md
- team/integrante-4/SCOPE.md
- team/integrante-4/TASKS.md

## Archivos modificados

- README.md: se conserva el contenido original y se añade documentación.

## Archivos existentes conservados

- README.md: único archivo de proyecto existente; título y descripción conservados.
- Metadatos .git: no se realizan operaciones de ramas, commits, push, merge o rebase.

## Validación

- Todos los archivos nuevos son Markdown, CODEOWNERS comentado o .gitkeep vacío.
- No se implementó ningún Issue.
- No se inventaron endpoints ni contratos.
- No se eliminó código funcional; inicialmente no existía.
- Las carpetas nuevas de módulos están vacías salvo .gitkeep.
- GitHub Issues continúa siendo la fuente oficial.
- No hay package.json: lint/build no están disponibles y no se ejecutan para evitar generar archivos de herramientas fuera del alcance.
- Limitación previa: repositorio sin aplicación ni scripts. No hay errores previos de compilación medidos.
- No se añadió código ejecutable; no hay resultados de compilación que permitan afirmar que una aplicación compila.
- No se crean ramas, commits, push ni merge.

La validación final de estructura y git status se comunica al entregar el trabajo.
