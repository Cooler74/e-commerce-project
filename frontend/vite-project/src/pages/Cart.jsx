import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Added AuthContext check
import './Cart.css';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext); // Get user login status
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    // BUG FIX: If user is logged in, go straight to shipping. 
    // Otherwise, go to login with a redirect query
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Bag</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your bag is currently empty.</p>
          <Link to="/" className="continue-shopping">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left Column: List of Items */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="item-name">{item.name}</Link>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toLocaleString()}</p>
                </div>

                <div className="cart-item-qty">
                  <label>Qty:</label>
                  <select 
                    value={item.qty} 
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                  >
                    {/* Performance Optimization: Cap dropdown at 10 or countInStock */}
                    {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="cart-item-actions">
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item._id)}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="cart-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-shipping">FREE</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Estimated Total:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            
            <button 
              className="checkout-btn" 
              onClick={checkoutHandler}
              disabled={cartItems.length === 0} // Safety check
            >
              Proceed to Checkout
            </button>
            
            <Link to="/" className="back-to-shop">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;