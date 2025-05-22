import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../CSS/InstructorsList.css';
import profileImg from '../Images/profile.png';

function InstructorsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.studentName || 'Student';

  const instructors = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
    { id: 2, name: 'Prof. Lee', subject: 'Physics' },
    { id: 3, name: 'Dr. Garcia', subject: 'Computer Science' }
  ];

  const handleProfileClick = (instructor) => {
    alert(`Profile of ${instructor.name}`);
    // Or navigate(`/instructor/${instructor.id}`);
  };

  return (
    <div className="instructors-list">
      <h2>Hi, {studentName}!</h2>
      <p>Available Instructors</p>
      <ul>
        {instructors.map(instructor => (
          <li key={instructor.id} className="instructor-item">
            <button
              onClick={() => handleProfileClick(instructor)}
              className="instructor-box-button"
            >
              <img
                src={profileImg}
                alt="Profile"
                className="instructor-profile"
              />
              <div className="instructor-info">
                <strong>{instructor.name}</strong> - {instructor.subject}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/student')}
        className="back-button"
      >
        Back to Form
      </button>
    </div>
  );
}

export default InstructorsList;
