import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Student.css';

function Student() {
  const [formData, setFormData] = useState({
    name: '',
    yearSection: '',
    program: '',
    email: '',
    date: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/instructors-list', { state: { studentName: formData.name } });
  };

  return (
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
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Student;
