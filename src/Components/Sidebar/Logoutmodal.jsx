import React from 'react';
import './LogoutModal.css'; // You can style the modal in this CSS file

const LogoutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="logout-modal">
      <div className="modal-content">
        <p>Are you sure you want to log out?</p>
        <div className="buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};


export default LogoutModal;
