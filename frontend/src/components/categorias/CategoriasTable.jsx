import { Fragment, useMemo, useState } from 'react';
import { SITUACIONES, badgeEstado, formatearFecha, normalizarEstado, parseFecha, situacion } from '../../utils/retos.js';
import { resumenCategoria, retosDe } from '../../utils/categorias.js';

const COLUMNAS = [
  { key: 'nombre', label: 'Categoría' },
  { key: 'total', label: 'Retos', num: true },
  { key: 'en_curso', label: 'En curso', num: true },
  { key: 'por_vencer', label: 'Por vencer', num: true },
  { key: 'vencido', label: 'Vencidos', num: true },
  { key: 'cerrado', label: 'Cerrados', num: true },
];

export default function CategoriasTable({ categorias, loading, onEditar, onEliminar }) {
  const [orden, setOrden] = useState({ key: 'total', dir: 'desc' });
  const [abierta, setAbierta] = useState(null);

  const filas = useMemo(() => {
    const conResumen = categorias.map((c) => ({ cat: c, res: resumenCategoria(c) }));
    conResumen.sort((a, b) => {
      const va = orden.key === 'nombre' ? (a.cat.nombre || '').toLowerCase() : a.res[orden.key];
      const vb = orden.key === 'nombre' ? (b.cat.nombre || '').toLowerCase() : b.res[orden.key];
      const c = va < vb ? -1 : va > vb ? 1 : 0;
      return orden.dir === 'asc' ? c : -c;
    });
    return conResumen;
  }, [categorias, orden]);

  const ordenarPor = (key) =>
    setOrden((o) => ({ key, dir: o.key === key && o.dir === 'asc' ? 'desc' : 'asc' }));

  if (loading) {
    return (
      <div className="bz-stack" style={{ gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="bz-skeleton" style={{ height: 44 }} />)}
      </div>
    );
  }
  if (!filas.length) return <div className="bz-empty">No hay categorías que coincidan con los filtros.</div>;

  return (
    <div className="bz-table-wrap">
      <table className="bz-table">
        <thead>
          <tr>
            {COLUMNAS.map((c) => (
              <th key={c.key} className={c.num ? 'bz-num' : undefined}
                aria-sort={orden.key === c.key ? (orden.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="bz-th-sort" onClick={() => ordenarPor(c.key)}>
                  {c.label}
                  <span aria-hidden="true">{orden.key === c.key ? (orden.dir === 'asc' ? '↑' : '↓') : ''}</span>
                </button>
              </th>
            ))}
            <th><span className="bz-sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ cat, res }) => {
            const expandida = abierta === cat.id;
            const retos = [...retosDe(cat)].sort(
              (a, b) => (parseFecha(a.fecha_fin)?.getTime() ?? 0) - (parseFecha(b.fecha_fin)?.getTime() ?? 0),
            );
            return (
              <Fragment key={cat.id}>
                <tr>
                  <td>
                    <div className="bz-cell-main">{cat.nombre}</div>
                    <div className="bz-cell-sub" title={cat.descripcion || ''}>{cat.descripcion || 'Sin descripción'}</div>
                  </td>
                  <td className="bz-num">{res.total}</td>
                  <td className="bz-num">{res.en_curso}</td>
                  <td className="bz-num">{res.por_vencer}</td>
                  <td className="bz-num">{res.vencido}</td>
                  <td className="bz-num">{res.cerrado}</td>
                  <td>
                    <div className="bz-row" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" aria-expanded={expandida}
                        onClick={() => setAbierta(expandida ? null : cat.id)}>
                        {expandida ? 'Ocultar retos' : 'Ver retos'}
                      </button>
                      <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" onClick={() => onEditar(cat)}>Editar</button>
                      <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" style={{ color: 'var(--bz-critical)' }}
                        onClick={() => onEliminar(cat)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
                {expandida && (
                  <tr>
                    <td colSpan={COLUMNAS.length + 1} style={{ background: 'var(--bz-surface-2)' }}>
                      {retos.length === 0 ? (
                        <div className="bz-empty">Esta categoría aún no tiene retos.</div>
                      ) : (
                        <table className="bz-table">
                          <thead>
                            <tr><th>Reto</th><th>Estado</th><th>Situación</th><th>Inicio</th><th>Fin</th></tr>
                          </thead>
                          <tbody>
                            {retos.map((r) => {
                              const s = SITUACIONES[situacion(r)];
                              return (
                                <tr key={r.id}>
                                  <td>
                                    <div className="bz-cell-main">{r.nombre}</div>
                                    <div className="bz-cell-sub">{r.descripcion || 'Sin descripción'}</div>
                                  </td>
                                  <td><span className={`bz-badge ${badgeEstado(r.estado)}`}>{normalizarEstado(r.estado)}</span></td>
                                  <td><span className={`bz-badge ${s.badge}`}>{s.label}</span></td>
                                  <td style={{ whiteSpace: 'nowrap' }}>{formatearFecha(r.fecha_inicio)}</td>
                                  <td style={{ whiteSpace: 'nowrap' }}>{formatearFecha(r.fecha_fin)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
