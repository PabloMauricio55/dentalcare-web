# DentalCare Web

Frontend de DentalCare: web pública, portal del paciente y sistema privado de la clínica.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Los accesos son simulados y no requieren backend.

## Estructura

- `src/app`: rutas públicas, de autenticación, paciente y privadas.
- `src/modules`: lógica y componentes por dominio.
- `src/shared`: componentes, layouts, hooks, tipos, mocks y utilidades comunes.
- `src/providers`: estado compartido de la sesión del prototipo.

## Verificación

```bash
npm run lint
npm run build
```
