// Utilidades puras para el dashboard de Retos (no dependen de React).

const MS_DIA = 24 * 60 * 60 * 1000;
export const DIAS_POR_VENCER = 7;

/** Convierte "YYYY-MM-DD" (LocalDate de Java) a Date local sin desfase de zona horaria. */
export function parseFecha(valor) {
  if (!valor) return null;
  if (Array.isArray(valor)) {
    // Algunos Jackson serializan LocalDate como [2026, 10, 12]
    const [y, m, d] = valor;
    return new Date(y, m - 1, d);
  }
  const [y, m, d] = String(valor).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function hoy() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function diasEntre(a, b) {
  return Math.round((b - a) / MS_DIA);
}

const fmt = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
export function formatearFecha(valor) {
  const d = parseFecha(valor);
  return d ? fmt.format(d).replace('.', '') : '—';
}

/** "estado" es texto libre en el modelo; lo normalizamos solo para agrupar. */
export function normalizarEstado(estado) {
  const e = (estado || '').trim();
  if (!e) return 'Sin estado';
  return e.charAt(0).toUpperCase() + e.slice(1);
}

export function estaCerrado(estado) {
  return /complet|finaliz|termin|cerrad|cancel|logrado|hecho/i.test(estado || '');
}

/**
 * Situación del reto según sus fechas (se calcula en el frontend, no existe en el modelo):
 *  - cerrado:    el estado indica que ya terminó o se canceló
 *  - por_iniciar: fecha_inicio > hoy
 *  - vencido:    fecha_fin < hoy y no está cerrado
 *  - por_vencer: faltan <= 7 días para fecha_fin
 *  - en_curso:   el resto
 */
export function situacion(reto, ref = hoy()) {
  if (estaCerrado(reto.estado)) return 'cerrado';
  const ini = parseFecha(reto.fecha_inicio);
  const fin = parseFecha(reto.fecha_fin);
  if (ini && ini > ref) return 'por_iniciar';
  if (fin && fin < ref) return 'vencido';
  if (fin && diasEntre(ref, fin) <= DIAS_POR_VENCER) return 'por_vencer';
  return 'en_curso';
}

export const SITUACIONES = {
  en_curso: { label: 'En curso', badge: 'bz-badge-info' },
  por_vencer: { label: 'Por vencer', badge: 'bz-badge-warning' },
  vencido: { label: 'Vencido', badge: 'bz-badge-critical' },
  por_iniciar: { label: 'Por iniciar', badge: 'bz-badge-neutral' },
  cerrado: { label: 'Cerrado', badge: 'bz-badge-good' },
};

/** Badge para el texto de "estado" que viene del backend. */
export function badgeEstado(estado) {
  const e = (estado || '').toLowerCase();
  if (/cancel|rechaz/.test(e)) return 'bz-badge-critical';
  if (estaCerrado(e)) return 'bz-badge-good';
  if (/progreso|curso|activo|ejecu/.test(e)) return 'bz-badge-info';
  if (/revis|espera|pausa/.test(e)) return 'bz-badge-warning';
  return 'bz-badge-neutral';
}

export function contarPor(lista, clave) {
  const mapa = new Map();
  for (const item of lista) {
    const k = clave(item);
    mapa.set(k, (mapa.get(k) || 0) + 1);
  }
  return [...mapa.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

const fmtMes = new Intl.DateTimeFormat('es-CO', { month: 'short' });

/** Retos que inician en cada uno de los últimos N meses (incluye meses en 0). */
export function retosPorMesInicio(retos, meses = 12, ref = hoy()) {
  const buckets = [];
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: fmtMes.format(d).replace('.', '') + (d.getMonth() === 0 || i === meses - 1 ? ` ${String(d.getFullYear()).slice(2)}` : ''), titulo: `${fmtMes.format(d).replace('.', '')} ${d.getFullYear()}`, value: 0 });
  }
  const idx = new Map(buckets.map((b, i) => [b.key, i]));
  for (const r of retos) {
    const d = parseFecha(r.fecha_inicio);
    if (!d) continue;
    const i = idx.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (i !== undefined) buckets[i].value += 1;
  }
  return buckets;
}

export function duracionDias(reto) {
  const ini = parseFecha(reto.fecha_inicio);
  const fin = parseFecha(reto.fecha_fin);
  if (!ini || !fin) return null;
  return diasEntre(ini, fin);
}

/** Porcentaje de tiempo transcurrido del reto (0–100). */
export function avanceTiempo(reto, ref = hoy()) {
  const ini = parseFecha(reto.fecha_inicio);
  const fin = parseFecha(reto.fecha_fin);
  if (!ini || !fin || fin <= ini) return null;
  const p = ((ref - ini) / (fin - ini)) * 100;
  return Math.max(0, Math.min(100, Math.round(p)));
}
