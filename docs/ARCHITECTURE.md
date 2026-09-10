# Arquitectura

## Estado actual

DentalCare Web es una aplicación ejecutable construida con Next.js 16, React 19 y TypeScript. Utiliza App Router, datos simulados y persistencia temporal durante la sesión; todavía no consume un backend.

## Organización

- `src/app`: rutas, layouts y composición de las pantallas.
- `src/modules`: funcionalidad separada por dominio.
- `src/shared`: componentes, layouts, tipos y utilidades reutilizables.
- `src/providers`: estado global que deba compartirse entre dominios.
- `team`: alcance y reglas particulares de cada integrante.
- `docs`: acuerdos técnicos y estado del proyecto.

Los grupos `(public)`, `(auth)`, `(patient)` y `(private)` organizan las rutas sin aparecer en la URL. El layout privado aporta la barra lateral, el encabezado, la navegación, el selector simulado de rol y el área principal responsive.

## Capas de cada módulo

| Capa | Responsabilidad |
| --- | --- |
| `page.tsx` | Enrutamiento y composición mínima |
| `components` | Interfaz y comportamiento visual |
| `models` | Representación interna del dominio |
| `dtos` | Forma de los datos externos o simulados |
| `adapters` | Transformación DTO → modelo |
| `services` | Acceso a datos simulados y futura API |
| `mocks` | Datos de demostración |
| `validation` | Reglas de validación del dominio |

Flujo previsto al conectar el backend:

`Page → Component/Hook → Service → API → DTO → Adapter → Model → UI`

No se debe llamar a una API directamente desde un componente ni colocar lógica compleja en `page.tsx`.

## Estado compartido

`ClinicSessionProvider` mantiene durante la navegación la selección del paciente y las acciones simuladas de agenda. `SettingsProvider` mantiene los cambios simulados de configuración. Esta persistencia termina al recargar la aplicación y no sustituye una base de datos.
