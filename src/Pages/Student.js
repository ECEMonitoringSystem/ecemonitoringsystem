import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../CSS/Student.css';
import logo from '../Images/logo.png';

function Student() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Pass full student data object to instructors list page
    navigate('/instructors-list', { state: { student: data } });
  };

  return (
    <div className="Student">
      <header className="App-header1">
        <img src={logo} className="App-logo1" alt="logo" />
      </header>

      <div className="student-container">
        <div className="header-text">
          <h1>Welcome, Student!</h1>
          <p>Please Input your Details for the Reservation of your Appointment</p>
        </div>

        <form className="student-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="yearSection">Year & Section</label>
            <input
              {...register("yearSection", { required: true })}
              type="text"
              id="yearSection"
              name="yearSection"
              placeholder="Year & Section (e.g., 3-1)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="program">Program</label>
            <input
              {...register("program", { required: true })}
              type="text"
              id="program"
              name="program"
              placeholder="Program (e.g., BSECE)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Student;
