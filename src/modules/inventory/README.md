# Inventory module

## Issue relacionado

Este módulo corresponde al Issue #9 — **[INVENTARIO] Implementar consumibles, instrumental y compras**.

La implementación cubre las siete vistas requeridas: resumen de inventario, consumibles, instrumental, protocolos, movimientos, compras y proveedores, y alertas. Este documento describe la implementación existente y no reemplaza al GitHub Issue, que continúa siendo la fuente oficial de requerimientos.

## Stack y alcance

El módulo utiliza:

- React.
- Next.js App Router.
- TypeScript.
- CSS Modules.
- mocks como fuente inicial de datos.
- estado temporal en memoria con React.

Es un prototipo exclusivamente frontend. No existe backend ni base de datos, y el módulo no usa `localStorage` ni `sessionStorage`. Tampoco existe integración real con Caja, Reportes, Esterilización o Tratamientos.

## Rutas

| Ruta | Vista |
| --- | --- |
| `/inventario` | Resumen de inventario |
| `/inventario/consumibles` | Consumibles |
| `/inventario/instrumental` | Instrumental |
| `/inventario/protocolos` | Protocolos |
| `/inventario/movimientos` | Movimientos / Kardex |
| `/inventario/compras` | Compras y proveedores |
| `/inventario/alertas` | Alertas |

El `layout.tsx` de Inventory monta `InventoryShell`, que envuelve las rutas con `InventoryProvider` y muestra `InventoryTabs`. Cada `page.tsx` permanece mínimo y delega la interfaz y el comportamiento al componente de vista correspondiente.

## Arquitectura

- `components/`: vistas, formularios, navegación local y provider del módulo. Los componentes consumen el estado compartido mediante `useInventory`.
- `models/`: tipos que representan las entidades y estados del dominio simulado.
- `dtos/`: estructuras de entrada utilizadas al crear o actualizar registros.
- `services/`: creación de entidades, recepción de compras, cálculo de vencimientos y derivación de alertas.
- `mocks/`: colecciones iniciales de consumibles, instrumental, proveedores, compras, movimientos y protocolos.
- `validation/`: validaciones puras para los formularios de consumibles, instrumental, protocolos, compras y proveedores.

No se realizan solicitudes de red desde los componentes. Los `page.tsx` no contienen lógica de dominio ni estado propio.

## Estado compartido

`InventoryProvider.tsx` mantiene durante la navegación:

- `consumables`.
- `instruments`.
- `suppliers`.
- `purchases`.
- `movements`.
- `protocols`.

El contexto expone las siguientes operaciones reales:

- `addConsumable`.
- `updateConsumable`.
- `deactivateConsumable`.
- `addInstrument`.
- `updateInstrument`.
- `deactivateInstrument`.
- `addSupplier`.
- `updateSupplier`.
- `deactivateSupplier`.
- `addPurchase`.
- `receivePurchase`.
- `addProtocol`.
- `updateProtocol`.
- `deactivateProtocol`.

El estado se conserva al navegar entre las siete rutas mientras el layout de Inventory permanece montado. Una recarga completa desmonta el provider y restaura los mocks iniciales.

## Consumibles

`ConsumablesView` permite buscar por nombre o código y filtrar por categoría y estado. Incluye alta, edición y desactivación mediante `ConsumableForm` y diálogos locales.

El modelo `Consumable` incluye, entre otras propiedades:

- `currentStock`: existencia actual.
- `minimumStock`: umbral mínimo configurado.
- `expirationDate`: fecha de vencimiento opcional.

Las métricas muestran consumibles activos, existencia baja, próximos a vencer e inactivos. `validateConsumable` exige código, nombre, categoría y unidad, y valida que `currentStock` y `minimumStock` sean números finitos mayores o iguales a cero. Los campos numéricos pueden permanecer temporalmente vacíos durante la edición, pero se convierten a números válidos antes de enviar el DTO.

La regla de existencia baja es:

```text
currentStock <= minimumStock
```

Un consumible se considera próximo a vencer cuando `expirationDate` está dentro de los siguientes 30 días calendario y todavía no ha vencido.

## Instrumental

