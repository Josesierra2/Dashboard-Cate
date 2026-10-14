/**
 * Columnas verticales en CSS con tooltip al pasar el mouse o al enfocar con teclado.
 * data: [{ label, value }]. Una sola serie.
 */
export default function ColumnChart({ data, unit = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="bz-cols" role="img" aria-label={data.map((d) => `${d.titulo || d.label}: ${d.value}`).join(', ')}>
        {data.map((d) => (
          <div key={d.label} className="bz-col" tabIndex={0}>
            <span className="bz-tooltip">{d.titulo || d.label}: <strong>{d.value}</strong>{unit}</span>
            <div className="bz-col-bar" style={{ height: `${(d.value / max) * 100}%`, opacity: d.value ? 1 : 0.35 }} />
          </div>
        ))}
      </div>
      <div className="bz-col-labels" aria-hidden="true">
        {data.map((d) => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  );
}
