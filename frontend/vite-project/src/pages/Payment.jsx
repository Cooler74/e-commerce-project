import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
  if (!shippingAddress) {
    navigate('/shipping');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <span className="step">Shipping</span>
        <span className="step-line"></span>
        <span className="step active">Payment</span>
        <span className="step-line"></span>
        <span className="step">Place Order</span>
      </div>

      <div className="shipping-card">
        <h1>Select Payment Method</h1>
        <form onSubmit={submitHandler} className="shipping-form">
          
          <div className="form-group">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>PayPal or Credit Card</span>
            </label>
          </div>

          <div className="form-group">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="MTN Mobile Money"
                checked={paymentMethod === 'MTN Mobile Money'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>MTN Mobile Money (MoMo)</span>
            </label>
          </div>

          <div className="form-group">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="Orange Money"
                checked={paymentMethod === 'Orange Money'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Orange Money</span>
            </label>
          </div>

          <button type="submit" className="continue-btn">
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;