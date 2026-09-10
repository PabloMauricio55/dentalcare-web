# Alcance - Integrante 1

Nombre y username: no verificados.

## Rama individual prevista

feature/integrante-1. No creada en esta preparación.

## Áreas

Pública, autenticación y portal del paciente.

## Módulos permitidos

- src/modules/public-catalog/**
- src/modules/auth/**

## Rutas permitidas

- src/app/(public)/**
- src/app/(auth)/**
- src/app/(patient)/**

## Responsabilidades y límites

Trabajar únicamente en Issues asignados al integrante y dentro de este alcance.
Tener acceso a un módulo no significa implementar todas sus funcionalidades. Solo implementar lo solicitado por el Issue actual.
No modificar módulos ajenos: detenerse e informar dependencia, módulo e integrante involucrado.
La distribución es inicial; GitHub prevalece en asignaciones. No se pudieron verificar las asignaciones remotas; las discrepancias quedan pendientes de revisión humana, sin modificar GitHub.
Dashboard no está asignado. Coordinar antes de intervenir.
El portal puede requerir pacientes, citas, historial, tratamientos o caja; esto no permite modificar los módulos de sus responsables. Detener cambios fuera del alcance e informar la dependencia.

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
