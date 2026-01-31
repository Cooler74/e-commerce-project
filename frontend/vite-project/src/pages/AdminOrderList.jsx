import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for better UX
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader'; // Professional spinner component
import './AdminDashboard.css';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { 
        headers: { Authorization: `Bearer ${userInfo.token}` } 
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      // Replaced console.error with a toast notification
      toast.error(error.response?.data?.message || "Failed to fetch orders"); 
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchOrders();
    }
  }, [userInfo]);

  const deliverHandler = async (id) => {
    // Standard UX still uses confirm for destructive or major actions
    if (window.confirm('Mark as delivered?')) {
      try {
        const config = { 
          headers: { Authorization: `Bearer ${userInfo.token}` } 
        };
        await axios.put(`/api/orders/${id}/deliver`, {}, config);
        
        // Replaced alert with success toast
        toast.success('Order marked as Delivered and customer notified!'); 
        
        fetchOrders(); 
      } catch (error) {
        // Replaced alert with error toast
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Swapped the "Loading..." text for our visual Loader component
  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Order Management</h1>
      </div>
      
      {/* Added a wrapper for responsive horizontal scrolling on mobile */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}...</td>
                <td>{order.user ? order.user.name : 'Deleted User'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <span className="status-badge paid">{new Date(order.paidAt).toLocaleDateString()}</span>
                  ) : (
                    <span className="status-badge unpaid">Not Paid</span>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span className="status-badge delivered">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                  ) : (
                    <span className="status-badge pending">Pending</span>
                  )}
                </td>
                <td>
                  {!order.isDelivered && order.isPaid && (
                    <button 
                      className="action-btn" 
                      onClick={() => deliverHandler(order._id)}
                      aria-label="Mark order as delivered" // Accessibility polish
                    >
                      <i className="fas fa-shipping-fast"></i> Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;