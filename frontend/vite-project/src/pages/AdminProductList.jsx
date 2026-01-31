import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal'; 
import './AdminDashboard.css';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    title: '', 
    message: '', 
    confirmText: '', // New field
    confirmType: '', // 'delete' or 'create'
    onConfirm: () => {} 
  });
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE LOGIC: Configured with 'delete' type
  const deleteHandler = (id) => {
    setModalConfig({
      title: 'Delete Product?',
      message: 'Are you sure you want to permanently remove this product from the inventory?',
      confirmText: 'Delete',
      confirmType: 'delete', 
      onConfirm: () => executeDelete(id)
    });
    setShowModal(true);
  };

  const executeDelete = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/products/${id}`, config);
      toast.info('Product deleted successfully');
      setShowModal(false);
      fetchProducts(); 
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setShowModal(false);
    }
  };

  // CREATE LOGIC: Configured with 'create' type
  const createProductHandler = () => {
    setModalConfig({
      title: 'Create Sample Product?',
      message: 'This will add a new sample product to your store. You can edit it immediately after.',
      confirmText: 'Create',
      confirmType: 'create',
      onConfirm: executeCreate
    });
    setShowModal(true);
  };

  const executeCreate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/products', {}, config);
      toast.success('Sample product created!');
      setShowModal(false);
      fetchProducts(); 
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setShowModal(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard-container">
      {/* Updated Modal component call with type and text props */}
      <ConfirmModal 
        show={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmClass={modalConfig.confirmType === 'delete' ? 'modal-btn-confirm' : 'modal-btn-create'}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setShowModal(false)}
      />

      <div className="admin-header">
        <h1>Product Management</h1>
        <button className="action-btn" onClick={createProductHandler}>
          <i className="fas fa-plus"></i> Create Product
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 10)}...</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                    aria-label="Edit Product"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteHandler(product._id)}
                    aria-label="Delete Product"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;