`InstrumentsView` implementa búsqueda, filtros, métricas, alta, edición y desactivación. `InstrumentForm` administra:

- `totalQuantity`.
- `availableQuantity`.
- `location`.

`validateInstrument` exige que ambas cantidades sean enteros mayores o iguales a cero y aplica la regla:

```text
availableQuantity <= totalQuantity
```

El instrumental solo representa disponibilidad dentro del prototipo. No existe integración con Esterilización.

## Protocolos

Los protocolos son procedimientos internos para control y manejo del inventario. No son protocolos clínicos ni protocolos de esterilización.

Las categorías implementadas en `InventoryProtocolCategory` son:

| Valor interno | Etiqueta visible |
| --- | --- |
| `receiving` | Recepción |
| `storage` | Almacenamiento |
| `replenishment` | Reposición |
| `expiration_control` | Control de vencimientos |

`ProtocolsView` ofrece búsqueda, filtros, métricas, alta, edición, consulta de detalle y desactivación. `ProtocolForm` valida `code`, `name`, `category`, `responsible` y `description` antes de enviar `CreateProtocolDto`.

## Compras y proveedores

La vista `PurchasesView` alterna entre compras y proveedores.

- `Supplier` contiene los datos del proveedor y su estado `active`.
- `Purchase` contiene código, proveedor, fecha, estado, items y, cuando corresponde, `receivedAt`.
- `PurchaseItem` relaciona un consumible con `quantity` y `unitCost`.

Los proveedores permiten alta, edición y desactivación. Solo los proveedores activos se ofrecen al crear una compra. Las compras utilizan los estados `pending` y `received`, admiten items dinámicos y validan que no se repita un consumible. `quantity` debe ser un entero mayor que cero y `unitCost` debe ser un número finito mayor o igual a cero.

Crear una compra mediante `addPurchase` **no modifica el stock**: la compra se agrega con estado `pending`. Recibirla mediante `receivePurchase` **sí incrementa `currentStock`** de sus consumibles.

## Recepción de compras

El flujo implementado es:

```text
Purchase pending
→ receivePurchase
→ actualización de currentStock
→ creación de InventoryMovement
→ Purchase pasa a received
```

`inventoryService.receivePurchase` rechaza una compra cuyo estado ya no sea `pending`, por lo que no puede recibirse dos veces. También verifica que todos sus items correspondan a consumibles existentes y activos. `PurchaseForm` recibe únicamente proveedores y consumibles activos como opciones seleccionables.

Por cada item recibido se crea un `InventoryMovement` con el stock anterior, la cantidad recibida y el stock resultante. Después, `InventoryProvider` actualiza `purchases`, `consumables` y `movements` dentro del estado compartido.

## Movimientos / Kardex

`InventoryMovement` representa cada entrada del Kardex. `InventoryMovementType` actualmente admite solo:

```text
purchase_receipt
```

Su etiqueta visible es **Recepción de compra**.

Cada movimiento contiene:

- `previousStock`.
- `quantity`.
- `newStock`.
- `occurredAt`.
- `reference`.
- `description`.

`MovementsView` permite buscar por consumible, código o referencia, filtrar por consumible y tipo, consultar métricas y abrir el detalle de cada movimiento.

Los movimientos históricos incluidos en `initialInventoryMovements` no modifican el stock durante la inicialización. Sus efectos ya se consideran reflejados en las existencias de `initialConsumables`.

## Alertas

Las alertas no se almacenan como estado mutable. Se calculan en cada vista mediante:

```ts
getInventoryAlerts(consumables)
```

Solo se consideran consumibles con `status === "active"`. Los tipos implementados son:

- `low_stock`: se genera cuando `currentStock <= minimumStock`.
- `expired`: se genera cuando `expirationDate` ya pasó.
- `expiring_soon`: se genera cuando `expirationDate` está dentro de los próximos 30 días calendario y todavía no venció.

`AlertsView` ofrece búsqueda, filtros por tipo y categoría, métricas y tabla de resultados. Como las alertas se derivan de `consumables`, cambian automáticamente cuando una recepción de compra modifica el stock o cuando se edita o desactiva un consumible.

## Resumen de inventario

