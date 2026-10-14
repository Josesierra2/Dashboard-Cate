// Utilidades puras para el dashboard de Categorías. Reutiliza las reglas de
// situación de utils/retos.js (sin modificarlo).
import { situacion } from './retos.js';

export const retosDe = (cat) => (Array.isArray(cat.retos) ? cat.retos : []);

/** Conteo de retos de una categoría por situación. */
export function resumenCategoria(cat) {
  const r = { total: 0, en_curso: 0, por_vencer: 0, vencido: 0, por_iniciar: 0, cerrado: 0 };
  for (const reto of retosDe(cat)) {
    r.total += 1;
    r[situacion(reto)] += 1;
  }
  return r;
}

/** Todos los retos de todas las categorías (para gráficas globales). */
export const todosLosRetos = (categorias) => categorias.flatMap(retosDe);

/** true si el API devolvió categorías pero ninguna trae el campo `retos`. */
export const apiSinRetos = (categorias) =>
  categorias.length > 0 && categorias.every((c) => !Array.isArray(c.retos));
