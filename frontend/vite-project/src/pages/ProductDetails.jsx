import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { CartContext } from '../context/CartContext';
import Loader from '../components/Loader'; 
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found'); // Handle 404s
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to load product");
        navigate('/'); // Redirect user if product doesn't exist
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    
    toast.success(`${qty} x ${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "colored" // Matches your professional UI
    });
  };

  // Use the loading state for the professional Loader
  if (loading) return <Loader />;

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 3;

  const maxVisualStock = 10; 
  const stockPercentage = Math.min((product.countInStock / maxVisualStock) * 100, 100);

  const getStatusColor = () => {
    if (product.countInStock === 0) return '#bdc3c7'; 
    if (product.countInStock <= 3) return '#e74c3c'; 
    if (product.countInStock <= 5) return '#f39c12'; 
    return '#2ecc71'; 
  };

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Collection
      </button>
      
      <div className="product-details-content">
        <div className="details-image-section">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info-section">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          
          <div className="price-tag">${product.price.toLocaleString()}</div>

          <div className="status-container">
            Status: 
            <span className={isOutOfStock ? 'status-out' : 'status-in'}>
              {isOutOfStock ? ' Out of Stock' : ' In Stock'}
            </span>
          </div>

          <div className="stock-level-container">
            <div className="stock-text">
              {isOutOfStock ? (
                "Currently Unavailable"
              ) : (
                <>Availability: <strong>{product.countInStock} items</strong> left</>
              )}
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${stockPercentage}%`, 
                  backgroundColor: getStatusColor() 
                }}
              ></div>
            </div>
          </div>

          {isLowStock && (
            <div className="low-stock-alert">
              ⚠️ Only {product.countInStock} left in stock - order soon!
            </div>
          )}

          {!isOutOfStock && (
            <div className="qty-selector">
              <label>Quantity:</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {/* Cap selection at 10 to keep it manageable, or use countInStock */}
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={addToCartHandler} 
            disabled={isOutOfStock}
            className="main-add-btn"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;