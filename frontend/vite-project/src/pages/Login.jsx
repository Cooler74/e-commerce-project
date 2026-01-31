import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        // Optional: Success toast for login
        toast.success('Welcome back!'); 
        navigate('/');
      } else {
        // REPLACED alert with error toast
        toast.error(data.message || 'Login Failed'); 
      }
    } catch (err) {
      // REPLACED alert with error toast
      toast.error('Something went wrong. Is your backend running?'); 
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitHandler}>
        <h1>Sign In</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
        <p>New Customer? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default Login;