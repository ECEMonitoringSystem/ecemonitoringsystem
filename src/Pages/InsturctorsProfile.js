import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

const instructors = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
  { id: 2, name: 'Prof. Lee', subject: 'Physics' },
  { id: 3, name: 'Dr. Garcia', subject: 'Computer Science' }
];

const timetable = {
  times: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  classes: {
    'Monday-9:00 AM': 'Math',
    'Tuesday-10:00 AM': 'Physics',
    'Wednesday-11:00 AM': 'Computer Science',
  }
};

function InstructorsProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
      <div className="profile-button status-label">
        Status: having class
      </div>
      <div className="instructors-profile-buttons">
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="profile-button"
        >
          Class Schedule
        </button>
        <button
          onClick={() => alert('Set an appointment with ' + instructor.name)}
          className="profile-button"
        >
          Set an Appointment
        </button>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back to List
      </button>

      {/* Timetable Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Class Schedule</h3>
            <div className="timetable-container">
              <table className="timetable">
                <thead>
                  <tr>
                    <th>Time/Day</th>
                    {timetable.days.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timetable.times.map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {timetable.days.map(day => (
                        <td key={`${day}-${time}`}>
                          {timetable.classes[`${day}-${time}`] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="modal-close-button profile-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorsProfile;
