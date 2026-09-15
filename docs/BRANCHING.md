# Estrategia de ramas

El equipo trabaja con una rama por ticket creada desde `develop`.

| Rama | Uso |
| --- | --- |
| `main` | Versión estable; no desarrollar directamente |
| `develop` | Integración del trabajo aprobado |
| `feature/issue-N-descripcion` | Implementación de un Issue |
| `docs/descripcion` | Actualización documental coordinada |

## Flujo

1. Confirmar el Issue, el responsable y el alcance.
2. Cambiar a `develop` y actualizarla.
3. Crear una rama exclusiva para el ticket.
4. Implementar y ejecutar las verificaciones requeridas.
5. Publicar la rama y abrir un Pull Request hacia `develop`.
6. Mover el ticket a `Ready` cuando esté listo para revisión.
7. El Scrum Master revisa y autoriza la integración.

Ejemplo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/issue-4-agenda-pacientes
```

No mezclar varios tickets en una rama ni enviar cambios directamente a `develop` o `main`. Las actualizaciones de documentación común también deben pasar por revisión cuando puedan generar conflictos.
