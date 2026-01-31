import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]);

  if (loading) return <div className="loader">Loading your orders...</div>;

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Orders</h1>
        <p>Manage and track your recent purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-history">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="shop-now-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="header-info">
                  <span className="label">DATE</span>
                  <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="header-info">
                  <span className="label">TOTAL</span>
                  <span className="value">${order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="header-id">
                  <span className="label">ORDER #</span>
                  <span className="value">{order._id.substring(0, 10)}...</span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="status-badges">
                  <span className={`badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Paid' : 'Payment Pending'}
                  </span>
                  <span className={`badge ${order.isDelivered ? 'delivered' : 'processing'}`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
                
                {/* Show first item as a preview */}
                <div className="order-preview">
                  <img src={order.orderItems[0].image} alt="product" width="50" />
                  <p>{order.orderItems[0].name} {order.orderItems.length > 1 && `+ ${order.orderItems.length - 1} more`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;