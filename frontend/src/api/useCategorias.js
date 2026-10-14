import { useCallback, useEffect, useState } from 'react';
import { categoriasApi } from './categoriasApi.js';
import { crearCategoriasDemo } from './categoriasDemo.js';

/**
 * Carga y CRUD de categorías (cada una con sus retos). Si el API no responde,
 * activa el modo demo (datos de ejemplo en memoria).
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demo, setDemo] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriasApi.listar();
      setCategorias(Array.isArray(data) ? data : []);
      setDemo(false);
    } catch (e) {
      setError(e);
      setCategorias(crearCategoriasDemo());
      setDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = useCallback(async (cat) => {
    if (demo) {
      const nueva = { ...cat, id: `demo-${Date.now()}`, retos: [] };
      setCategorias((cs) => [nueva, ...cs]);
      return nueva;
    }
    const creada = await categoriasApi.crear(cat);
    setCategorias((cs) => [{ retos: [], ...creada }, ...cs]);
    return creada;
  }, [demo]);

  // ServiciosCategoria.modificar actualiza nombre y descripcion
  const modificar = useCallback(async (id, cat) => {
    if (demo) {
      setCategorias((cs) => cs.map((c) => (c.id === id ? { ...c, nombre: cat.nombre, descripcion: cat.descripcion } : c)));
      return;
    }
    const actualizada = await categoriasApi.modificar(id, cat);
    setCategorias((cs) => cs.map((c) => (c.id === id ? { ...c, ...actualizada } : c)));
  }, [demo]);

  const eliminar = useCallback(async (id) => {
    if (!demo) await categoriasApi.eliminar(id);
    setCategorias((cs) => cs.filter((c) => c.id !== id));
  }, [demo]);

  return { categorias, loading, error, demo, recargar: cargar, crear, modificar, eliminar };
}
