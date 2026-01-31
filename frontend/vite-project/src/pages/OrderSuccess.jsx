import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Thank You for Your Order!</h1>
        <p className="order-msg">
          Your order has been placed successfully. We’ll send you an email 
          confirmation with your order details and tracking information shortly.
        </p>
        
        <div className="success-actions">
          <Link to="/" className="btn-continue">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn-outline">
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;