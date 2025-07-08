// Student.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Student.css';
import logo from '../Images/logo.png';

function Student() {
  const [formData, setFormData] = useState({
    name: '',
    yearSection: '',
    program: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass both studentName and studentEmail to instructors list page
    navigate('/instructors-list', { state: { studentName: formData.name, studentEmail: formData.email } });
  };

  return (
    <div className="Student">
      <header className="App-header1">
        <img src={logo} className="App-logo1" alt="logo" />
      </header>

      <div className="student-container">
        <div className="header-text">
          <h1>Welcome, Student!</h1>
          <p>Please Input your Details for the Reservation of your Appointment</p>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="yearSection">Year & Section</label>
            <input
              type="text"
              id="yearSection"
              name="yearSection"
              value={formData.yearSection}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="program">Program</label>
            <input
              type="text"
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Student;
