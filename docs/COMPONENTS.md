# Componentes compartidos

Los componentes reutilizables se encuentran en `src/shared/components` y se exportan desde su `index.ts`.

| Componente | Uso |
| --- | --- |
| `PageHeader` | Título y contexto de una vista |
| `DataTable` | Tablas de datos con columnas configurables |
| `Pagination` | Navegación visual entre páginas |
| `SearchInput` | Búsqueda general accesible |
| `StatusBadge` | Estados mediante etiquetas de color |
| `Modal` | Formularios y detalles superpuestos |
| `ConfirmDialog` | Confirmación de acciones sensibles |
| `EmptyState` | Estado sin resultados o registros |
| `LoadingState` | Estado de carga |
| `StatCard` | Indicadores resumidos |
| `Button` | Acciones con variantes consistentes |
| `ActionNotice` | Resultado o confirmación visual |
| `ModulePlaceholder` | Pantalla temporal para módulos pendientes |

Los componentes específicos permanecen dentro de `src/modules/<modulo>/components`. Antes de agregar uno a `shared`, se debe comprobar que será reutilizado por más de un dominio y coordinar el cambio para evitar conflictos.

La demostración de los componentes compartidos está disponible en `/componentes`.
