import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div style={{ fontSize: '50px' }}>✅</div>
      <h1>Thank you for your purchase!</h1>
      <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
      <button 
        onClick={() => navigate('/')}
        className="main-add-btn" 
        style={{ marginTop: '20px' }}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default Success;