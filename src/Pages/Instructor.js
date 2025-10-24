import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../API/supabaseClient'; // Import Supabase
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

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Updated handleSubmit with Supabase Login & Register Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear old messages
    setLoading(true); // Set loading for all submissions

    if (view === 'login') {
      // 🔑 Step 1: Sign in the user
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage('Login failed: ' + error.message);
        setLoading(false);
        return;
      }

      // 🔍 Step 2: Fetch the instructor record
      const { data: instructor, error: fetchError } = await supabase
        .from('instructors')
        .select('verified')
        .eq('id', loginData.user.id)
        .single();

      if (fetchError || !instructor) {
        setMessage('Instructor record not found. Please contact admin.');
        setLoading(false);
        return;
      }

      // 🚫 Step 3: Check admin approval
      if (!instructor.verified) {
        setMessage('Your account is still pending admin approval.');
        setLoading(false);
        return;
      }

      // ✅ Step 4: Successful login
      navigate('/dashboard'); // Use the correct dashboard route
      // No need to setLoading(false) since we are navigating away

    } else if (view === 'register') {
      // 0. Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match.');
        setLoading(false);
        return;
      }

      // 1. Sign up with Supabase Auth
      const { data: signUpData, error: signError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signError) {
        setMessage('Signup failed: ' + signError.message);
        setLoading(false);
        return;
      }

      // 2. Get the user ID safely
      const userId = signUpData?.user?.id;
      if (!userId) {
        // This handles cases where email verification is required
        setMessage(
          'Please check your email to verify your account. Admin will approve after verification.'
        );
        setLoading(false);
        setView('login'); // Send back to login
        return;
      }

      // 3. Insert record into instructors table
      const { error: insertError } = await supabase.from('instructors').insert([
        {
          id: userId,
          name: formData.name,
          email: formData.email,
          department: 'ECE', // default value
          verified: false, // Admin must approve
          availability: 'in_office', // default value
        },
      ]);

      if (insertError) {
        setMessage('Failed to create instructor record: ' + insertError.message);
        setLoading(false);
      } else {
        setMessage(
          'Registered successfully! Please verify your email and wait for admin approval.'
        );
        setLoading(false);
        // Reset form and switch to login
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
        });
        setView('login');
      }

    } else if (view === 'forgot') {
      // --- THIS IS THE CORRECTED FORGOT PASSWORD LOGIC ---
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          // Optional: Where to redirect the user after they click the email link.
          // You'll need to create a page/route at '/reset-password' to handle
          // the user setting a new password.
          redirectTo: window.location.origin + '/reset-password',
        }
      );

      if (error) {
        setMessage('Password reset failed: ' + error.message);
      } else {
        setMessage('Password reset email sent! Check your inbox.');
      }
      setLoading(false); // Make sure loading stops
      // --- END CORRECTED LOGIC ---
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
        {/* Display error/success messages */}
        {message && (
          <p
            className="error-message"
            style={{
              color: message.includes('failed')
                ? 'red'
                : message.includes('pending')
                  ? 'orange'
                  : 'green',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-links">
          <button
            onClick={() => {
              setView('forgot');
              setMessage('');
            }}
            className="link-button"
          >
            Forgot Password?
          </button>
          <button
            onClick={() => {
              setView('register');
              setMessage('');
            }}
            className="link-button"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  if (view === 'forgot') {
    return (
      <div className="instructor-container">
        {renderLogo()}
        <h1>Forgot Password</h1>
        {message && (
          <p
            className="error-message"
            style={{
              color: message.includes('failed') ? 'red' : 'green',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
        <button
          onClick={() => {
            setView('login');
            setMessage('');
          }}
          className="link-button"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="instructor-container">
        {renderLogo()}
        <h1>Register</h1>
        {/* Display error/success messages */}
        {message && (
          <p
            className="error-message"
            style={{
              color: message.includes('failed') ? 'red' : 'green',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
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
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => {
            setView('login');
            setMessage('');
          }}
          className="link-button"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}

export default Instructor;