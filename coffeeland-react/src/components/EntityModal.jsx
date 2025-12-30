import { X } from 'lucide-react';
import '../styles/EntityModal.css';

const EntityModal = ({ isOpen, onClose, title, content, type = 'default' }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content ${type}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {content}
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
