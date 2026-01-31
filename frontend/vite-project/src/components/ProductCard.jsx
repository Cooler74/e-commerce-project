import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Stock logic
  const isOutOfStock = product.countInStock <= 0;
  // Low stock is between 1 and 3
  const isLowStock = product.countInStock > 0 && product.countInStock <= 3;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-container" style={{ position: 'relative' }}>
          <img src={product.image} alt={product.name} />
          
          {/* Badge Overlay */}
          {isOutOfStock && (
            <span className="badge out-of-stock">Out of Stock</span>
          )}
          {isLowStock && (
            <span className="badge low-stock">Only {product.countInStock} Left!</span>
          )}
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">${product.price.toLocaleString()}</p>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        disabled={isOutOfStock} 
        onClick={() => addToCart(product, 1)}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;