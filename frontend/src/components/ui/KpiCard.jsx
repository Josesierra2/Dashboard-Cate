/** Tarjeta de indicador. `tone` usa los colores de estado del tema (good, warning, critical, info, neutral). */
export default function KpiCard({ label, value, foot, tone = 'neutral', loading }) {
  return (
    <div className="bz-card bz-kpi">
      <span className="bz-kpi-label">
        <span className="bz-kpi-dot" style={{ background: `var(--bz-${tone})` }} aria-hidden="true" />
        {label}
      </span>
      {loading ? (
        <span className="bz-skeleton" style={{ height: 35, width: 64 }} />
      ) : (
        <span className="bz-kpi-value">{value}</span>
      )}
      {foot && <span className="bz-kpi-foot">{foot}</span>}
    </div>
  );
}
