# Treatments module

## Issue relacionado

Issue #8 — [TRATAMIENTOS] Implementar planes, procedimientos y recetas.

## Stack

- React
- Next.js App Router
- TypeScript
- CSS Modules
- Mocks
- Estado temporal con React

El módulo es un prototipo frontend. No existe backend ni base de datos, y no se utiliza `localStorage` ni `sessionStorage`. Tampoco existe integración real con Inventory ni Billing.

## Rutas

- `/tratamientos/planes`
- `/tratamientos/presupuesto`
- `/tratamientos/consentimientos`
- `/tratamientos/procedimiento`
- `/tratamientos/finalizar`
- `/tratamientos/receta`

La ruta `/tratamientos` redirige a `/tratamientos/planes`.

## Flujo completo

`Paciente → Plan de tratamiento → Presupuesto → Consentimiento → Registrar procedimiento → Finalizar y materiales → Indicaciones y receta`

1. Se selecciona un paciente compartido por las vistas del módulo.
2. Se crea un plan con profesional, procedimientos y precios.
3. Se genera y, opcionalmente, se aprueba un presupuesto asociado al plan.
4. Se prepara, previsualiza y acepta el consentimiento simulado.
5. Se registra la realización de un procedimiento incluido en el plan.
6. Se finaliza el registro, se guardan materiales utilizados y se genera un cargo simulado.
7. Se registran indicaciones y medicamentos, y se previsualiza la receta académica.

## Estado compartido

`TreatmentPlansProvider` mantiene el estado temporal de planes, presupuestos, consentimientos, registros de procedimientos, finalizaciones, materiales, cargos y recetas. Sus operaciones permiten crear o actualizar esos datos y compartirlos entre las rutas mientras se navega dentro del módulo.

El provider está montado en `TreatmentsShell`. Por ello, los datos se conservan al cambiar entre las pestañas de Treatments, pero se pierden al recargar la aplicación.

## Relaciones del dominio

La relación principal es:

`patientId → treatmentPlanId → procedureRecordId`

- `TreatmentPlan` pertenece a un paciente mediante `patientId` y contiene `TreatmentProcedure`.
- `TreatmentBudget` y `TreatmentConsent` relacionan un paciente con un plan mediante `patientId` y `treatmentPlanId`.
- `TreatmentProcedureRecord` pertenece al paciente y al plan, y referencia el procedimiento original mediante `procedureId`.
- `ProcedureCompletion` referencia un registro mediante `procedureRecordId` y conserva sus `ProcedureMaterial`.
- `TreatmentCharge` se relaciona de forma única con el registro finalizado mediante `procedureRecordId`.
- `TreatmentPrescription` pertenece al paciente y al plan, referencia el registro finalizado mediante `procedureRecordId` y contiene `PatientInstructions` y `PrescriptionMedication`.

## Vistas

- **Planes de tratamiento:** crea, consulta y aprueba planes con procedimientos y totales.
- **Presupuesto:** genera y aprueba el presupuesto asociado a un plan.
- **Consentimientos:** prepara, previsualiza y acepta un consentimiento simulado.
- **Registrar procedimiento:** registra procedimientos realizados y permite consultar su detalle.
- **Finalizar y materiales:** finaliza registros, conserva materiales utilizados y genera un cargo simulado.
- **Indicaciones y receta:** guarda indicaciones y medicamentos, y permite previsualizar la receta.

## Componentes principales

- `TreatmentsShell`: monta el provider y la estructura común del módulo.
- `TreatmentsTabs`: proporciona navegación entre las seis vistas.
- `TreatmentPlansProvider`: administra y comparte el estado temporal.
- `TreatmentPlansView`: implementa planes de tratamiento.
- `TreatmentBudgetView`: implementa presupuestos.
- `TreatmentConsentView`: implementa consentimientos.
- `TreatmentProcedureView`: implementa el registro de procedimientos.
- `TreatmentFinalizationView`: implementa finalizaciones, materiales y cargos.
- `TreatmentPrescriptionView`: implementa indicaciones, recetas y previsualización.

## Arquitectura

- `components`: vistas, formularios y estado de interfaz.
- `models`: entidades internas del dominio de Treatments.
- `dtos`: datos requeridos por operaciones de creación y finalización.
- `services`: creación y transformación de datos simulados; es el punto natural para una API futura.
- `mocks`: datos iniciales y catálogos demostrativos.
- `validation`: reglas simples y reactivas de los formularios.

## Persistencia

Los datos se mantienen en memoria mientras `TreatmentPlansProvider` permanece montado durante la navegación. No existe persistencia permanente y todos los cambios de la sesión se pierden al recargar la página.

## Limitaciones actuales

- Prototipo frontend.
- Datos simulados.
- Sin backend.
- Sin persistencia permanente.
- Los materiales no afectan Inventory.
- Los cargos no afectan Billing ni Caja.
- Los consentimientos y las recetas son simulaciones académicas.

## Integración futura

La capa `services` es el punto natural para reemplazar la creación y consulta de datos simulados por llamadas a una API cuando exista un backend. Los componentes deben continuar consumiendo las operaciones del dominio sin realizar solicitudes directas.
