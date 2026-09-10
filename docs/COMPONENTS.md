# Componentes

src/modules/<module>/components: componentes específicos de un dominio.
src/shared/components: componentes verdaderamente reutilizables.

Un componente no pasa a shared solo porque podría reutilizarse en el futuro: debe existir una necesidad real.
Revisar lo existente antes de duplicar componentes.
Áreas preparadas: ui, forms, tables, feedback, navigation y data-display.
shared/layouts queda reservado para composiciones reutilizables.
Las carpetas permanecen vacías salvo .gitkeep; no crear Button, Input, Modal, DataTable ni otros ejemplos.
Advertir y coordinar cambios compartidos según AGENTS.md.
