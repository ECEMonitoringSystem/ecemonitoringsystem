// src/InstructorProfile.js
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function ProfileInstructors() {
  const { email } = useParams();

  // You can use email param or location.state.email to fetch instructor data

  return (
    <div>
      <h1>Instructor Profile</h1>
      <p>Email: {email}</p>
      {/* Display more instructor info here */}
    </div>
  );
}

export default ProfileInstructors;
