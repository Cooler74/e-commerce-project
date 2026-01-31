import React, { useState, useContext } from 'react'; // Added useContext
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Import CartContext
import './Checkout.css';

const Shipping = () => {
  // 1. Pull shippingAddress and save function from Context
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);

  // 2. Initialize state using values from context
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    
    // 3. Save the data to Context (which also saves to localStorage automatically)
    saveShippingAddress({ address, city, postalCode, country });
    
    // 4. Move to the next step
    navigate('/payment');
  };

  return (
    <div className="checkout-container">
      {/* Progress Bar */}
      <div className="checkout-steps">
        <span className="step active">Shipping</span>
        <span className="step-line"></span>
        <span className="step">Payment</span>
        <span className="step-line"></span>
        <span className="step">Place Order</span>
      </div>

      <div className="shipping-card">
        <h1>Shipping Address</h1>
        <form onSubmit={submitHandler} className="shipping-form">
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;