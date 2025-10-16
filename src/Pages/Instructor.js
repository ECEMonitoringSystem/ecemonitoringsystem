import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Instructor.css';
import logo from '../Images/logo.png'; // Import the app logo image

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (view === 'login') {
      if (formData.email && formData.password) {
        // Navigate to instructor profile page, passing email as param and state
        navigate(`/list-instructors/${encodeURIComponent(formData.email)}`, { state: { email: formData.email } });
      } else {
        alert('Please enter email and password.');
      }
    } else if (view === 'register') {
      // Basic validation for registration
      if (
        formData.name.trim() &&
        formData.email.trim() &&
        formData.password &&
        formData.confirmPassword
      ) {
        if (formData.password === formData.confirmPassword) {
          alert('Registration successful! Please log in.');
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
          });
          setView('login');
        } else {
          alert('Passwords do not match.');
        }
      } else {
        alert('Please fill in all fields.');
      }
    } else {
      // For 'forgot' or other views, you can add your logic or keep alert for now
      alert(`Submitting ${view} form with data:\n${JSON.stringify(formData, null, 2)}`);
    }
  };

  // Render shared logo above any form view
  const renderLogo = () => (
    <img src={logo} alt="App Logo" className="app-logo" />
  );

  if (view === 'login') {
    return (
      <div className="instructor-container">
        {renderLogo()}
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
        {renderLogo()}
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
        {renderLogo()}
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

  // Fallback (should not reach here)
  return null;
}

export default Instructor;
