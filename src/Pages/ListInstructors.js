import React from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../Images/profile.png';
import '../CSS/InstructorsList.css';

function ListInstructors() {
  const navigate = useNavigate();

  const instructors = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', isInsideOffice: true, isInClass: false },
    { id: 2, name: 'Prof. Lee', subject: 'Physics', isInsideOffice: false, isInClass: false },
    { id: 3, name: 'Dr. Garcia', subject: 'Computer Science', isInsideOffice: true, isInClass: true }
  ];

  const handleProfileClick = (instructor) => {
    navigate(`/instructor/${instructor.id}`);
  };

  return (
    <div className="instructors-list">
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
        onClick={() => navigate('/instructor')}
        className="back-button"
      >
        Logout
      </button>
    </div>
  );
}

export default ListInstructors;
