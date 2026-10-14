import { useMemo, useState } from 'react';
import {
  SITUACIONES, avanceTiempo, badgeEstado, formatearFecha, normalizarEstado, parseFecha, situacion,
} from '../../utils/retos.js';

const COLUMNAS = [
  { key: 'nombre', label: 'Reto' },
  { key: 'estado', label: 'Estado' },
  { key: 'situacion', label: 'Situación' },
  { key: 'fecha_inicio', label: 'Inicio' },
  { key: 'fecha_fin', label: 'Fin' },
  { key: 'avance', label: 'Tiempo', num: true },
];

function valorOrden(r, key) {
  switch (key) {
    case 'fecha_inicio':
    case 'fecha_fin': return parseFecha(r[key])?.getTime() ?? 0;
    case 'situacion': return SITUACIONES[situacion(r)].label;
    case 'avance': return avanceTiempo(r) ?? -1;
    default: return (r[key] || '').toString().toLowerCase();
  }
}

export default function RetosTable({ retos, loading, onEditar, onEliminar }) {
  const [orden, setOrden] = useState({ key: 'fecha_fin', dir: 'asc' });

  const filas = useMemo(() => {
    const copia = [...retos];
    copia.sort((a, b) => {
      const va = valorOrden(a, orden.key);
      const vb = valorOrden(b, orden.key);
      const c = va < vb ? -1 : va > vb ? 1 : 0;
      return orden.dir === 'asc' ? c : -c;
    });
    return copia;
  }, [retos, orden]);

  const ordenarPor = (key) =>
    setOrden((o) => ({ key, dir: o.key === key && o.dir === 'asc' ? 'desc' : 'asc' }));

  if (loading) {
    return (
      <div className="bz-stack" style={{ gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="bz-skeleton" style={{ height: 44 }} />)}
      </div>
    );
  }

  if (!filas.length) return <div className="bz-empty">No hay retos que coincidan con los filtros.</div>;

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
          {filas.map((r) => {
            const s = SITUACIONES[situacion(r)];
            const av = avanceTiempo(r);
            return (
              <tr key={r.id}>
                <td>
                  <div className="bz-cell-main">{r.nombre}</div>
                  <div className="bz-cell-sub" title={r.descripcion || ''}>{r.descripcion || 'Sin descripción'}</div>
                </td>
                <td><span className={`bz-badge ${badgeEstado(r.estado)}`}>{normalizarEstado(r.estado)}</span></td>
                <td><span className={`bz-badge ${s.badge}`}>{s.label}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatearFecha(r.fecha_inicio)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatearFecha(r.fecha_fin)}</td>
                <td className="bz-num" title="Porcentaje del plazo ya transcurrido">
                  {av === null ? '—' : `${av} %`}
                </td>
                <td>
                  <div className="bz-row" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                    <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" onClick={() => onEditar(r)}>Editar</button>
                    <button type="button" className="bz-btn bz-btn-ghost bz-btn-sm" style={{ color: 'var(--bz-critical)' }}
                      onClick={() => onEliminar(r)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
