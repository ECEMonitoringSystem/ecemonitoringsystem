// src/Instructor.js
import React, { useState } from 'react';
import '../CSS/Instructor.css';

function Instructor() {
  // State to control which view is shown: 'login' | 'forgot' | 'register'
  const [view, setView] = useState('login');

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting ${view} form with data:\n${JSON.stringify(formData, null, 2)}`);
    // Here you can add your API call or authentication logic
  };

  if (view === 'login') {
    return (
      <div className="instructor-container">
        <h1>Instructor Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="login-links">
          <button onClick={() => setView('forgot')} className="link-button">Forgot Password?</button>
          <button onClick={() => setView('register')} className="link-button">Register</button>
        </div>
      </div>
    );
  }

  if (view === 'forgot') {
    return (
      <div className="instructor-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        <button onClick={() => setView('login')} className="link-button">Back to Login</button>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="instructor-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <button onClick={() => setView('login')} className="link-button">Back to Login</button>
      </div>
    );
  }

  // Optional fallback (should never reach here)
  return null;
}

export default Instructor;
