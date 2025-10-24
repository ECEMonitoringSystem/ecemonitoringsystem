import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../API/supabaseClient'; // Import your Supabase client
import logo from '../Images/logo.png'; // Your main logo
import '../CSS/Dashboard.css'; // Your main CSS file

function Dashboard() {
  const navigate = useNavigate();

  // States from your testing file
  const [user, setUser] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State from your main file (will be set by checkUser)
  const [activeStatus, setActiveStatus] = useState('in_office');

  // --- 1. AUTH & DATA FETCHING (from TestDash) ---

  // Main useEffect for checking auth state
  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/instructor"); // Navigate to your main instructor login
      }
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, [navigate]);

  // Realtime listener for appointments
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("appointments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
        fetchAppointments(user.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Get logged-in user and instructor record
  async function checkUser() {
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) {
      navigate("/instructor");
      return;
    }
    setUser(user);

    const { data: instrData, error } = await supabase
      .from("instructors")
      .select("*") // Get all columns
      .eq("id", user.id)
      .single();

    if (error || !instrData) {
      console.error("Error fetching instructor record:", error);
      // Maybe log them out or show an error
      await supabase.auth.signOut();
      navigate("/instructor");
      return;
    }

    setInstructor(instrData);
    // --- FIX #1: Use 'availability' ---
    setActiveStatus(instrData.availability || "in_office");

    if (instrData.verified) {
      fetchAppointments(user.id);
    }
  }

  // Fetch appointments for instructor
  async function fetchAppointments(instructorId) {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching appointments:", error);
    setAppointments(data || []);
  }

  // --- 2. CORE FUNCTIONS (from TestDash & MainDash) ---

  // Update instructor status (merged)
  async function handleStatusChange(newStatus) {
    if (!instructor) return;

    // Optimistic UI update from MainDash
    setActiveStatus(newStatus);

    // --- FIX #2: Use 'availability' ---
    const { error } = await supabase
      .from("instructors")
      .update({ availability: newStatus }) // Use 'availability' column
      .eq("id", instructor.id);

    if (error) {
      console.error("Error updating status:", error);
      // Revert if error
      setActiveStatus(instructor.availability || "in_office");
    }
  }

  // Handle opening the modal
  async function openAppointment(appointment) {
    setSelectedAppointment(appointment);
    setShowModal(true);

    // Mark as read if pending
    if (appointment.status === "pending") {
      await supabase
        .from("appointments")
        .update({ status: "read" })
        .eq("id", appointment.id);

      // No need to call fetchAppointments, realtime listener will catch it
      // or we can update the local state manually for speed
      setAppointments(prev =>
        prev.map(a => a.id === appointment.id ? { ...a, status: 'read' } : a)
      );
    }
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setSelectedAppointment(null);
  }

  // Handle logout (from MainDash)
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    navigate('/instructor'); // Navigate back to the login page
  };

  // --- 3. RENDER LOGIC (from TestDash) ---
  if (!instructor) {
    return <div className="dashboard-loading">Loading...</div>; // Using main CSS class
  }

  if (!instructor.verified) {
    return (
      <div className="dashboard-loading">
        Account awaiting admin approval.
        <button onClick={handleLogout} className="logout-button" style={{ marginTop: '1rem', textDecoration: 'underline' }}>
          Logout
        </button>
      </div>
    );
  }

  // --- 4. RENDER UI (from MainDash) ---
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>

      <main className="dashboard-content">
        <img src={logo} className="dashboard-logo" alt="logo" />

        <h1>Hi, {instructor ? instructor.name : 'Instructor'}!</h1>

        {/* Status buttons from MainDash, logic from both */}
        <div className="status-controls">
          <button
            className={`status-btn inside ${activeStatus === 'in_office' ? 'active' : ''
              }`}
            onClick={() => handleStatusChange('in_office')}
          >
            Inside Office
          </button>
          <button
            className={`status-btn in-class ${activeStatus === 'in_class' ? 'active' : ''
              }`}
            onClick={() => handleStatusChange('in_class')}
          >
            In Class
          </button>
          <button
            className={`status-btn absent ${activeStatus === 'absent' ? 'active' : ''
              }`}
            onClick={() => handleStatusChange('absent')}
          >
            Absent
          </button>
        </div>

        {/* Appointments section from MainDash, content from TestDash */}
        <section className="appointments-section">
          <h2>Appointments</h2>
          <div className="appointments-list-box">
            {appointments.length === 0 ? (
              <p className="no-appointments">No appointments scheduled.</p>
            ) : (
              // This is the list-rendering logic from TestDash
              <div className="appointments-list">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => openAppointment(a)}
                    // These new CSS classes mimic your test file's Tailwind
                    className={`appointment-item ${a.status}`}
                  >
                    <div className="appointment-info">
                      {a.student_name} — {a.appointment_date} at {a.appointment_time}
                    </div>
                    <div className="appointment-status-text">
                      Status: {a.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL (from TestDash) */}
      {showModal && selectedAppointment && (
        // These new CSS classes mimic your test file's Tailwind
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Appointment Details</h3>

            <p><strong>Student Name:</strong> {selectedAppointment.student_name}</p>
            <p><strong>Email:</strong> {selectedAppointment.student_email}</p>
            <p><strong>Program:</strong> {selectedAppointment.student_program}</p>
            <p><strong>Year & Section:</strong> {selectedAppointment.student_year_section}</p>
            <p><strong>Date:</strong> {selectedAppointment.appointment_date}</p>
            <p><strong>Time:</strong> {selectedAppointment.appointment_time}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason || "No reason provided"}</p>
            <p className="modal-status-text">
              <strong>Status:</strong>{" "}
              <span className={selectedAppointment.status}>
                {selectedAppointment.status}
              </span>
            </p>

            <button onClick={closeModal} className="modal-close-btn-x">
              ✕
            </button>
            <div className="modal-actions">
              <button onClick={closeModal} className="modal-close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;