`InventoryOverviewView` es un dashboard derivado directamente del estado de `InventoryProvider`. No mantiene una copia del estado ni utiliza mocks propios.

El resumen presenta:

- consumibles activos;
- unidades disponibles de instrumental activo;
- compras pendientes;
- alertas activas;
- estado de existencias;
- alertas prioritarias;
- compras pendientes recientes;
- movimientos recientes;
- estado del instrumental;
- protocolos activos;
- enlaces hacia las demás vistas del módulo.

Las alertas prioritarias se ordenan por vencidas, existencia baja y próximas a vencer. Las listas de compras y movimientos muestran hasta cinco registros.

## Componentes principales

- `InventoryShell`: monta el provider y la navegación común del módulo.
- `InventoryTabs`: enlaza las siete rutas y marca la ruta activa.
- `InventoryProvider`: conserva el estado temporal y expone sus operaciones.
- `InventoryOverviewView`: presenta el dashboard general derivado del provider.
- `ConsumablesView`: listado, búsqueda, filtros, métricas y acciones de consumibles.
- `ConsumableForm`: alta y edición de consumibles.
- `InstrumentsView`: listado, búsqueda, filtros, métricas y acciones de instrumental.
- `InstrumentForm`: alta y edición de instrumental.
- `ProtocolsView`: listado, filtros, métricas, detalle y acciones de protocolos.
- `ProtocolForm`: alta y edición de protocolos.
- `PurchasesView`: administración de compras y proveedores y recepción de compras.
- `PurchaseForm`: creación de compras con items dinámicos.
- `SupplierForm`: alta y edición de proveedores.
- `MovementsView`: consulta y detalle del Kardex.
- `AlertsView`: consulta de alertas derivadas.

`PendingInventoryView` continúa en `components/`, pero las siete rutas actuales ya no lo utilizan.

## Components shared reutilizados

El módulo reutiliza componentes de `src/shared/components` en lugar de duplicarlos:

- `PageHeader`.
- `StatCard`.
- `DataTable`.
- `SearchInput`.
- `StatusBadge`.
- `Modal`.
- `ConfirmDialog`.
- `Button`.
- `ActionNotice`.
- `EmptyState`.

También usa el tipo genérico `Column` de `DataTable` y `formatCurrency` desde `src/shared/lib/currency`.

## Persistencia

Todos los cambios se mantienen únicamente en memoria durante la sesión de navegación. Esta es una limitación deliberada del prototipo frontend, no un error.

Al recargar la página:

- se restauran los mocks;
- desaparecen las compras creadas durante la sesión;
- desaparecen los cambios temporales de stock;
- desaparecen los protocolos creados durante la sesión;
- desaparecen los movimientos generados durante la sesión;
- se revierten las altas, ediciones y desactivaciones temporales de los demás registros.

## Integraciones futuras

Cuando exista un backend, `services/` es el punto natural para sustituir el comportamiento basado en mocks por llamadas a API. No se debe hacer `fetch` directamente desde `components/`.

Deberán persistirse, como mínimo:

- compras;
- stock;
- Kardex;
- proveedores;
- protocolos.

Las alertas pueden continuar derivándose de las existencias y fechas de vencimiento persistidas. Estas integraciones no están implementadas actualmente.

## Limitaciones actuales

- Prototipo frontend con datos ficticios.
- Sin backend ni base de datos.
- Sin persistencia después de recargar.
- Sin conexión a un inventario real.
- Sin integración con Caja.
- Sin integración con Reportes.
- Sin integración con Esterilización.
- Sin integración con Tratamientos.
- Los movimientos manuales no están implementados.
- La reactivación de registros desactivados no está implementada porque no forma parte del alcance actual.

## Verificación realizada

Durante la implementación del Issue #9 se verificó:

- navegación y renderizado de las siete rutas;
- búsqueda y filtros;
- altas, edición y desactivaciones;
- recepción de compras;
- actualización de stock;
- generación y consulta del Kardex;
- actualización dinámica de alertas;
- comportamiento responsive en escritorio, tablet y móvil;
- `npm run lint` correcto;
- `npm run build` correcto;
- `git diff --check` correcto, salvo avisos informativos de conversión LF/CRLF en Windows.
