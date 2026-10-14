/**
 * Barras horizontales en CSS (sin librerías). Útil para "conteo por categoría".
 * data: [{ label, value }]. Una sola serie -> un solo color (--bz-series-1).
 */
export default function BarList({ data, emptyText = 'Sin datos', onSelect, selected }) {
  if (!data.length) return <div className="bz-empty">{emptyText}</div>;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bz-hbar-list" role="list">
      {data.map((d) => {
        const active = selected === d.label;
        const dim = selected && !active;
        return (
          <div
            key={d.label}
            className="bz-hbar"
            role="listitem"
            title={`${d.label}: ${d.value}`}
            style={{ opacity: dim ? 0.45 : 1, cursor: onSelect ? 'pointer' : 'default' }}
            onClick={onSelect ? () => onSelect(active ? '' : d.label) : undefined}
          >
            <span className="bz-hbar-label">{d.label}</span>
            <span className="bz-hbar-track">
              <span className="bz-hbar-fill" style={{ width: `${(d.value / max) * 100}%`, display: 'block' }} />
            </span>
            <span className="bz-hbar-value">{d.value}</span>
          </div>
        );
      })}
    </div>
  );
}
