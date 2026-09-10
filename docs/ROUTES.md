# Rutas y Route Groups

Los nombres entre paréntesis son Route Groups de Next.js y no forman parte de la URL.

| Grupo | Pantallas | Integrante inicial |
| --- | --- | --- |
| (public) | Área pública | 1 |
| (auth) | Acceso y recuperación de cuenta | 1 |
| (patient) | Portal del paciente | 1 |
| (private) | Operación interna de la clínica | 2, 3 y 4 según SCOPE.md |

Las carpetas no habilitan rutas sin page.tsx y no implementan autenticación/autorización.
Por ejemplo, (public)/servicios correspondería a /servicios cuando se implemente su página.

## Directorios preparados

- src/app/(public)/profesionales/
- src/app/(public)/servicios/
- src/app/(public)/sucursales/
- src/app/(public)/contacto/
- src/app/(public)/emergencias/
- src/app/(auth)/login/
- src/app/(auth)/activar-cuenta/
- src/app/(auth)/recuperar-password/
- src/app/(patient)/portal/perfil/
- src/app/(patient)/portal/citas/solicitar/
- src/app/(patient)/portal/historial/
- src/app/(patient)/portal/tratamientos/
- src/app/(patient)/portal/recetas/
- src/app/(patient)/portal/pagos/
- src/app/(patient)/portal/recibos/
- src/app/(private)/dashboard/
- src/app/(private)/agenda/
- src/app/(private)/pacientes/nuevo/
- src/app/(private)/pacientes/[id]/
- src/app/(private)/expediente/[patientId]/odontograma/
- src/app/(private)/tratamientos/
- src/app/(private)/esterilizacion/
- src/app/(private)/inventario/consumibles/
- src/app/(private)/inventario/instrumental/
- src/app/(private)/inventario/compras/
- src/app/(private)/caja/pagos/
- src/app/(private)/caja/recibos/
- src/app/(private)/reportes/
- src/app/(private)/configuracion/usuarios/
- src/app/(private)/configuracion/roles/
- src/app/(private)/configuracion/clinica/
- src/app/(private)/configuracion/auditoria/

También se conservan sus directorios padres, como portal/citas, pacientes, expediente, inventario, caja y configuracion.
No hay páginas, layouts ni estilos nuevos. No se implementa ninguna ruta.
Dashboard está preparado pero su responsable está PENDIENTE DE DEFINICIÓN FUNCIONAL: no fue asignado en la distribución recibida. Consultar GitHub y coordinar antes de intervenir.
