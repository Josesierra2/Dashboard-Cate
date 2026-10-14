// Cliente HTTP para el modelo Reto.
//
// IMPORTANTE: el backend todavía NO tiene un @RestController para Reto.
// Estas rutas siguen la convención REST que corresponde a los métodos de
// ServiciosReto (guardaReto, buscar, modificar, eliminar). Si el controlador
// que se cree usa otra ruta, solo hay que cambiar VITE_RETOS_API en .env.
//
//   GET    /api/retos        -> ServiciosReto.buscar()
//   POST   /api/retos        -> ServiciosReto.guardaReto(reto)
//   PUT    /api/retos/{id}   -> ServiciosReto.modificar(id, reto)
//   DELETE /api/retos/{id}   -> ServiciosReto.eliminar(id)
//
// Forma del JSON que devuelve Spring para Reto (según los getters del modelo;
// empresa, categoria y prioridad NO se serializan por @JsonBackReference):
//   { id, nombre, descripcion, fecha_inicio: "YYYY-MM-DD", fecha_fin: "YYYY-MM-DD", estado }

const BASE = import.meta.env.VITE_RETOS_API || '/api/retos';

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

export const retosApi = {
  listar: () => request(BASE),
  crear: (reto) => request(BASE, { method: 'POST', body: JSON.stringify(reto) }),
  modificar: (id, reto) =>
    request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(reto) }),
  eliminar: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
