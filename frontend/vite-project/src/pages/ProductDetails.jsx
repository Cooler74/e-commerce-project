import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- ADDED QUANTITY STATE ---
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handler for Add to Cart (we will connect this to the Cart page on Day 7)
  const addToCartHandler = () => {
    console.log(`Adding ${qty} of ${product.name} to cart`);
    // Example: navigate(`/cart/${id}?qty=${qty}`);
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Products</button>
      
      <div className="details-content">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="category-tag">{product.category}</p>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          
          <div className="stock-status">
            Status: {product.countInStock > 0 ? (
              <span className="in-stock">In Stock ({product.countInStock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {/* --- QUANTITY SELECTOR --- */}
          {product.countInStock > 0 && (
            <div className="qty-selector">
              <span>Quantity:</span>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="add-to-cart-big" 
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;