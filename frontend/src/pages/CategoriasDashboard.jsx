import { useEffect, useMemo, useState } from 'react';
import { useCategorias } from '../api/useCategorias.js';
import KpiCard from '../components/ui/KpiCard.jsx';
import BarList from '../components/ui/BarList.jsx';
import ColumnChart from '../components/ui/ColumnChart.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import CategoriaForm from '../components/categorias/CategoriaForm.jsx';
import CategoriasTable from '../components/categorias/CategoriasTable.jsx';
import { apiSinRetos, resumenCategoria, retosDe, todosLosRetos } from '../utils/categorias.js';
import { DIAS_POR_VENCER, retosPorMesInicio } from '../utils/retos.js';

export default function CategoriasDashboard() {
  const { categorias, loading, error, demo, recargar, crear, modificar, eliminar } = useCategorias();

  const [busqueda, setBusqueda] = useState('');
  const [filtroRetos, setFiltroRetos] = useState('');
  const [seleccion, setSeleccion] = useState(''); // nombre de categoría elegida en la barra
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---- Indicadores (sobre todas las categorías) ----
  const kpis = useMemo(() => {
    const k = { categorias: categorias.length, total: 0, en_curso: 0, por_vencer: 0, vencido: 0, por_iniciar: 0, cerrado: 0, sinRetos: 0 };
    for (const c of categorias) {
      const r = resumenCategoria(c);
      if (!r.total) k.sinRetos += 1;
      for (const key of ['total', 'en_curso', 'por_vencer', 'vencido', 'por_iniciar', 'cerrado']) k[key] += r[key];
    }
    return k;
  }, [categorias]);

  const porCategoria = useMemo(
    () => categorias.map((c) => ({ label: c.nombre, value: retosDe(c).length })).sort((a, b) => b.value - a.value),
    [categorias],
  );

  // La gráfica por mes sigue la categoría elegida (o todas)
  const retosGrafica = useMemo(() => {
    const cat = categorias.find((c) => c.nombre === seleccion);
    return cat ? retosDe(cat) : todosLosRetos(categorias);
  }, [categorias, seleccion]);
  const porMes = useMemo(() => retosPorMesInicio(retosGrafica, 12), [retosGrafica]);

  // ---- Filtros de la tabla ----
  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return categorias.filter((c) => {
      const r = resumenCategoria(c);
      if (seleccion && c.nombre !== seleccion) return false;
      if (filtroRetos === 'con' && !r.total) return false;
      if (filtroRetos === 'sin' && r.total) return false;
      if (filtroRetos === 'vencidos' && !r.vencido) return false;
      if (q) {
        const texto = `${c.nombre} ${c.descripcion || ''} ${retosDe(c).map((x) => x.nombre).join(' ')}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }, [categorias, busqueda, filtroRetos, seleccion]);

  const hayFiltros = busqueda || filtroRetos || seleccion;

  // ---- Acciones ----
  const abrirNuevo = () => { setEditando(null); setFormAbierto(true); };
  const abrirEditar = (c) => { setEditando(c); setFormAbierto(true); };

  async function guardar(valores) {
    if (editando) {
      await modificar(editando.id, valores);
      setToast('Categoría actualizada');
    } else {
      await crear(valores);
      setToast('Categoría creada');
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminar(aEliminar.id);
      setToast('Categoría eliminada');
      setAEliminar(null);
    } catch (e) {
      setToast(e.message || 'No se pudo eliminar');
    } finally {
      setEliminando(false);
    }
  }

  const pct = (n) => (kpis.total ? `${Math.round((n / kpis.total) * 100)} % de los retos` : '—');
  const nRetosAEliminar = aEliminar ? retosDe(aEliminar).length : 0;

  return (
    <main className="bz-page">
      <header className="bz-page-header">
        <div>
          <p className="bz-eyebrow">Bizti · Categorías</p>
          <h1 className="bz-title">Dashboard de categorías</h1>
          <p className="bz-subtitle">Qué retos tiene cada categoría y cómo van sus plazos.</p>
        </div>
        <div className="bz-row">
          <button type="button" className="bz-btn" onClick={recargar} disabled={loading}>Actualizar</button>
          <button type="button" className="bz-btn bz-btn-primary" onClick={abrirNuevo}>+ Nueva categoría</button>
        </div>
      </header>

      <div className="bz-stack">
        {demo && (
          <div className="bz-alert bz-alert-warning" role="status">
            <div>
              <strong>Modo demo: no se pudo conectar con el API de categorías</strong>
              Se muestran datos de ejemplo y los cambios no se guardan.
              {error?.message ? ` (${error.message})` : ''} Verifica que el backend esté corriendo y que exista
              el controlador en <code>/api/categorias</code>.
            </div>
          </div>
        )}
        {!demo && !loading && apiSinRetos(categorias) && (
          <div className="bz-alert bz-alert-info" role="status">
            <div>
              <strong>El API no está enviando los retos de cada categoría</strong>
              Las categorías llegan sin el campo <code>retos</code> (en el modelo está marcado con
              <code> @JsonBackReference</code>), por eso los conteos aparecen en 0.
            </div>
          </div>
        )}

        <section className="bz-grid bz-grid-kpi" aria-label="Indicadores">
          <KpiCard label="Categorías" value={kpis.categorias} tone="neutral" loading={loading}
            foot={`Sin retos: ${kpis.sinRetos}`} />
          <KpiCard label="Retos asignados" value={kpis.total} tone="info" loading={loading}
            foot={kpis.categorias ? `Promedio: ${(kpis.total / kpis.categorias).toFixed(1)} por categoría` : '—'} />
          <KpiCard label="Por vencer" value={kpis.por_vencer} tone="warning" loading={loading}
            foot={`Terminan en ${DIAS_POR_VENCER} días o menos`} />
          <KpiCard label="Vencidos" value={kpis.vencido} tone="critical" loading={loading} foot={pct(kpis.vencido)} />
          <KpiCard label="Cerrados" value={kpis.cerrado} tone="good" loading={loading}
            foot={`En curso: ${kpis.en_curso} · Por iniciar: ${kpis.por_iniciar}`} />
        </section>

        <section className="bz-grid bz-grid-2">
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Retos por categoría</h2>
              <p className="bz-card-hint">Clic en una barra para filtrar</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 160 }} /> : (
              <BarList data={porCategoria} selected={seleccion} onSelect={setSeleccion} />
            )}
          </div>
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Retos iniciados por mes</h2>
              <p className="bz-card-hint">{seleccion ? `Categoría: ${seleccion}` : 'Todas las categorías'} · últimos 12 meses</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 200 }} /> : (
              <ColumnChart data={porMes} unit=" retos" />
            )}
          </div>
        </section>

        <section className="bz-card">
          <div className="bz-card-header" style={{ flexWrap: 'wrap' }}>
            <h2 className="bz-card-title">
              Listado de categorías{' '}
              <span style={{ color: 'var(--bz-text-muted)', fontWeight: 500 }}>
                ({filtradas.length}{filtradas.length !== categorias.length ? ` de ${categorias.length}` : ''})
              </span>
            </h2>
          </div>

          <div className="bz-row" style={{ marginBottom: 'var(--bz-space-4)' }}>
            <input className="bz-input" style={{ maxWidth: 300 }} type="search"
              placeholder="Buscar categoría o reto" aria-label="Buscar categoría o reto"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <select className="bz-select" style={{ maxWidth: 220 }} aria-label="Filtrar por retos"
              value={filtroRetos} onChange={(e) => setFiltroRetos(e.target.value)}>
              <option value="">Todas las categorías</option>
              <option value="con">Con retos</option>
              <option value="sin">Sin retos</option>
              <option value="vencidos">Con retos vencidos</option>
            </select>
            {hayFiltros && (
              <button type="button" className="bz-btn bz-btn-ghost"
                onClick={() => { setBusqueda(''); setFiltroRetos(''); setSeleccion(''); }}>
                Limpiar filtros
              </button>
            )}
          </div>

          <CategoriasTable categorias={filtradas} loading={loading} onEditar={abrirEditar} onEliminar={setAEliminar} />
        </section>
      </div>

      <CategoriaForm open={formAbierto} categoria={editando} onClose={() => setFormAbierto(false)} onSubmit={guardar} />

      <ConfirmDialog
        open={Boolean(aEliminar)}
        title="Eliminar categoría"
        message={aEliminar
          ? `¿Seguro que quieres eliminar "${aEliminar.nombre}"?${nRetosAEliminar ? ` Tiene ${nRetosAEliminar} reto(s) asociado(s).` : ''} Esta acción no se puede deshacer.`
          : ''}
        busy={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />

      {toast && <div className="bz-toast" role="status">{toast}</div>}
    </main>
  );
}
