import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Parse from 'parse';

const Add = () => {
  const [courseData, setCourseData] = useState({
    courseId: '',
    title: '',
    instructor: '',
    zoomLink: '',
    videoLink: '',
    schedule: ''
  });

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    const Course = Parse.Object.extend("Classes");
    const newCourse = new Course();

    try {
      // Data များကို သိမ်းဆည်းခြင်း
      newCourse.set("courseId", courseData.courseId.toLowerCase());
      newCourse.set("title", courseData.title);
      newCourse.set("instructor", courseData.instructor);
      newCourse.set("zoomLink", courseData.zoomLink);
      newCourse.set("videoLink", courseData.videoLink);
      newCourse.set("schedule", courseData.schedule);

      await newCourse.save();
      setStatus('New Class Added Successfully! ✅');
      
      // Form ကို Reset လုပ်ခြင်း
      setCourseData({ 
        courseId: '', title: '', instructor: '', 
        zoomLink: '', videoLink: '', schedule: '' 
      });
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a192f', minHeight: '100vh', color: '#00ff41', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/admin" style={{ color: '#8892b0', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ marginTop: '20px' }}>➕ Add New Course</h1>
        <p style={{ color: '#8892b0' }}>Database ထဲသို့ အတန်းအသစ်များ တိုက်ရိုက်ထည့်သွင်းရန်</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Course ID (e.g., linux)</label>
            <input 
              type="text" required style={styles.input} 
              value={courseData.courseId}
              onChange={(e) => setCourseData({...courseData, courseId: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Course Title (e.g., Linux Administration)</label>
            <input 
              type="text" required style={styles.input}
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Instructor Name</label>
            <input 
              type="text" style={styles.input}
              value={courseData.instructor}
              onChange={(e) => setCourseData({...courseData, instructor: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>YouTube Video ID</label>
            <input 
              type="text" placeholder="e.g. dQw4w9WgXcQ" style={styles.input}
              value={courseData.videoLink}
              onChange={(e) => setCourseData({...courseData, videoLink: e.target.value})} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Class Schedule</label>
            <input 
              type="text" placeholder="e.g. Mon-Wed (7-9 PM)" style={styles.input}
              value={courseData.schedule}
              onChange={(e) => setCourseData({...courseData, schedule: e.target.value})} 
            />
          </div>

          <button type="submit" style={styles.btn}>SAVE TO DATABASE</button>
        </form>
        
        {status && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            border: '1px solid #00ff41', 
            textAlign: 'center',
            borderRadius: '5px' 
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '20px', background: '#112240', padding: '30px', borderRadius: '10px', marginTop: '30px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  input: { padding: '12px', background: '#0a192f', border: '1px solid #233554', color: '#fff', borderRadius: '5px' },
  btn: { padding: '15px', background: '#00ff41', color: '#0a192f', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '10px' }
};

export default Add;