import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, title, message, confirmText = 'Eliminar', busy, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={busy ? undefined : onCancel}
      size="sm"
      footer={
        <>
          <button type="button" className="bz-btn" onClick={onCancel} disabled={busy}>Cancelar</button>
          <button type="button" className="bz-btn bz-btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Eliminando…' : confirmText}
          </button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--bz-text-2)' }}>{message}</p>
    </Modal>
  );
}
