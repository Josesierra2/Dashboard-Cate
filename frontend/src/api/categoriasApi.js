// Cliente HTTP para el modelo Categoria.
//
// IMPORTANTE: el backend todavía NO tiene un @RestController para Categoria.
// Estas rutas siguen la convención REST de ServiciosCategoria
// (guardCategoria, buscar, modificar, eliminar). Si el controlador usa otra
// ruta, solo hay que cambiar VITE_CATEGORIAS_API en .env.
//
//   GET    /api/categorias        -> ServiciosCategoria.buscar()
//   POST   /api/categorias        -> ServiciosCategoria.guardCategoria(categoria)
//   PUT    /api/categorias/{id}   -> ServiciosCategoria.modificar(id, categoria)
//   DELETE /api/categorias/{id}   -> ServiciosCategoria.eliminar(id)
//
// JSON esperado de una categoría:
//   { id, nombre, descripcion, retos: [ { id, nombre, descripcion, fecha_inicio, fecha_fin, estado } ] }
// OJO: con el modelo actual `retos` NO llega, porque Categoria.retos tiene
// @JsonBackReference (ver README, pendientes del backend).

const BASE = import.meta.env.VITE_CATEGORIAS_API || '/api/categorias';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.error || '';
    } catch {
      /* sin cuerpo JSON */
    }
    const err = new Error(detail || `Error ${res.status} al llamar ${url}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const categoriasApi = {
  listar: () => request(BASE),
  crear: (c) => request(BASE, { method: 'POST', body: JSON.stringify(c) }),
  modificar: (id, c) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(c) }),
  eliminar: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
