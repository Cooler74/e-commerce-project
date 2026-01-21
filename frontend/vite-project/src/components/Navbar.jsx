import React from 'react';
import './Navbar.css';

const Navbar = ({ setSearchTerm }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>E-SHOP</h2>
        </div>

        {/* --- ADDED SEARCH BAR --- */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search products..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul className="nav-menu">
          <li>Home</li>
          <li>Products</li>
        </ul>

        <div className="navbar-cart">
          <div className="cart-icon">
            🛒
            <span className="cart-count">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;