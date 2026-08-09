/**
 * Modal.jsx
 * ---------
 * Basic overlay modal. Renders nothing when `open` is false.
 * TODO: portal into document.body and add focus-trap/escape-to-close.
 *
 * Props:
 *  - open: bool
 *  - onClose: () => void
 */

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
