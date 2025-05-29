import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

const instructors = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics', isInsideOffice: true, isInClass: false },
  { id: 2, name: 'Prof. Lee', subject: 'Physics', isInsideOffice: false, isInClass: false },
  { id: 3, name: 'Dr. Garcia', subject: 'Computer Science', isInsideOffice: true, isInClass: true }
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
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    concerns: '',
    schedule: ''
  });

  const instructor = instructors.find(i => i.id === parseInt(id));

  if (!instructor) {
    return <div>Instructor not found</div>;
  }

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment set with ${instructor.name}!\nConcerns: ${appointmentForm.concerns}\nSchedule: ${appointmentForm.schedule}`);
    setIsAppointmentModalOpen(false);
    setAppointmentForm({ concerns: '', schedule: '' });
  };

  return (
    <div className="instructors-profile-page">
      <div className="profile-image-container">
        <img
          src={profileImg}
          alt={instructor.name}
          className="instructors-profile-image"
        />
        <span
          className={`indicator1 ${
            instructor.isInClass
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
        />
      </div>
      <h2>{instructor.name}</h2>
      <p>Subject: {instructor.subject}</p>
      <div
        className={`status ${
          instructor.isInClass
            ? 'status-in-class'
            : instructor.isInsideOffice
            ? 'status-inside'
            : 'status-outside'
        }`}
      >
        Status: {instructor.isInClass ? 'In Class' : instructor.isInsideOffice ? 'Inside Office' : 'Outside Office'}
      </div>
      <div className="instructors-profile-buttons">
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="profile-button"
        >
          Class Schedule
        </button>
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
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

      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Set an Appointment with {instructor.name}</h3>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="form-group">
                <label htmlFor="concerns">Concerns</label>
                <textarea
                  id="concerns"
                  name="concerns"
                  value={appointmentForm.concerns}
                  onChange={handleAppointmentChange}
                  required
                  rows="3"
                  className="appointment-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="schedule">Schedule</label>
                <input
                  type="datetime-local"
                  id="schedule"
                  name="schedule"
                  value={appointmentForm.schedule}
                  onChange={handleAppointmentChange}
                  required
                  className="appointment-input custom-date-picker"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="profile-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="profile-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorsProfile;