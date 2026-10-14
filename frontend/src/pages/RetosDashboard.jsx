import { useEffect, useMemo, useState } from 'react';
import { useRetos } from '../api/useRetos.js';
import KpiCard from '../components/ui/KpiCard.jsx';
import BarList from '../components/ui/BarList.jsx';
import ColumnChart from '../components/ui/ColumnChart.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import RetoForm from '../components/retos/RetoForm.jsx';
import RetosTable from '../components/retos/RetosTable.jsx';
import {
  DIAS_POR_VENCER, SITUACIONES, contarPor, duracionDias, normalizarEstado, retosPorMesInicio, situacion,
} from '../utils/retos.js';

export default function RetosDashboard() {
  const { retos, loading, error, demo, recargar, crear, modificar, eliminar } = useRetos();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroSituacion, setFiltroSituacion] = useState('');
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

  // ---- Indicadores (sobre todos los retos) ----
  const kpis = useMemo(() => {
    const porSit = { en_curso: 0, por_vencer: 0, vencido: 0, por_iniciar: 0, cerrado: 0 };
    let dur = 0; let nDur = 0;
    for (const r of retos) {
      porSit[situacion(r)] += 1;
      const d = duracionDias(r);
      if (d !== null && d >= 0) { dur += d; nDur += 1; }
    }
    return { total: retos.length, ...porSit, duracionProm: nDur ? Math.round(dur / nDur) : 0 };
  }, [retos]);

  const estados = useMemo(() => contarPor(retos, (r) => normalizarEstado(r.estado)), [retos]);
  const porMes = useMemo(() => retosPorMesInicio(retos, 12), [retos]);

  // ---- Filtros de la tabla ----
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return retos.filter((r) => {
      if (filtroEstado && normalizarEstado(r.estado) !== filtroEstado) return false;
      if (filtroSituacion && situacion(r) !== filtroSituacion) return false;
      if (q && !`${r.nombre} ${r.descripcion || ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [retos, busqueda, filtroEstado, filtroSituacion]);

  const hayFiltros = busqueda || filtroEstado || filtroSituacion;

  // ---- Acciones ----
  const abrirNuevo = () => { setEditando(null); setFormAbierto(true); };
  const abrirEditar = (r) => { setEditando(r); setFormAbierto(true); };

  async function guardar(valores) {
    if (editando) {
      await modificar(editando.id, valores);
      setToast('Reto actualizado');
    } else {
      await crear(valores);
      setToast('Reto creado');
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminar(aEliminar.id);
      setToast('Reto eliminado');
      setAEliminar(null);
    } catch (e) {
      setToast(e.message || 'No se pudo eliminar');
    } finally {
      setEliminando(false);
    }
  }

  const pct = (n) => (kpis.total ? `${Math.round((n / kpis.total) * 100)} % del total` : '—');

  return (
    <main className="bz-page">
      <header className="bz-page-header">
        <div>
          <p className="bz-eyebrow">Bizti · Retos</p>
          <h1 className="bz-title">Dashboard de retos</h1>
          <p className="bz-subtitle">Seguimiento de estado, plazos y vencimientos de los retos.</p>
        </div>
        <div className="bz-row">
          <button type="button" className="bz-btn" onClick={recargar} disabled={loading}>Actualizar</button>
          <button type="button" className="bz-btn bz-btn-primary" onClick={abrirNuevo}>+ Nuevo reto</button>
        </div>
      </header>

      <div className="bz-stack">
        {demo && (
          <div className="bz-alert bz-alert-warning" role="status">
            <div>
              <strong>Modo demo: no se pudo conectar con el API de retos</strong>
              Se muestran datos de ejemplo y los cambios no se guardan.
              {error?.message ? ` (${error.message})` : ''} Verifica que el backend esté corriendo y que exista
              el controlador en <code>/api/retos</code>.
            </div>
          </div>
        )}

        <section className="bz-grid bz-grid-kpi" aria-label="Indicadores">
          <KpiCard label="Total de retos" value={kpis.total} tone="neutral" loading={loading}
            foot={`Duración promedio: ${kpis.duracionProm} días`} />
          <KpiCard label="En curso" value={kpis.en_curso} tone="info" loading={loading} foot={pct(kpis.en_curso)} />
          <KpiCard label="Por vencer" value={kpis.por_vencer} tone="warning" loading={loading}
            foot={`Terminan en ${DIAS_POR_VENCER} días o menos`} />
          <KpiCard label="Vencidos" value={kpis.vencido} tone="critical" loading={loading}
            foot="Pasó la fecha fin y siguen abiertos" />
          <KpiCard label="Cerrados" value={kpis.cerrado} tone="good" loading={loading}
            foot={`Por iniciar: ${kpis.por_iniciar}`} />
        </section>

        <section className="bz-grid bz-grid-2">
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Retos por estado</h2>
              <p className="bz-card-hint">Clic en una barra para filtrar</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 160 }} /> : (
              <BarList data={estados} selected={filtroEstado} onSelect={setFiltroEstado} />
            )}
          </div>
          <div className="bz-card">
            <div className="bz-card-header">
              <h2 className="bz-card-title">Retos iniciados por mes</h2>
              <p className="bz-card-hint">Últimos 12 meses</p>
            </div>
            {loading ? <div className="bz-skeleton" style={{ height: 200 }} /> : (
              <ColumnChart data={porMes} unit=" retos" />
            )}
          </div>
        </section>

        <section className="bz-card">
          <div className="bz-card-header" style={{ flexWrap: 'wrap' }}>
            <h2 className="bz-card-title">
              Listado de retos{' '}
              <span style={{ color: 'var(--bz-text-muted)', fontWeight: 500 }}>
                ({filtrados.length}{filtrados.length !== retos.length ? ` de ${retos.length}` : ''})
              </span>
            </h2>
          </div>

          <div className="bz-row" style={{ marginBottom: 'var(--bz-space-4)' }}>
            <input className="bz-input" style={{ maxWidth: 280 }} type="search" placeholder="Buscar por nombre o descripción"
              aria-label="Buscar reto" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <select className="bz-select" style={{ maxWidth: 200 }} aria-label="Filtrar por estado"
              value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {estados.map((e) => <option key={e.label} value={e.label}>{e.label}</option>)}
            </select>
            <select className="bz-select" style={{ maxWidth: 200 }} aria-label="Filtrar por situación"
              value={filtroSituacion} onChange={(e) => setFiltroSituacion(e.target.value)}>
              <option value="">Todas las situaciones</option>
              {Object.entries(SITUACIONES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {hayFiltros && (
              <button type="button" className="bz-btn bz-btn-ghost"
                onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroSituacion(''); }}>
                Limpiar filtros
              </button>
            )}
          </div>

          <RetosTable retos={filtrados} loading={loading} onEditar={abrirEditar} onEliminar={setAEliminar} />
        </section>
      </div>

      <RetoForm
        open={formAbierto}
        reto={editando}
        estadosExistentes={estados.map((e) => e.label)}
        onClose={() => setFormAbierto(false)}
        onSubmit={guardar}
      />

      <ConfirmDialog
        open={Boolean(aEliminar)}
        title="Eliminar reto"
        message={aEliminar ? `¿Seguro que quieres eliminar "${aEliminar.nombre}"? Esta acción no se puede deshacer.` : ''}
        busy={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />

      {toast && <div className="bz-toast" role="status">{toast}</div>}
    </main>
  );
}
