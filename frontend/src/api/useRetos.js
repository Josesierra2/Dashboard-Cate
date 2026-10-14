import { useCallback, useEffect, useState } from 'react';
import { retosApi } from './retosApi.js';
import { crearRetosDemo } from './retosDemo.js';

/**
 * Carga y CRUD de retos. Si el API no responde, activa el modo demo
 * (datos de ejemplo en memoria) para poder ver y probar el dashboard.
 */
export function useRetos() {
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demo, setDemo] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await retosApi.listar();
      setRetos(Array.isArray(data) ? data : []);
      setDemo(false);
    } catch (e) {
      setError(e);
      setRetos(crearRetosDemo());
      setDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = useCallback(async (reto) => {
    if (demo) {
      const nuevo = { ...reto, id: `demo-${Date.now()}` };
      setRetos((rs) => [nuevo, ...rs]);
      return nuevo;
    }
    const creado = await retosApi.crear(reto);
    setRetos((rs) => [creado, ...rs]);
    return creado;
  }, [demo]);

  const modificar = useCallback(async (id, reto) => {
    if (demo) {
      // Igual que ServiciosReto.modificar: solo cambia nombre y descripción
      setRetos((rs) => rs.map((r) => (r.id === id ? { ...r, nombre: reto.nombre, descripcion: reto.descripcion } : r)));
      return;
    }
    const actualizado = await retosApi.modificar(id, reto);
    setRetos((rs) => rs.map((r) => (r.id === id ? { ...r, ...actualizado } : r)));
  }, [demo]);

  const eliminar = useCallback(async (id) => {
    if (!demo) await retosApi.eliminar(id);
    setRetos((rs) => rs.filter((r) => r.id !== id));
  }, [demo]);

  return { retos, loading, error, demo, recargar: cargar, crear, modificar, eliminar };
}
