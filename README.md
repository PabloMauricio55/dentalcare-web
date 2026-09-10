# DentalCare Web

Frontend de DentalCare para la web pública, el portal del paciente y el sistema privado de la clínica.

## Stack

- Next.js 16 con App Router.
- React 19.
- TypeScript.
- Datos simulados, sin conexión al backend.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Verificación

```bash
npm run lint
npm run build
```

## Arquitectura

- `src/app`: rutas públicas, autenticación, portal del paciente y rutas privadas.
- `src/modules`: lógica, componentes y datos simulados organizados por dominio.
- `src/shared`: componentes, layouts, hooks, tipos y utilidades reutilizables.
- `src/providers`: estado compartido de la aplicación.
- `team`: alcances e instrucciones de los integrantes.
- `docs`: arquitectura, convenciones y acuerdos del equipo.

Los GitHub Issues son la fuente oficial de requerimientos y asignaciones. El desarrollo se realiza en una rama por ticket y se integra mediante Pull Request hacia `develop`.

## Documentación del equipo

- [Arquitectura](docs/ARCHITECTURE.md)
- [Módulos](docs/MODULES.md)
- [Rutas](docs/ROUTES.md)
- [Ramas](docs/BRANCHING.md)
- [Convenciones](docs/CONVENTIONS.md)
- [Componentes](docs/COMPONENTS.md)
- [Contratos de API](docs/API-CONTRACTS.md)
- [Permisos](docs/PERMISSIONS.md)
- [Flujo GitHub](docs/GITHUB-WORKFLOW.md)
