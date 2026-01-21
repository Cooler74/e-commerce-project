import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../App.css';

const Products = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New error state

  const categories = ['Electronics', 'Clothing', 'Accessories', 'Footwear'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on new search

        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm]);

  return (
    <div className="shop-layout">
      <aside className="sidebar">
        <h3>Filter by Category</h3>
        <ul>
          <li className={category === '' ? 'active' : ''} onClick={() => setCategory('')}>
            All Products
          </li>
          {categories.map((cat) => (
            <li 
              key={cat} 
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        <h1>{searchTerm ? `Results for "${searchTerm}"` : (category || 'Our Collection')}</h1>
        
        {/* CONDITIONAL RENDERING */}
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Fetching products...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            ⚠️ Error: {error}. Please ensure the backend server is running.
          </div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
              <p>No products found matching your search.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;