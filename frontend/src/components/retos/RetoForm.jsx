import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';

const VACIO = { nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: 'Pendiente' };
const ESTADOS_SUGERIDOS = ['Pendiente', 'En progreso', 'En revisión', 'Finalizado', 'Cancelado'];

// Límites tomados de las anotaciones @Column del modelo Reto
const MAX = { nombre: 50, descripcion: 200, estado: 50 };

function validar(v, editando) {
  const e = {};
  if (!v.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
  else if (v.nombre.length > MAX.nombre) e.nombre = `Máximo ${MAX.nombre} caracteres.`;
  if ((v.descripcion || '').length > MAX.descripcion) e.descripcion = `Máximo ${MAX.descripcion} caracteres.`;
  if (!editando) {
    if (!v.fecha_inicio) e.fecha_inicio = 'La fecha de inicio es obligatoria.';
    if (!v.fecha_fin) e.fecha_fin = 'La fecha de fin es obligatoria.';
    if (v.fecha_inicio && v.fecha_fin && v.fecha_fin < v.fecha_inicio) e.fecha_fin = 'Debe ser igual o posterior al inicio.';
    if (!v.estado.trim()) e.estado = 'El estado es obligatorio.';
    else if (v.estado.length > MAX.estado) e.estado = `Máximo ${MAX.estado} caracteres.`;
  }
  return e;
}

/**
 * Crear / editar reto.
 * Al editar solo se habilitan nombre y descripción, porque
 * ServiciosReto.modificar() únicamente actualiza esos dos campos.
 */
export default function RetoForm({ open, reto, estadosExistentes = [], onClose, onSubmit }) {
  const editando = Boolean(reto);
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  useEffect(() => {
    if (!open) return;
    setValores(reto ? {
      nombre: reto.nombre || '',
      descripcion: reto.descripcion || '',
      fecha_inicio: (reto.fecha_inicio || '').slice(0, 10),
      fecha_fin: (reto.fecha_fin || '').slice(0, 10),
      estado: reto.estado || '',
    } : VACIO);
    setErrores({});
    setErrorApi('');
  }, [open, reto]);

  const set = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    const errs = validar(valores, editando);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setEnviando(true);
    setErrorApi('');
    try {
      const payload = { ...valores, descripcion: valores.descripcion.trim() || null, nombre: valores.nombre.trim() };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrorApi(err.message || 'No se pudo guardar el reto.');
    } finally {
      setEnviando(false);
    }
  }

  const estados = [...new Set([...ESTADOS_SUGERIDOS, ...estadosExistentes])];

  return (
    <Modal
      open={open}
      title={editando ? 'Editar reto' : 'Nuevo reto'}
      onClose={enviando ? undefined : onClose}
      footer={
        <>
          <button type="button" className="bz-btn" onClick={onClose} disabled={enviando}>Cancelar</button>
          <button type="submit" form="reto-form" className="bz-btn bz-btn-primary" disabled={enviando}>
            {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear reto'}
          </button>
        </>
      }
    >
      <form id="reto-form" className="bz-form-grid" onSubmit={enviar} noValidate>
        {errorApi && <div className="bz-alert bz-alert-critical bz-span-2" role="alert">{errorApi}</div>}

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="reto-nombre">Nombre *</label>
          <input id="reto-nombre" className="bz-input" value={valores.nombre} onChange={set('nombre')}
            maxLength={MAX.nombre} aria-invalid={Boolean(errores.nombre)} />
          {errores.nombre ? <span className="bz-error-text">{errores.nombre}</span>
            : <span className="bz-help">{valores.nombre.length}/{MAX.nombre}</span>}
        </div>

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="reto-desc">Descripción</label>
          <textarea id="reto-desc" className="bz-textarea" value={valores.descripcion} onChange={set('descripcion')}
            maxLength={MAX.descripcion} aria-invalid={Boolean(errores.descripcion)} />
          {errores.descripcion ? <span className="bz-error-text">{errores.descripcion}</span>
            : <span className="bz-help">{valores.descripcion.length}/{MAX.descripcion}</span>}
        </div>

        <div className="bz-field">
          <label className="bz-label" htmlFor="reto-ini">Fecha de inicio *</label>
          <input id="reto-ini" type="date" className="bz-input" value={valores.fecha_inicio} onChange={set('fecha_inicio')}
            disabled={editando} aria-invalid={Boolean(errores.fecha_inicio)} />
          {errores.fecha_inicio && <span className="bz-error-text">{errores.fecha_inicio}</span>}
        </div>

        <div className="bz-field">
          <label className="bz-label" htmlFor="reto-fin">Fecha de fin *</label>
          <input id="reto-fin" type="date" className="bz-input" value={valores.fecha_fin} onChange={set('fecha_fin')}
            min={valores.fecha_inicio || undefined} disabled={editando} aria-invalid={Boolean(errores.fecha_fin)} />
          {errores.fecha_fin && <span className="bz-error-text">{errores.fecha_fin}</span>}
        </div>

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="reto-estado">Estado *</label>
          <input id="reto-estado" className="bz-input" list="reto-estados" value={valores.estado} onChange={set('estado')}
            maxLength={MAX.estado} disabled={editando} aria-invalid={Boolean(errores.estado)} />
          <datalist id="reto-estados">{estados.map((e) => <option key={e} value={e} />)}</datalist>
          {errores.estado && <span className="bz-error-text">{errores.estado}</span>}
        </div>

        {editando && (
          <p className="bz-help bz-span-2" style={{ margin: 0 }}>
            Por ahora el servicio de Reto solo permite modificar el nombre y la descripción.
          </p>
        )}
      </form>
    </Modal>
  );
}
