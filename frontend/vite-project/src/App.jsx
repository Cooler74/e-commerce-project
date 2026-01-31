import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails'; 
import Cart from './pages/Cart';
import Login from './pages/Login';      
import Register from './pages/Register'; 
import Profile from './pages/Profile'; 
import PrivateRoute from './components/PrivateRoute'; 
import Shipping from './pages/Shipping'; 
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import Success from './pages/Success';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductList from './pages/AdminProductList';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminOrderList from './pages/AdminOrderList';
import AdminUserList from './pages/AdminUserList';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      {/* 1. Global Toast Configuration */}
      {/* We set autoClose to 2000ms so it disappears quickly without user action */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />
      
      <div className="App">
        <Navbar setSearchTerm={setSearchTerm} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Products searchTerm={searchTerm} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/success" element={<Success />} />

          {/* User Protected Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
          </Route>

          {/* Admin Protected Routes - Combined into one block for clarity */}
          <Route path='/admin' element={<AdminRoute />}>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='productlist' element={<AdminProductList />} />
            <Route path='product/:id/edit' element={<AdminProductEdit />} />
            <Route path='orderlist' element={<AdminOrderList />} />
            <Route path='userlist' element={<AdminUserList />} />
          </Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;