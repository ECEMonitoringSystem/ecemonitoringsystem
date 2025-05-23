import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

const instructors = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
  { id: 2, name: 'Prof. Lee', subject: 'Physics' },
  { id: 3, name: 'Dr. Garcia', subject: 'Computer Science' }
];

function InstructorsProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const instructor = instructors.find(i => i.id === parseInt(id));

  if (!instructor) {
    return <div>Instructor not found</div>;
  }

  return (
    <div className="instructors-profile-page">
      <img
        src={profileImg}
        alt={instructor.name}
        className="instructors-profile-image"
      />
      <h2>{instructor.name}</h2>
      <p>Subject: {instructor.subject}</p>
      <button onClick={() => navigate(-1)}>Back to List</button>
    </div>
  );
}

export default InstructorsProfile;
