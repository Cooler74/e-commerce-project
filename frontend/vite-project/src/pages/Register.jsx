import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Added missing import
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validation check with toast
    if (password !== confirmPassword) {
      toast.warning('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        // Success notification for a great first impression
        toast.success(`Welcome to E-SHOP, ${name}!`); 
        navigate('/');
      } else {
        // Replaced alert with error toast
        toast.error(data.message || 'Registration Failed');
      }
    } catch (err) {
      // Replaced alert with error toast
      toast.error('Something went wrong. Is your backend running?');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitHandler}>
        <h1>Create Account</h1>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;