import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import profileImg from '../Images/profile.png';
import '../CSS/InstructorsList.css'; // reuse your existing CSS

function ListInstructors() {
  const { email } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get student info from location.state or fallback
  const studentName = location.state?.studentName || 'Student';
  const studentEmail = location.state?.studentEmail || '';

  // Sample instructors data
  const instructors = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', isInsideOffice: true, isInClass: false },
    { id: 2, name: 'Prof. Lee', subject: 'Physics', isInsideOffice: false, isInClass: false },
    { id: 3, name: 'Dr. Garcia', subject: 'Computer Science', isInsideOffice: true, isInClass: true }
  ];

  const handleProfileClick = (instructor) => {
    // Navigate to the instructor profile page with student info
    navigate(`/instructor/${instructor.id}`, { state: { studentName, studentEmail } });
  };

  return (
    <div className="instructors-list">
      <h1>Instructor Profile</h1>
      <p>Email: {email}</p>

      <h2>Hi, {studentName}!</h2>
      <p>Available Instructors</p>
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
        onClick={() => navigate('/student')}
        className="back-button"
      >
        Back to Form
      </button>
    </div>
  );
}

export default ListInstructors;
