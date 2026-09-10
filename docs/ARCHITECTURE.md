# Arquitectura

## Estado inspeccionado

El repositorio inicial solo contenía README.md. No existían src, rutas, componentes, lógica funcional, estilos, configuración de aplicación ni documentación adicional.
No hay package.json, lockfile, next.config o tsconfig. Versión de Next.js, TypeScript, dependencias y aliases: no definidos. App Router aún no está instalado/configurado.

## Objetivo

Next.js App Router + Route Groups + Feature-Based Architecture + módulos por dominio.

- src/app: routing, composición de pantalla y parámetros de ruta.
- src/modules: código específico de cada dominio.
- src/shared: piezas realmente reutilizadas entre dominios.
- src/providers: composición futura de providers según necesidades verificadas.
- team: instrucciones y alcances individuales.
- docs y .github: acuerdos y revisión.

La estructura se prepara inicialmente vacía para que cada integrante desarrolle según sus GitHub Issues. Todavía no es una aplicación ejecutable.
layout.tsx, globals.css y middleware.ts son referencias conceptuales futuras; no se crean archivos ficticios. Al inicializar el framework deberá confirmarse la versión y su convención aplicable de protección de rutas.

## Responsabilidades futuras

| Capa | Responsabilidad |
| --- | --- |
| Page | Routing, composición de pantalla, parámetros de ruta |
| Component | Interfaz visual |
| Hook | Estado y comportamiento React |
| Service | Comunicación con backend |
| DTO | Contrato de entrada/salida de API |
| Model | Representación interna del frontend |
| Mapper | Transformación DTO ↔ Model |
| Validation | Validaciones |
| Types | Tipos específicos del módulo |
| Constants | Constantes propias del módulo |

Solicitud: Page → Component → Hook → Service → HTTP Client → Backend.

Respuesta: Backend → DTO → Mapper → Model → Hook → Component → UI.

Son flujos futuros de responsabilidad; no se ha creado cliente HTTP ni se exige crear capas sin necesidad.
