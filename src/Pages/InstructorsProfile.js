import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

const instructors = [
  { id: 1, name: 'Dr. Smith', isInsideOffice: true, isInClass: false },
  { id: 2, name: 'Prof. Lee', isInsideOffice: false, isInClass: false },
  { id: 3, name: 'Dr. Garcia', isInsideOffice: true, isInClass: true }
];





function InstructorsProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { studentName, studentEmail } = location.state || {};

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ concerns: '', schedule: '' });

  const instructor = instructors.find(i => i.id === parseInt(id));
  if (!instructor) return <div>Instructor not found</div>;

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    alert(
      `Student Name: ${studentName || 'N/A'}\n` +
      `Student Email: ${studentEmail || 'N/A'}\n` +
      `Appointment set with ${instructor.name}!\n` +
      `Concerns: ${appointmentForm.concerns}\n` +
      `Schedule: ${appointmentForm.schedule}\n`
    );
    setIsAppointmentModalOpen(false);
    setAppointmentForm({ concerns: '', schedule: '' });
  };

  return (
    <div className="instructors-profile-page">
      <div className="profile-image-container">
        <img src={profileImg} alt={instructor.name} className="instructors-profile-image" />
        <span
          className={`indicator1 ${instructor.isInClass ? 'in-class' : instructor.isInsideOffice ? 'inside' : 'outside'}`}
          title={instructor.isInClass ? 'In class' : instructor.isInsideOffice ? 'Inside office' : 'Outside office'}
        />
      </div>
      <h2>{instructor.name}</h2>
      <div className={`status ${instructor.isInClass ? 'status-in-class' : instructor.isInsideOffice ? 'status-inside' : 'status-outside'}`}>
        Status: {instructor.isInClass ? 'In Class' : instructor.isInsideOffice ? 'Inside Office' : 'Outside Office'}
      </div>

      <div className="instructors-profile-buttons">
        <button onClick={() => setIsAppointmentModalOpen(true)} className="profile-button">Set an Appointment</button>
        <button onClick={() => navigate(-1)} className="profile-button">Back to List</button>
      </div>


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
                <button type="submit" className="profile-button">Submit</button>
                <button type="button" onClick={() => setIsAppointmentModalOpen(false)} className="profile-button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorsProfile;
