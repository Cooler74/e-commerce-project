import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader'; // Professional spinner
import './AdminDashboard.css';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { userInfo } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users"); //
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/users/${id}`, config);
        toast.info('User deleted successfully'); // Stylish info toast
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || error.message); //
      }
    }
  };

  const toggleAdminHandler = async (user) => {
    if (window.confirm(`Change admin status for ${user.name}?`)) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.put(
          `/api/users/${user._id}`,
          { isAdmin: !user.isAdmin },
          config
        );
        
        toast.success(`Role updated for ${user.name}!`); // Success feedback
        fetchUsers(); 
      } catch (error) {
        toast.error(error.response?.data?.message || error.message); //
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>User Management</h1>
      </div>
      
      {/* Table wrapper for mobile responsiveness */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.substring(0, 10)}...</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => toggleAdminHandler(user)}
                    title="Toggle Admin Rights"
                    aria-label="Toggle Admin" // Accessibility polish
                  >
                    <i className="fas fa-user-shield"></i>
                  </button>

                  {userInfo._id !== user._id && (
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteHandler(user._id)}
                      aria-label="Delete User" // Accessibility polish
                    >
                      <i className="fas fa-trash"></i>
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

export default AdminUserList;