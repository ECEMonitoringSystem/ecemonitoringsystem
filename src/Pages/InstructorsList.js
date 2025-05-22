// src/Pages/InstructorsList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/InstructorsList.css';

function InstructorsList() {
  const navigate = useNavigate();

  // Example instructors data
  const instructors = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
    { id: 2, name: 'Prof. Lee', subject: 'Physics' },
    { id: 3, name: 'Dr. Garcia', subject: 'Computer Science' }
  ];

  return (
    <div className="instructors-list">
      <h2>Available Instructors</h2>
      <ul>
        {instructors.map(instructor => (
          <li key={instructor.id}>
            {instructor.name} - {instructor.subject}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/student')}>Back to Form</button>
    </div>
  );
}

export default InstructorsList;
