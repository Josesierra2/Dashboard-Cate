import { useEffect, useRef } from 'react';

/** Modal accesible reutilizable. Cierra con Esc o clic fuera. */
export default function Modal({ open, title, onClose, children, footer, size }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const first = ref.current?.querySelector('input, textarea, select, button');
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="bz-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        ref={ref}
        className={`bz-modal ${size === 'sm' ? 'bz-modal-sm' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bz-modal-title"
      >
        <div className="bz-modal-header">
          <h2 id="bz-modal-title" className="bz-card-title">{title}</h2>
        </div>
        <div className="bz-modal-body">{children}</div>
        {footer && <div className="bz-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
