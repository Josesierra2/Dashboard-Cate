import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';

const VACIO = { nombre: '', descripcion: '' };
// Categoria.nombre y .descripcion son @Column(nullable = false), sin length -> 255 por defecto en JPA
const MAX = { nombre: 255, descripcion: 255 };

function validar(v) {
  const e = {};
  if (!v.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
  else if (v.nombre.length > MAX.nombre) e.nombre = `Máximo ${MAX.nombre} caracteres.`;
  if (!v.descripcion.trim()) e.descripcion = 'La descripción es obligatoria.';
  else if (v.descripcion.length > MAX.descripcion) e.descripcion = `Máximo ${MAX.descripcion} caracteres.`;
  return e;
}

/** Crear / editar categoría. ServiciosCategoria.modificar actualiza nombre y descripción, así que ambos se pueden editar. */
export default function CategoriaForm({ open, categoria, onClose, onSubmit }) {
  const editando = Boolean(categoria);
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  useEffect(() => {
    if (!open) return;
    setValores(categoria ? { nombre: categoria.nombre || '', descripcion: categoria.descripcion || '' } : VACIO);
    setErrores({});
    setErrorApi('');
  }, [open, categoria]);

  const set = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    const errs = validar(valores);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setEnviando(true);
    setErrorApi('');
    try {
      await onSubmit({ nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() });
      onClose();
    } catch (err) {
      setErrorApi(err.message || 'No se pudo guardar la categoría.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      open={open}
      title={editando ? 'Editar categoría' : 'Nueva categoría'}
      onClose={enviando ? undefined : onClose}
      footer={
        <>
          <button type="button" className="bz-btn" onClick={onClose} disabled={enviando}>Cancelar</button>
          <button type="submit" form="categoria-form" className="bz-btn bz-btn-primary" disabled={enviando}>
            {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </>
      }
    >
      <form id="categoria-form" className="bz-form-grid" onSubmit={enviar} noValidate>
        {errorApi && <div className="bz-alert bz-alert-critical bz-span-2" role="alert">{errorApi}</div>}

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="cat-nombre">Nombre *</label>
          <input id="cat-nombre" className="bz-input" value={valores.nombre} onChange={set('nombre')}
            maxLength={MAX.nombre} aria-invalid={Boolean(errores.nombre)} />
          {errores.nombre && <span className="bz-error-text">{errores.nombre}</span>}
        </div>

        <div className="bz-field bz-span-2">
          <label className="bz-label" htmlFor="cat-desc">Descripción *</label>
          <textarea id="cat-desc" className="bz-textarea" value={valores.descripcion} onChange={set('descripcion')}
            maxLength={MAX.descripcion} aria-invalid={Boolean(errores.descripcion)} />
          {errores.descripcion ? <span className="bz-error-text">{errores.descripcion}</span>
            : <span className="bz-help">{valores.descripcion.length}/{MAX.descripcion}</span>}
        </div>
      </form>
    </Modal>
  );
}
