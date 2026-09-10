# Trabajo con GitHub

Los GitHub Issues son la fuente oficial de requerimientos, tickets, descripciones, criterios de aceptación, asignaciones, prioridades y estado.
TASKS.md solo es un índice; consultar siempre el Issue actualizado. Ante diferencias prevalece GitHub.

Issue → Rama → Código → Commit → Pull Request → test → main.

La integración de test a main requiere pruebas de integración y un segundo PR.
Verificar integrante, rama, asignación y alcance; leer los documentos obligatorios de AGENTS.md; inspeccionar código y mostrar archivos necesarios.
Informar cambios compartidos y detener cambios en módulos ajenos. Implementar únicamente el Issue.
Ejecutar lint/build cuando existan, mostrar resultados y esperar instrucciones antes de commit/push/merge.

Relacionar commits/PR con el número real del Issue. Patrón documental: feat(auth): descripción (#N). Sustituir N únicamente por un número verificado.
La plantilla incluye Closes # para completar con un Issue real. Revisar su efecto de cierre al integrar en la rama predeterminada. Esta preparación no crea PR ni cierra Issues.

## Referencias y asignaciones

La consulta de solo lectura a GitHub del 2026-09-10 falló por conexión al proxy.
No se verificaron números de Issues, nombres, usernames ni asignaciones; no se inventan referencias.
No se puede afirmar si hay discrepancias con la distribución inicial. Quedan pendientes de revisión humana.
Al recuperar acceso, comparar asignaciones vigentes con SCOPE.md, documentar discrepancias sin modificar GitHub y resolver el alcance antes de implementar. GitHub determina el asignado.
