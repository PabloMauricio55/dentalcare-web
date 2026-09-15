# Alcance - Integrante 2

Nombre: Daniel (Danjo). Username: `Daniel700392`.

## Ramas

Se utiliza una rama por ticket creada desde `develop`, con el patrón `feature/issue-N-descripcion`.

## Áreas

Agenda, pacientes y configuración.

## Módulos permitidos

- src/modules/appointments/**
- src/modules/patients/**
- src/modules/settings/**

## Rutas permitidas

- src/app/(private)/agenda/**
- src/app/(private)/pacientes/**
- src/app/(private)/configuracion/**

## Responsabilidades y límites

Trabajar únicamente en Issues asignados al integrante y dentro de este alcance.
Tener acceso a un módulo no significa implementar todas sus funcionalidades. Solo implementar lo solicitado por el Issue actual.
No modificar módulos ajenos: detenerse e informar dependencia, módulo e integrante involucrado.
GitHub prevalece en las asignaciones. Los Issues #1, #4 y #5 fueron asignados a `Daniel700392` y ya se integraron en `develop` mediante los Pull Requests #14, #15 y #16.
El Panel de inicio forma parte del alcance verificado del ticket #4.


## Archivos globales que requieren coordinación

- src/shared/**
- src/providers/**
- src/app/layout.tsx
- src/app/globals.css
- src/middleware.ts
- package.json
- package-lock.json
- tsconfig.json
- next.config.*

También coordinar AGENTS.md, documentación común y .github/**.
La lista incluye archivos futuros. Modificarlos solo si el Issue lo exige y advertir previamente el impacto.
