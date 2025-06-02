import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import logo from '././Images/logo.png';
import './CSS/App.css';
import Student from './Pages/Student';
import Instructor from './Pages/Instructor';
import InstructorsList from './Pages/InstructorsList';
import InstructorsProfile from './Pages/InstructorsProfile'; // fixed typo from InsturctorsProfile
import ProfileInstructors from './Pages/ProfileInstructors';

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

    // Listen for system dark mode changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = e => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [isDark]);

  return null; // This component does not render anything
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
        <Route path="/profile-instructors/:email" element={<ProfileInstructors />} />
      </Routes>
    </Router>
  );
}

export default App;
