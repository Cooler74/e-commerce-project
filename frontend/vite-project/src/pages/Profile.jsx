import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* User Details Section */}
        <div className="profile-sidebar">
          <h2>User Profile</h2>
          <div className="profile-card">
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>

        {/* Order History Placeholder Section */}
        <div className="profile-main">
          <h2>Order History</h2>
          <div className="order-placeholder">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => window.location.href = '/'}>Go Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;