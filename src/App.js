import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import logo from '././Images/logo.png';
import './CSS/App.css';
import Student from './Pages/Student';
import Instructor from './Pages/Instructor';


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


        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React bullshit
        </a>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/instructor" element={<Instructor />} />
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
