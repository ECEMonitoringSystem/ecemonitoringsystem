import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../API/supabaseClient'; // Make sure this path is correct
import toast, { Toaster } from 'react-hot-toast'; // Import toast
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

function InstructorsProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the full student and instructor objects passed from the previous page
  const { state } = location;
  const student = state?.student;
  const instructor = state?.instructor;

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  // Updated state to match the database fields
  const [appointmentForm, setAppointmentForm] = useState({
    reason: '',
    appointment_date: '',
    appointment_time: '',
  });

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Updated Submit Handler to use Supabase ---
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    // Make the data ready for database insert
    // --- FIX: Using the correct keys from the student object (e.g., student.name) ---
    const payload = {
      instructor_id: instructor.id,
      student_name: student.name, // Changed from student.student_name
      student_year_section: student.yearSection, // Changed from student.student_year_section
      student_program: student.program, // Changed from student.student_program
      student_email: student.email, // Changed from student.student_email
      reason: appointmentForm.reason,
      appointment_date: appointmentForm.appointment_date,
      appointment_time: appointmentForm.appointment_time,
    };

    console.log('📦 Sending this data to Supabase:', payload);
    const { error } = await supabase.from('appointments').insert([payload]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      toast.error('Failed to create appointment. Please try again.');
      return;
    }

    toast.success('🎉 Appointment created successfully!');
    setIsAppointmentModalOpen(false); // Close modal on success
    // Reset form
    setAppointmentForm({
      reason: '',
      appointment_date: '',
      appointment_time: '',
    });
  };

  // --- Guard clause if data is missing ---
  if (!instructor || !student) {
    return (
      <div className="instructors-profile-page" style={{ textAlign: 'center' }}>
        <h2>Oops!</h2>
        <p>Student or instructor information is missing.</p>
        <button onClick={() => navigate('/student')} className="profile-button">
          Back to Student Form
        </button>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="instructors-profile-page">
      {/* Add Toaster for notifications */}
      <Toaster />

      <div className="profile-image-container">
        <img
          src={profileImg}
          alt={instructor.name}
          className="instructors-profile-image"
        />
        {/* --- THIS IS FIX #1 --- */}
        <span
          className={`indicator1 ${instructor.availability === 'in_office'
            ? 'inside' // Green
            : instructor.availability === 'in_class'
              ? 'in-class' // Yellow
              : 'outside' // Red
            }`}
          title={
            instructor.availability === 'in_office'
              ? 'Inside Office'
              : instructor.availability === 'in_class'
                ? 'In Class'
                : 'Absent'
          }
        ></span>
      </div>
      <h2>{instructor.name}</h2>
      {/* --- THIS IS FIX #2 --- */}
      <div
        className={`status ${instructor.availability === 'in_office'
          ? 'status-inside' // Green
          : instructor.availability === 'in_class'
            ? 'status-in-class' // Yellow
            : 'status-outside' // Red
          }`}
      >
        Status:{' '}
        {instructor.availability === 'in_office'
          ? 'Inside Office'
          : instructor.availability === 'in_class'
            ? 'In Class'
            : 'Absent'}
      </div>

      <div className="instructors-profile-buttons">
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="profile-button"
        >
          Set an Appointment
        </button>
        {/* Navigate(-1) goes back to the previous page (InstructorsList) */}
        <button onClick={() => navigate(-1)} className="profile-button">
          Back to List
        </button>
      </div>

      {/* --- Updated Appointment Modal --- */}
      {isAppointmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Set an Appointment with {instructor.name}</h3>
            <form onSubmit={handleAppointmentSubmit}>
              {/* Updated: 'concerns' -> 'reason' */}
              <div className="form-group">
                <label htmlFor="reason">Concerns</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={appointmentForm.reason}
                  onChange={handleAppointmentChange}
                  required
                  rows="3"
                  className="appointment-input"
                  placeholder="Reason for appointment"
                />
              </div>
              {/* Updated: Split 'schedule' into 'date' and 'time' */}
              <div className="form-group">
                <label htmlFor="appointment_date">Date</label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={appointmentForm.appointment_date}
                  onChange={handleAppointmentChange}
                  required
                  className="appointment-input custom-date-picker"
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointment_time">Time</label>
                <input
                  type="time"
                  id="appointment_time"
                  name="appointment_time"
                  value={appointmentForm.appointment_time}
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