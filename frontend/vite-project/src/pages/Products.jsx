import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Added to read URL params
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader'; // Using your professional loader
import '../App.css';

const Products = () => { // Removed searchTerm prop, we'll get it from URL
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Hook to access the URL search string (?search=...)
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchTerm = queryParams.get('search') || ''; // Extract 'search' value

  const categories = ['Electronics', 'Clothing', 'Accessories', 'Footwear'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

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
  }, [category, searchTerm]); // Now updates when either changes

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
        
        {loading ? (
          <Loader /> // Using your standardized Loader component
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