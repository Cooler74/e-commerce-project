import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText, confirmClass }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className={confirmClass || 'modal-btn-confirm'} onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; // Ensure this line exists!