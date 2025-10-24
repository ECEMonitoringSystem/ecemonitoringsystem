import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Make sure this path is correct for your project
import { supabase } from '../API/supabaseClient';
import '../CSS/InstructorsList.css';
import profileImg from '../Images/profile.png';
import logo from '../Images/logo.png';

function InstructorsList() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the full student object from location.state
  const { state } = location;
  // This line correctly looks for a 'student' object inside the state
  // This was passed from your Student.js form
  const student = state?.student;

  // Use state to hold the instructors list from Supabase
  const [instructors, setInstructors] = useState([]);

  // --- Fetch data from Supabase on component mount ---
  useEffect(() => {
    // Fetch initial data
    fetchInstructors();

    // Set up real-time listener for changes
    const channel = supabase
      .channel('instructors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'instructors' },
        (payload) => {
          console.log('Change received:', payload);
          // Re-fetch data when a change occurs
          fetchInstructors();
        }
      )
      .subscribe();

    // Clean up the channel when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array means this runs once on mount

  // --- Function to fetch instructors ---
  async function fetchInstructors() {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('verified', true); // Show only approved instructors

    if (error) {
      console.error('Error fetching instructors:', error);
    } else if (data) {
      setInstructors(data);
    }
  }

  // --- Handle navigation ---
  const handleProfileClick = (instructor) => {
    // Pass *full* student and instructor objects forward
    navigate(`/instructor/${instructor.id}`, {
      state: { student: student, instructor: instructor },
    });
  };

  // --- Guard clause if student info is missing ---
  // If 'student' wasn't passed correctly in the state, this will show
  if (!student) {
    return (
      <div className="instructors-list" style={{ textAlign: 'center', padding: '2rem' }}>
        <header className="App-header2">
          <img src={logo} className="App-logo2" alt="logo" />
        </header>
        <h2>Oops!</h2>
        <p>Student information is missing.</p>
        <button onClick={() => navigate('/student')} className="back-button">
          Back to Form
        </button>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="instructors-list">
      <header className="App-header2">
        <img src={logo} className="App-logo2" alt="logo" />
      </header>

      {/* This is the correct line. It looks for 'student.student_name'.
        If it's showing "Student", it means 'student.student_name' was empty
        or the Student.js form is not sending the data correctly.
      */}
      <h2>Hi, {student?.name || 'Student'}!</h2>
      <p>Available Instructors</p>
      <ul>
        {/* Map over the 'instructors' state from Supabase */}
        {instructors.map((instructor) => (
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
                  className={`indicator ${instructor.status === 'in class'
                    ? 'in-class' // Your CSS class
                    : instructor.status === 'in office'
                      ? 'inside' // Your CSS class
                      : 'outside' // Your CSS class
                    }`}
                  title={
                    instructor.status === 'in class'
                      ? 'In class'
                      : instructor.status === 'in office'
                        ? 'Inside office'
                        : 'Outside office'
                  }
                ></span>
              </div>
              <div className="instructor-info">
                <strong>{instructor.name}</strong>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/student')} className="back-button">
        Back to Form
      </button>
    </div>
  );
}

export default InstructorsList;
