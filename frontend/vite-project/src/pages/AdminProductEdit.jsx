import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/products/${productId}`,
        { name, price, image, category, countInStock, description },
        config
      );
      
      alert('Product Updated!');
      navigate('/admin/productlist'); // Go back to list after success
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <button className="action-btn" onClick={() => navigate('/admin/productlist')}>
        Go Back
      </button>

      <div className="edit-form-container">
        <h1>Edit Product</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Count In Stock</label>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <button type="submit" className="action-btn">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;