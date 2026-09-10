# Estrategia de ramas

| Rama prevista | Uso |
| --- | --- |
| main | Código estable; no desarrollar directamente |
| test | Integración; recibe PR de ramas individuales |
| feature/integrante-1 | Trabajo individual del integrante 1 |
| feature/integrante-2 | Trabajo individual del integrante 2 |
| feature/integrante-3 | Trabajo individual del integrante 3 |
| feature/integrante-4 | Trabajo individual del integrante 4 |

GitHub Issue → Asignación → feature/integrante-X → Implementación → Pull Request → test → Pruebas de integración → Pull Request → main.

No permitir feature/integrante-X → main como flujo normal. Los cambios entran mediante Pull Request.
Verificar la rama antes de implementar; si no corresponde, informar y coordinar antes de editar.
El equipo creará/controlará las ramas posteriormente. Esta tarea no crea ni cambia ramas.
El repositorio se recibió en main; la preparación documental conserva esa rama por instrucción expresa. No autoriza desarrollo futuro directo en main.
Son acuerdos documentados; no se han configurado protecciones remotas.
