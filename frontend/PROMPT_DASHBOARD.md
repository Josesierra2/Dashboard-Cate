# Prompt para crear el dashboard de tu modelo

Este es el prompt que deben usar para generar el dashboard de su modelo (Empresa,
Categoría, Prioridad, Registro…) con la **misma estructura y los mismos estilos**
que el dashboard de Retos.

## Cómo usarlo

1. Hagan `git pull` de `develop` para tener la carpeta `frontend/` con el tema y los componentes compartidos.
2. Copien el prompt de abajo y reemplacen lo que está entre `<< >>`.
3. Pásenle a la IA (Claude, Copilot, etc.) **acceso a la carpeta del proyecto** o adjunten estos archivos:
   - `beta_1_Bizti/src/main/java/com/example/beta_1_Bizti/models/<<Modelo>>.java`
   - `beta_1_Bizti/src/main/java/com/example/beta_1_Bizti/services/Servicios<<Modelo>>.java`
   - `frontend/src/styles/bizti-theme.css`
   - `frontend/ESTILOS.md`
   - `frontend/src/pages/RetosDashboard.jsx` (como ejemplo)
4. Revisen el resultado con `npm run dev` antes de hacer commit.

---

## Prompt (copiar desde aquí)

```text
Necesito un dashboard en React para el modelo <<NombreDelModelo>> del proyecto
beta_1_Bizti (Spring Boot + React). Es mi tarea del sprint.

REGLAS OBLIGATORIAS
1. NO modifiques nada del backend: ni models, ni services, ni repository, ni controllers.
   Solo trabaja dentro de la carpeta frontend/.
2. Reutiliza lo que ya existe en frontend/. NO crees estilos nuevos por tu cuenta:
   - Tema compartido: frontend/src/styles/bizti-theme.css (clases bz-* y variables --bz-*).
     Lee frontend/ESTILOS.md antes de empezar.
   - Componentes: frontend/src/components/ui/ (KpiCard, BarList, ColumnChart, Modal,
     ConfirmDialog). Úsalos tal cual; no los modifiques.
   - No uses colores en hex sueltos ni librerías de UI o de gráficos nuevas.
3. Sigue exactamente la misma estructura que el dashboard de Retos
   (toma frontend/src/pages/RetosDashboard.jsx como referencia):
   - frontend/src/api/<<modelo>>Api.js        -> llamadas HTTP (fetch)
   - frontend/src/api/use<<Modelo>>.js        -> hook con carga, CRUD y modo demo
   - frontend/src/api/<<modelo>>Demo.js       -> datos de ejemplo si el API no responde
   - frontend/src/components/<<modelo>>/      -> <<Modelo>>Form.jsx y <<Modelo>>Table.jsx
   - frontend/src/pages/<<Modelo>>Dashboard.jsx
   - frontend/src/utils/<<modelo>>.js          -> cálculos y formatos (funciones puras)
   No toques los archivos de Retos ni los compartidos.

ANTES DE ESCRIBIR CÓDIGO, lee y respeta el backend:
- Lee models/<<Modelo>>.java: usa los nombres de campos tal como los serializa Jackson
  (según los getters; ej. getFecha_inicio -> "fecha_inicio"). Las relaciones con
  @JsonBackReference NO llegan en el JSON. Usa los límites de @Column (nullable,
  length) para las validaciones del formulario.
- Lee services/Servicios<<Modelo>>.java: el formulario de edición solo debe permitir
  cambiar los campos que el método de modificar realmente actualiza. Deshabilita
  los demás y explica por qué con un texto de ayuda.
- Si no existe un @RestController para el modelo, NO lo crees. Asume la ruta
  /api/<<ruta-plural>> (GET, POST, PUT /{id}, DELETE /{id}), hazla configurable con
  VITE_<<MODELO>>_API en .env y deja el modo demo activo cuando el API falle.

CONTENIDO DEL DASHBOARD
- Encabezado con bz-page-header: eyebrow "Bizti · <<Modelo plural>>", título y
  botones "Actualizar" y "+ Nuevo <<modelo>>".
- Aviso bz-alert-warning cuando esté en modo demo.
- Fila de 4 o 5 indicadores con KpiCard (tone: good, warning, critical, info, neutral).
  Indicadores sugeridos para mi modelo: <<lista de indicadores>>.
- Dos gráficas en bz-grid-2 usando BarList y/o ColumnChart: <<qué graficar>>.
  Un solo color por gráfica (--bz-series-1). Los colores de estado solo van en badges
  y siempre con texto.
- Tabla con bz-table: búsqueda, filtros, orden por columna y acciones Editar/Eliminar.
  Eliminar siempre con ConfirmDialog.
- Formulario en Modal con validaciones y mensajes en español.
- Estados de carga (bz-skeleton), vacío (bz-empty) y toast al guardar o eliminar.
- Debe verse bien en celular (sin scroll horizontal de la página) y en modo oscuro.

AL TERMINAR
- Agrega la página en frontend/src/App.jsx sin borrar la de Retos (si hay más de un
  dashboard, agrega un menú simple con botones bz-btn para cambiar entre ellos).
- Verifica que `npm run build` compile sin errores.
- Agrega una sección para mi modelo en frontend/README.md con: qué muestra, API que
  espera, reglas de negocio calculadas en el frontend y pendientes del backend.
- Dime qué archivos creaste y qué pendientes encontraste en el backend, sin corregirlos.
```

---

## Sugerencias por modelo

Ideas para llenar `<<lista de indicadores>>` y `<<qué graficar>>`. Confirmen los
campos reales en su modelo antes de usarlas.

| Modelo | Ruta sugerida | Indicadores | Gráficas |
|---|---|---|---|
| Empresa | `/api/empresas` | Total, activas, inactivas, sectores distintos | Empresas por sector (BarList), activas vs. inactivas (BarList) |
| Categoría | `/api/categorias` | Total, con descripción, sin descripción | Categorías por longitud de nombre o agrupadas por inicial (BarList) |
| Prioridad | `/api/prioridades` | Total, nivel máximo, nivel mínimo, nivel promedio | Prioridades por nivel (ColumnChart) |
| Registro | `/api/registros` | Total, registros del mes, estados distintos, último registro | Registros por estado (BarList), registros por mes (ColumnChart) |

> Si la IA propone cambiar algo del backend, recházalo: los cambios de backend van en
> la tarea de quien tenga ese modelo, no en la del dashboard.
