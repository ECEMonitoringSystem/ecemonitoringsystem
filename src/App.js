import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// Simplified logo path - assumes Images folder is directly inside src
import logo from './Images/logo.png';
// Assumes CSS folder is directly inside src
import './CSS/App.css';
// Assumes Pages folder is directly inside src
import Student from './Pages/Student';
import Instructor from './Pages/Instructor';
import InstructorsList from './Pages/InstructorsList';
import InstructorsProfile from './Pages/InstructorsProfile';
import Dashboard from './Pages/Dashboard';
import ResetPasswordPage from './Pages/ResetPasswordPage'; // <-- Import the new component

function Home() {
  const navigate = useNavigate();

  const goToStudentPage = () => {
    navigate('/student');
  };

  const goToInstructorPage = () => {
    navigate('/instructor');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>ECE Appointment System</h1>
        <div className="button-group-vertical">
          <button className="styled-button" onClick={goToStudentPage}>
            STUDENT
          </button>
          <button className="styled-button" onClick={goToInstructorPage}>
            INSTRUCTOR
          </button>
        </div>
      </header>
    </div>
  );
}

function DarkModeHandler() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const className = 'dark';
    const htmlClass = document.documentElement.classList;
    const bodyClass = document.body.classList;

    if (isDark) {
      htmlClass.add(className);
      bodyClass.add(className);
    } else {
      htmlClass.remove(className);
      bodyClass.remove(className);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = e => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [isDark]);

  return null;
}

function App() {
  return (
    <Router>
      <DarkModeHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/instructors-list" element={<InstructorsList />} />
        <Route path="/instructor/:id" element={<InstructorsProfile />} />
        {/* Make sure dashboard route does NOT have :email */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* --- ADD THIS NEW ROUTE --- */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;

