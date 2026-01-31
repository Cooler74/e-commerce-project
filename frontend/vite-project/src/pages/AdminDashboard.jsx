import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'; // Added Recharts components
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    salesByDate: [], // State to hold graph data
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/summary', config);
        
        setStats({
          totalSales: data.totalSales,
          totalOrders: data.numOrders,
          totalUsers: data.numUsers,
          totalProducts: data.numProducts,
          salesByDate: data.salesByDate, // Map graph data from backend
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.token) {
      fetchDashboardData();
    }
  }, [userInfo]);

  if (loading) return <div className="admin-dashboard-container">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, <strong>{userInfo?.name}</strong>.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>Total Sales</h3>
            <p>${stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
          </div>
          <div className="stat-info">
            <p>{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="stat-info">
            <h3>Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* --- NEW: Sales Trend Graph Section --- */}
      <div className="dashboard-chart-section">
        <h3>Sales Revenue Trend</h3>
        <div className="chart-container" style={{ width: '100%', height: 350, marginTop: '20px' }}>
          <ResponsiveContainer>
            <AreaChart data={stats.salesByDate}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498db" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="_id" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#3498db" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-content">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/admin/productlist')}>
            Manage Products
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/orderlist')}>
            Review Orders
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/userlist')}>
            User Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;