import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../Images/profile.png';
import logo from '../Images/logo.png';
import '../CSS/ListInstructors.css';

function ListInstructors() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Escape key closes popup
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setShowLogin(false);
    }
    if (showLogin) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogin]);

  const instructors = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', isInsideOffice: true, isInClass: false },
    { id: 2, name: 'Prof. Lee', subject: 'Physics', isInsideOffice: false, isInClass: false },
    { id: 3, name: 'Dr. Garcia', subject: 'Computer Science', isInsideOffice: true, isInClass: true }
  ];

  const handleProfileClick = (instructor) => {
    setSelectedInstructor(instructor);
    setShowLogin(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add real authentication logic here
    setShowLogin(false);
    setUsername('');
    setPassword('');
    if (selectedInstructor) {
      navigate(`/instructor/${selectedInstructor.id}`);
    }
  };

  return (
    <div className="instructors-list">
      <header className="App-header2">
        <img src={logo} className="App-logo2" alt="logo" />
      </header>

      <ul>
        {instructors.map(instructor => (
          <li key={instructor.id} className="instructor-item">
            <button
              onClick={() => handleProfileClick(instructor)}
              className="instructor-box-button"
            >
              <div className="profile-image-container">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="instructor-profile"
                />
                <span
                  className={`indicator ${instructor.isInClass
                    ? 'in-class'
                    : instructor.isInsideOffice
                      ? 'inside'
                      : 'outside'
                    }`}
                  title={
                    instructor.isInClass
                      ? 'In class'
                      : instructor.isInsideOffice
                        ? 'Inside office'
                        : 'Outside office'
                  }
                ></span>
              </div>
              <div className="instructor-info">
                <strong>{instructor.name}</strong> - {instructor.subject}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/instructor')}
        className="back-button"
      >
        Logout Button
      </button>

      {showLogin && (
        <div
          className="login-modal-overlay"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="modal-box-container"
            onClick={e => e.stopPropagation()}
          >
            <form
              className="login-modal-content"
              onSubmit={handleLogin}
            >
              <div className="login-inner-box">
                <h2>Login</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListInstructors;
