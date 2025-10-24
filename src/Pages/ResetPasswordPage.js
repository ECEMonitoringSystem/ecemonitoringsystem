import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Verify this path is correct relative to src/Pages/ResetPasswordPage.js
import { supabase } from '../API/supabaseClient';
// Verify this path is correct relative to src/Pages/ResetPasswordPage.js
import '../CSS/Instructor.css'; // Reuse login page styles
// Verify this path is correct relative to src/Pages/ResetPasswordPage.js
import logo from '../Images/logo.png';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); // To show success state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        // Supabase automatically reads the recovery token from the URL fragment (#)
        // when you call updateUser with a password.
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (error) {
            setMessage('Failed to reset password: ' + error.message);
        } else {
            setMessage('Password updated successfully!');
            setSuccess(true);
            setPassword(''); // Clear fields on success
            setConfirmPassword('');
            // Optionally navigate back to login after a delay
            // setTimeout(() => navigate('/instructor'), 3000);
        }
    };

    return (
        <div className="instructor-container">
            <img src={logo} alt="App Logo" className="app-logo" />
            <h1>Reset Your Password</h1>

            {message && (
                <p
                    className="error-message" // Reusing class, style determines color
                    style={{
                        color: success ? 'green' : 'red', // Green for success, red for error
                        textAlign: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    {message}
                </p>
            )}

            {!success && ( // Only show form if not successful yet
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Set New Password'}
                    </button>
                </form>
            )}

            {success && ( // Show login link only on success
                <button
                    onClick={() => navigate('/instructor')} // Navigate to instructor login
                    className="link-button"
                    style={{ marginTop: '1rem' }}
                >
                    Go back to Login
                </button>
            )}
        </div>
    );
}

export default ResetPasswordPage;

