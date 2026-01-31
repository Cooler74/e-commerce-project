import React, { useContext, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [keyword, setKeyword] = useState('');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Updates URL to trigger filtering in Products.jsx
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <Link to="/" className="nav-logo">
        E-SHOP
      </Link>

      {/* FIXED: Functional Search Bar without rogue icon */}
      <form onSubmit={submitHandler} className="search-container">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="search-input" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} 
        />
        {/* We removed the button tag; 'Enter' still submits the form */}
      </form>

      {/* Right Side Navigation */}
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {/* --- ADMIN LINKS --- */}
        {userInfo && userInfo.isAdmin && (
          <div className="admin-nav-item">
            <button 
              className="admin-dropdown-btn" 
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
            >
              Admin <i className="fas fa-caret-down"></i>
            </button>
            
            {adminMenuOpen && (
              <div className="admin-dropdown-content">
                <Link to="/admin/dashboard" onClick={() => setAdminMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/productlist" onClick={() => setAdminMenuOpen(false)}>Products</Link>
                <Link to="/admin/orderlist" onClick={() => setAdminMenuOpen(false)}>Orders</Link>
                <Link to="/admin/userlist" onClick={() => setAdminMenuOpen(false)}>Users</Link>
              </div>
            )}
          </div>
        )}

        {userInfo ? (
          <div className="user-nav">
            <span className="user-greeting">Hi, {userInfo.name}</span>
            <button className="logout-btn" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">Sign In</Link>
        )}

        {/* Cart Icon with Badge */}
        <Link to="/cart" className="cart-icon-container">
          <i className="fas fa-shopping-cart cart-icon"></i>
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;