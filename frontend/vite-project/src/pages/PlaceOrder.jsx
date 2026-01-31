import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import './PlaceOrder.css';

const stripePromise = loadStripe('pk_test_51SuD8FRioIlE7Ururm4XSmS5Yb7K68E37KUpU2GDxkLP4Op2cSlAJrVXipV2PVqlcr65vx99lKboLi8hXaMswg0200gm26PYxY');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const { cartItems, totalPrice, clearCart, shippingAddress } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Added to track specific errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null); // Reset error state on new attempt

    try {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
      const token = userInfo ? userInfo.token : localStorage.getItem('token');

      // STEP 1: Get the Client Secret from your Backend
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount: totalPrice }), 
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      const clientSecret = data.client_secret;

      // STEP 2: Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userInfo ? userInfo.name : 'Customer', 
          },
        },
      });

      // --- FAILURE HANDLING: Stripe Specific Errors ---
      if (result.error) {
        console.error("Stripe Failure:", result.error.message);
        setErrorMessage(result.error.message);
        setLoading(false); // Stop loading so user can try again
        return; // Exit the function
      }

      // STEP 3: Payment Successful!
      if (result.paymentIntent.status === 'succeeded') {
        
        console.log("Payment confirmed. Saving order and sending email...");
        
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderItems: cartItems,
            shippingAddress: shippingAddress || { address: '123 Main St', city: 'City', postalCode: '12345' },
            paymentMethod: 'Stripe',
            itemsPrice: totalPrice,
            shippingPrice: 0,
            totalPrice: totalPrice,
          }),
        });

        if (orderResponse.ok) {
          console.log("Order saved and email triggered!");
          clearCart();
          navigate('/success');
        } else {
          const errorData = await orderResponse.json();
          setErrorMessage(`Order Save Error: ${errorData.message}`);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("General Checkout Error:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Payment Details</h3>
      
      {/* Visual Feedback for Failures */}
      {errorMessage && (
        <div style={{ color: '#e74c3c', backgroundColor: '#fdf2f2', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', border: '1px solid #e74c3c' }}>
          <strong>Payment Failed:</strong> {errorMessage}
        </div>
      )}

      <div className="card-element-container">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      
      <button disabled={!stripe || loading || totalPrice <= 0} className="place-order-btn">
        {loading ? 'Processing...' : `Pay $${totalPrice}`}
      </button>
    </form>
  );
};

const PlaceOrder = () => {
  const { cartItems, totalPrice } = useContext(CartContext);

  return (
    <div className="place-order-container">
      <h1 style={{ marginBottom: '30px', fontWeight: '800' }}>Secure Checkout</h1>
      <div className="checkout-grid">
        <div className="order-summary-box">
          <h3>Order Review</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
                <small>Qty: {item.qty}</small>
              </div>
              <p style={{ fontWeight: '600' }}>${(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <p style={{ fontSize: '18px' }}>Total: <strong>${totalPrice.toLocaleString()}</strong></p>
          </div>
        </div>

        <div className="payment-section-box">
          <h3>Payment Method</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>All transactions are secure and encrypted.</p>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;