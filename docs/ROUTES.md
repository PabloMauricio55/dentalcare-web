# Rutas

Los nombres entre paréntesis son Route Groups de Next.js y no forman parte de la URL.

## Generales

| Ruta | Vista |
| --- | --- |
| `/` | Entrada al prototipo |
| `/login` | Acceso simulado |
| `/publico` | Área pública inicial |
| `/portal` | Portal inicial del paciente |
| `/panel` | Panel privado de inicio |
| `/componentes` | Demostración de componentes compartidos |

## Agenda y pacientes — ticket #4

| Ruta | Vista |
| --- | --- |
| `/agenda` | Redirección a `/agenda/general` |
| `/agenda/general` | Agenda general |
| `/agenda/solicitudes` | Solicitudes de citas |
| `/agenda/pacientes` | Gestión de pacientes y ficha administrativa |
| `/agenda/sala-espera` | Llegadas y sala de espera |
| `/agenda/atenciones` | Atenciones programadas |

## Configuración — ticket #5

| Ruta | Vista |
| --- | --- |
| `/configuracion` | Redirección a `/configuracion/usuarios` |
| `/configuracion/usuarios` | Usuarios y accesos |
| `/configuracion/roles` | Roles y permisos |
| `/configuracion/clinica` | Datos de la clínica |
| `/configuracion/catalogos` | Catálogos y procedimientos |
| `/configuracion/auditoria` | Seguridad y auditoría |

## Módulos preparados para otros tickets

`/expediente`, `/tratamientos`, `/caja`, `/inventario`, `/esterilizacion` y `/reportes` poseen una pantalla temporal navegable. Sus responsables deben reemplazarla desde el módulo correspondiente sin alterar el layout compartido.

Las rutas privadas son una separación visual del prototipo; todavía no existe autenticación ni autorización real.
