import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../CSS/InstructorsProfile.css';
import profileImg from '../Images/profile.png';

const instructors = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics', isInsideOffice: true, isInClass: false },
  { id: 2, name: 'Prof. Lee', subject: 'Physics', isInsideOffice: false, isInClass: false },
  { id: 3, name: 'Dr. Garcia', subject: 'Computer Science', isInsideOffice: true, isInClass: true }
];

const timetable = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  classes: [
    {
      day: 'Monday',
      subject: 'Math',
      startTime: '9:15 AM',
      endTime: '11:30 AM',
      color: '#4CAF50',
    },
    {
      day: 'Monday',
      subject: 'English',
      startTime: '11:30 AM',
      endTime: '1:30 PM',
      color: '#a8a432',
    },
    {
      day: 'Tuesday',
      subject: 'Physics',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      color: '#2196F3',
    },
    {
      day: 'Wednesday',
      subject: 'Computer Science',
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      color: '#FFC107',
    }
  ]
};

const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

function parseTimeToMinutes(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
}

function InstructorsProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { studentName, studentEmail } = location.state || {};

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
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
      <p>Subject: {instructor.subject}</p>
      <div className={`status ${instructor.isInClass ? 'status-in-class' : instructor.isInsideOffice ? 'status-inside' : 'status-outside'}`}>
        Status: {instructor.isInClass ? 'In Class' : instructor.isInsideOffice ? 'Inside Office' : 'Outside Office'}
      </div>

      <div className="instructors-profile-buttons">
        <button onClick={() => setIsScheduleModalOpen(true)} className="profile-button">Class Schedule</button>
        <button onClick={() => setIsAppointmentModalOpen(true)} className="profile-button">Set an Appointment</button>
      </div>
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>

      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Class Schedule</h3>
            <div className="timetable-container">
              <table className="timetable">
                <thead>
                  <tr>
                    <th>Time / Day</th>
                    {timetable.days.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(timeSlot => {
                    const slotStartMinutes = parseTimeToMinutes(timeSlot);
                    const slotEndMinutes = slotStartMinutes + 60;

                    return (
                      <tr key={timeSlot}>
                        <td>{timeSlot}</td>
                        {timetable.days.map(day => {
                          const overlappingClasses = timetable.classes.filter(cls => {
                            const classStart = parseTimeToMinutes(cls.startTime);
                            const classEnd = parseTimeToMinutes(cls.endTime);
                            return slotStartMinutes < classEnd && slotEndMinutes > classStart && cls.day === day;
                          }).sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));

                          if (overlappingClasses.length === 0) {
                            return <td key={`${day}-${timeSlot}`}></td>;
                          }

                          let gradientParts = [];
                          let lastGradientStop = 0;
                          let contentToDisplay = '';
                          let classColor = 'transparent';

                          overlappingClasses.forEach((cls, index) => {
                            const classStart = parseTimeToMinutes(cls.startTime);
                            const classEnd = parseTimeToMinutes(cls.endTime);
                            const segmentStart = Math.max(slotStartMinutes, classStart);
                            const segmentEnd = Math.min(slotEndMinutes, classEnd);
                            const startPercent = ((segmentStart - slotStartMinutes) / 60) * 100;
                            const endPercent = ((segmentEnd - slotStartMinutes) / 60) * 100;

                            if (startPercent > lastGradientStop) {
                              gradientParts.push(`transparent ${lastGradientStop}%`);
                              gradientParts.push(`transparent ${startPercent}%`);
                            }

                            gradientParts.push(`${cls.color} ${startPercent}%`);
                            gradientParts.push(`${cls.color} ${endPercent}%`);
                            lastGradientStop = endPercent;

                            const allClassSlots = timeSlots.filter(t => {
                              const tStart = parseTimeToMinutes(t);
                              return tStart < classEnd && (tStart + 60) > classStart;
                            });
                            const middleIndex = Math.floor(allClassSlots.length / 2);
                            const middleSlot = allClassSlots[middleIndex];

                            if (timeSlot === middleSlot) {
                              contentToDisplay = `${cls.subject} (${cls.startTime} - ${cls.endTime})`;
                              classColor = cls.color;
                            }
                          });

                          if (lastGradientStop < 100) {
                            gradientParts.push(`transparent ${lastGradientStop}%`);
                            gradientParts.push(`transparent 100%`);
                          }

                          const backgroundStyle = {
                            background: `linear-gradient(to bottom, ${gradientParts.join(', ')})`,
                            color: contentToDisplay ? '#fff' : 'transparent',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            padding: '8px',
                            whiteSpace: 'normal',
                            borderRadius: 0,
                            boxShadow: 'none',
                            border: 'none',
                          };

                          return (
                            <td key={`${day}-${timeSlot}`} style={backgroundStyle}>
                              {contentToDisplay}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={() => setIsScheduleModalOpen(false)} className="modal-close-button profile-button">Close</button>
          </div>
        </div>
      )}

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
