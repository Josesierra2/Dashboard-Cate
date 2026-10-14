# Estilos compartidos Bizti (`src/styles/bizti-theme.css`)

Guía corta para que todos los dashboards del proyecto (Reto, Empresa, Categoría, Prioridad, Registro…) se vean iguales.

## Cómo usarlo

1. El tema ya se importa una sola vez en `src/main.jsx`:
   ```js
   import './styles/bizti-theme.css';
   ```
2. En tus componentes usa las **clases `bz-*`** y las **variables `--bz-*`**. No pongas colores en hex sueltos.
3. Modo oscuro: sale solo según el sistema operativo. Para forzarlo: `<html data-theme="dark">` o `data-theme="light"`.

## Variables principales

| Grupo | Variables |
|---|---|
| Fondos | `--bz-bg` (página), `--bz-surface` (tarjetas), `--bz-surface-2` (encabezados, hover) |
| Bordes | `--bz-border`, `--bz-border-strong` |
| Texto | `--bz-text`, `--bz-text-2` (secundario), `--bz-text-muted` |
| Marca | `--bz-brand`, `--bz-brand-hover`, `--bz-brand-soft` |
| Estados | `--bz-good`, `--bz-warning`, `--bz-critical`, `--bz-info`, `--bz-neutral` (+ `-soft` para fondos) |
| Gráficos | `--bz-series-1` … `--bz-series-4` (usar en ese orden), `--bz-chart-grid` |
| Espacios | `--bz-space-1` (4px) … `--bz-space-6` (32px) |
| Radios | `--bz-radius-sm`, `--bz-radius`, `--bz-radius-lg` |

> Los colores de estado (good/warning/critical) son para estados, **no** para series de gráficos.
> Siempre acompáñalos con texto (por ejemplo, un badge con la palabra "Vencido").

## Clases disponibles

**Layout:** `bz-page`, `bz-page-header`, `bz-eyebrow`, `bz-title`, `bz-subtitle`, `bz-grid` + `bz-grid-kpi` / `bz-grid-2`, `bz-stack`, `bz-row`, `bz-spacer`

**Tarjetas:** `bz-card`, `bz-card-header`, `bz-card-title`, `bz-card-hint`
**Indicadores:** `bz-kpi`, `bz-kpi-label`, `bz-kpi-value`, `bz-kpi-foot`, `bz-kpi-dot`

**Botones:** `bz-btn` + `bz-btn-primary` | `bz-btn-danger` | `bz-btn-ghost`, tamaño `bz-btn-sm`

**Formularios:** `bz-form-grid` (2 columnas, `bz-span-2` para ocupar las dos), `bz-field`, `bz-label`, `bz-input`, `bz-select`, `bz-textarea`, `bz-help`, `bz-error-text`. Marca un campo con error con `aria-invalid="true"`.

**Badges:** `bz-badge` + `bz-badge-good` | `bz-badge-warning` | `bz-badge-critical` | `bz-badge-info` | `bz-badge-neutral`

**Tablas:** `bz-table-wrap` (scroll horizontal en celular) > `bz-table`; celdas `bz-num`, `bz-cell-main`, `bz-cell-sub`, `bz-mono`; encabezado ordenable `bz-th-sort`

**Modal:** `bz-overlay` > `bz-modal` (`bz-modal-sm`) > `bz-modal-header` / `bz-modal-body` / `bz-modal-footer`

**Avisos y otros:** `bz-alert` + `bz-alert-warning` | `bz-alert-critical` | `bz-alert-info`, `bz-empty`, `bz-skeleton`, `bz-toast`, `bz-sr-only`

## Componentes React reutilizables (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `KpiCard` | `<KpiCard label="Total" value={10} tone="info" foot="texto" loading={false} />` |
| `BarList` | Barras horizontales: `<BarList data={[{ label: 'A', value: 3 }]} onSelect={fn} selected="A" />` |
| `ColumnChart` | Columnas por periodo con tooltip: `<ColumnChart data={[{ label: 'ene', value: 2 }]} unit=" retos" />` |
| `Modal` | `<Modal open title="..." onClose={fn} footer={<botones/>}>contenido</Modal>` |
| `ConfirmDialog` | Confirmación de borrado: `<ConfirmDialog open title message onConfirm onCancel busy />` |

## Plantilla rápida para un dashboard nuevo

```jsx
import KpiCard from '../components/ui/KpiCard.jsx';

export default function EmpresasDashboard() {
  return (
    <main className="bz-page">
      <header className="bz-page-header">
        <div>
          <p className="bz-eyebrow">Bizti · Empresas</p>
          <h1 className="bz-title">Dashboard de empresas</h1>
        </div>
        <button className="bz-btn bz-btn-primary">+ Nueva empresa</button>
      </header>
      <div className="bz-stack">
        <section className="bz-grid bz-grid-kpi">
          <KpiCard label="Empresas activas" value={0} tone="good" />
        </section>
        <section className="bz-card">…tabla…</section>
      </div>
    </main>
  );
}
```
