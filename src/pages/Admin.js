import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Parse from 'parse';

const AdminPortal = () => {
  // --- PART 1: ADD COURSE STATES ---
  const [courseData, setCourseData] = useState({
    courseId: '', title: '', instructor: '', zoomLink: '', videoLink: '', schedule: ''
  });
  const [addStatus, setAddStatus] = useState('');

  // --- PART 2: STUDENT ENROLLMENTS STATES ---
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const query = new Parse.Query("Enrollments");
      query.descending("createdAt");
      const results = await query.find();
      setRequests(results);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const query = new Parse.Query("Enrollments");
      const object = await query.get(id);
      object.set("status", "approved");
      await object.save();
      alert("Mission Approved! ✅ ကျောင်းသား Status စစ်ရင် Approved ပြနေပါပြီ။");
      fetchEnrollments();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setAddStatus('Processing...');
    
    // Database ထဲမှာ Classes ဆိုတဲ့ Class Name နဲ့ သိမ်းမှာပါ
    const Course = Parse.Object.extend("Classes");
    const newCourse = new Course();
    
    try {
      newCourse.set("courseId", courseData.courseId.toLowerCase());
      newCourse.set("title", courseData.title);
      newCourse.set("instructor", courseData.instructor);
      newCourse.set("zoomLink", courseData.zoomLink); // ဒီနေရာလေးမှာ Zoom Link ထည့်ဖို့ ကျန်နေခဲ့တာ ဖြည့်ပေးလိုက်ပါတယ်
      newCourse.set("videoLink", courseData.videoLink);
      newCourse.set("schedule", courseData.schedule);
      
      await newCourse.save();
      
      setAddStatus('New Class Added Successfully! ✅');
      // Form ကို ပြန်ရှင်းလိုက်တာပါ
      setCourseData({ courseId: '', title: '', instructor: '', zoomLink: '', videoLink: '', schedule: '' });
    } catch (error) { 
      setAddStatus('Error: ' + error.message); 
    }
  };

  return (
    <div style={{ backgroundColor: '#0a192f', minHeight: '100vh', color: '#00ff41', padding: '40px', fontFamily: 'monospace' }}>
      
      {/* SECTION 1: STUDENT REQUESTS (APPROVE ပေးရန်) */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 60px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ borderLeft: '4px solid #00ff41', paddingLeft: '15px' }}>🚀 PENDING MISSIONS (Enrollments)</h1>
          <button onClick={fetchEnrollments} style={{ ...styles.approveBtn, background: 'transparent', border: '1px solid #00ff41', color: '#00ff41' }}>REFRESH</button>
        </div>
        <p style={{ color: '#8892b0' }}>ကျောင်းသားများပို့ထားသော ငွေလွဲပြေစာများကို စစ်ဆေးရန်</p>
        
        {isLoading ? <p>Loading Data...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{ padding: '15px' }}>NAME</th>
                  <th>PHONE</th>
                  <th>COURSE</th>
                  <th>RECEIPT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#8892b0' }}>No requests found.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} style={styles.tableRow}>
                      <td style={{ padding: '15px' }}>{req.get("studentName")}</td>
                      <td>{req.get("phoneNumber")}</td>
                      <td>{req.get("courseTitle")}</td>
                      <td>
                        {req.get("receipt") ? (
                          <a href={req.get("receipt").url()} target="_blank" rel="noreferrer" style={{color: '#00ff41', textDecoration: 'underline'}}>VIEW IMG</a>
                        ) : "No File"}
                      </td>
                      <td style={{ color: req.get("status") === 'pending' ? '#ffcc00' : '#00ff41', fontWeight: 'bold' }}>
                        {req.get("status") ? req.get("status").toUpperCase() : "NULL"}
                      </td>
                      <td>
                        {req.get("status") === 'pending' && (
                          <button onClick={() => handleApprove(req.id)} style={styles.approveBtn}>APPROVE</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <hr style={{ borderColor: '#233554', margin: '40px 0' }} />

      {/* SECTION 2: ADD NEW COURSE */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>➕ ADD / UPDATE CLASS</h1>
        <p style={{ textAlign: 'center', color: '#8892b0', fontSize: '13px' }}>သင်တန်းအချက်အလက်များကို Database ထဲသို့ တိုက်ရိုက်သိမ်းဆည်းရန်</p>
        
        <form onSubmit={handleSubmitCourse} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>COURSE ID (Must match Home.js id)</label>
            <input placeholder="e.g., linux, cyber, net" style={styles.input} value={courseData.courseId} onChange={(e) => setCourseData({...courseData, courseId: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>DISPLAY TITLE</label>
            <input placeholder="Course Full Name" style={styles.input} value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>INSTRUCTOR NAME</label>
            <input placeholder="Teacher Name" style={styles.input} value={courseData.instructor} onChange={(e) => setCourseData({...courseData, instructor: e.target.value})} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ZOOM / LIVE MEETING LINK</label>
            <input placeholder="https://zoom.us/j/..." style={styles.input} value={courseData.zoomLink} onChange={(e) => setCourseData({...courseData, zoomLink: e.target.value})} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>YOUTUBE VIDEO ID (Recorded)</label>
            <input placeholder="e.g., yv_vPAtE_kQ" style={styles.input} value={courseData.videoLink} onChange={(e) => setCourseData({...courseData, videoLink: e.target.value})} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>CLASS SCHEDULE</label>
            <input placeholder="e.g., Sat & Sun (7:00 PM)" style={styles.input} value={courseData.schedule} onChange={(e) => setCourseData({...courseData, schedule: e.target.value})} />
          </div>

          <button type="submit" style={styles.btn}>SAVE TO DATABASE</button>
        </form>
        {addStatus && <div style={styles.statusMsg}>{addStatus}</div>}
      </div>
    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: '#112240', fontSize: '14px' },
  tableHeader: { borderBottom: '2px solid #00ff41', textAlign: 'left', color: '#8892b0' },
  tableRow: { borderBottom: '1px solid #233554' },
  approveBtn: { background: '#00ff41', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#0a192f' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', background: '#112240', padding: '30px', borderRadius: '5px', border: '1px solid #233554' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', color: '#8892b0', fontWeight: 'bold' },
  input: { padding: '12px', background: '#0a192f', border: '1px solid #233554', color: '#00ff41', outline: 'none', fontFamily: 'monospace' },
  btn: { padding: '15px', background: '#00ff41', color: '#0a192f', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
  statusMsg: { marginTop: '20px', padding: '10px', border: '1px solid #00ff41', textAlign: 'center', background: 'rgba(0, 255, 65, 0.1)' }
};

export default AdminPortal;