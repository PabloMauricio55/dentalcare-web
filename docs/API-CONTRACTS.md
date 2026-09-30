# Contratos de API

- DTO: contrato de entrada/salida de API.
- Model: representación interna utilizada por el frontend.
- Mapper: transformación DTO ↔ Model.
- Service: comunicación con backend mediante el cliente HTTP futuro.

Los contratos reales deberán salir del backend o de los Issues correspondientes.
No se definen endpoints, URLs, payloads, respuestas ni DTOs concretos sin una fuente oficial.
Los contratos ausentes quedan PENDIENTE DE DEFINICIÓN FUNCIONAL.
No inferir contratos por los nombres de carpetas. Comunicar la dependencia si falta información oficial necesaria.

## Agenda administrativa

El módulo `appointments` consume el contrato oficial de `dentalcare-api`:

- `GET /api/v1/appointments`
- `GET /api/v1/appointments/{appointmentId}`
- `POST /api/v1/appointments`
- `PATCH /api/v1/appointments/{appointmentId}/schedule`
- `PATCH /api/v1/appointments/{appointmentId}/status`

Los únicos estados admitidos son `SCHEDULED`, `COMPLETED` y `CANCELLED`. La creación envía exclusivamente `patientId`, `professionalId` y `scheduledAt`. La URL base se configura con `NEXT_PUBLIC_API_URL`.

Agenda general, Atenciones programadas y los indicadores compatibles del Panel consumen este contrato. Solicitudes y Sala de espera muestran un estado pendiente porque el backend todavía no publica contratos para solicitud, propuesta de horario, llegada, espera o preparación.
