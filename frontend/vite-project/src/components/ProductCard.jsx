import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <p className="price">${product.price}</p>
      <button className="add-btn">Add to Cart</button>
    </div>
  );
};

export default ProductCard;