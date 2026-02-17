import React, { useState, useEffect } from 'react';
import Parse from 'parse';

const AdminPortal = () => {
  // --- PART 1: ADD COURSE STATES (Paid Courses - မူရင်းအတိုင်း) ---
  const [courseData, setCourseData] = useState({
    courseId: '', title: '', instructor: '', zoomLink: '', videoLink: '', schedule: ''
  });
  const [addStatus, setAddStatus] = useState('');

  // --- PART 2: STUDENT ENROLLMENTS STATES (မူရင်းအတိုင်း) ---
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- PART 3: NEW! FREE COURSE STATES (ထပ်တိုး) ---
  const [freeCourseData, setFreeCourseData] = useState({
    title: '', vidId: '', detail: ''
  });
  const [freeImage, setFreeImage] = useState(null);
  const [freePdf, setFreePdf] = useState(null);
  const [freeStatus, setFreeStatus] = useState('');
  const [liveFreeCourses, setLiveFreeCourses] = useState([]); // ဖျက်ရန် list အတွက်

  useEffect(() => {
    fetchEnrollments();
    fetchLiveFreeCourses(); // Free courses စာရင်းဆွဲရန်
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

  // Free Course များကို ဆွဲထုတ်ရန် (Delete Control အတွက်)
  const fetchLiveFreeCourses = async () => {
    try {
      const query = new Parse.Query("FreeCourses");
      query.descending("createdAt");
      const results = await query.find();
      setLiveFreeCourses(results);
    } catch (e) { console.log(e); }
  };

  const handleApprove = async (id) => {
    try {
      await Parse.Cloud.run("approveEnrollment", { enrollmentId: id });
      alert("Mission Approved! ✅");
      fetchEnrollments();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Free Course ဖျက်ရန် Logic (အသစ်ထည့်သွင်းမှု)
  const handleDeleteFreeCourse = async (id) => {
    if (!window.confirm("Are you sure you want to DELETE this mission?")) return;
    try {
      const query = new Parse.Query("FreeCourses");
      const obj = await query.get(id);
      await obj.destroy();
      alert("Mission Deleted! 🗑️");
      fetchLiveFreeCourses();
    } catch (e) { alert("Delete Error: " + e.message); }
  };

  // Paid Course သိမ်းဆည်းခြင်း (မူရင်းအတိုင်း)
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setAddStatus('Processing...');
    const Course = Parse.Object.extend("Classes");
    const newCourse = new Course();
    try {
      newCourse.set("courseId", courseData.courseId.toLowerCase());
      newCourse.set("title", courseData.title);
      newCourse.set("instructor", courseData.instructor);
      newCourse.set("zoomLink", courseData.zoomLink);
      newCourse.set("videoLink", courseData.videoLink);
      newCourse.set("schedule", courseData.schedule);
      await newCourse.save();
      setAddStatus('New Class Added Successfully! ✅');
      setCourseData({ courseId: '', title: '', instructor: '', zoomLink: '', videoLink: '', schedule: '' });
    } catch (error) { 
      setAddStatus('Error: ' + error.message); 
    }
  };

  // --- PART 4: NEW! FREE COURSE SUBMIT LOGIC (ထပ်တိုး) ---
  const handleFreeCourseSubmit = async (e) => {
    e.preventDefault();
    setFreeStatus('Uploading to Mission Control...');
    
    try {
      const FreeCourse = Parse.Object.extend("FreeCourses");
      const fCourse = new FreeCourse();

      fCourse.set("title", freeCourseData.title);
      fCourse.set("vidId", freeCourseData.vidId);
      fCourse.set("detail", freeCourseData.detail);

      if (freeImage) {
        const parseImage = new Parse.File(freeImage.name, freeImage);
        fCourse.set("image", parseImage);
      }
      if (freePdf) {
        const parsePdf = new Parse.File(freePdf.name, freePdf);
        fCourse.set("pdf", parsePdf);
      }

      await fCourse.save();
      setFreeStatus('Free Mission Published Successfully! 🚀');
      setFreeCourseData({ title: '', vidId: '', detail: '' });
      setFreeImage(null);
      setFreePdf(null);
      fetchLiveFreeCourses(); // ဖျက်ရန် list ကို update လုပ်ရန်
    } catch (error) {
      setFreeStatus('Error: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a192f', minHeight: '100vh', color: '#00ff41', padding: '40px', fontFamily: 'monospace' }}>
      
      {/* SECTION 1: STUDENT REQUESTS (မူရင်းအတိုင်း) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ borderLeft: '4px solid #00ff41', paddingLeft: '15px' }}>🚀 PENDING MISSIONS</h1>
          <button onClick={fetchEnrollments} style={{ ...styles.approveBtn, background: 'transparent', border: '1px solid #00ff41', color: '#00ff41' }}>REFRESH</button>
        </div>
        {isLoading ? <p>Loading Data...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{ padding: '15px' }}>STUDENT NAME</th>
                  <th>PHONE</th>
                  <th>COURSE</th>
                  <th>SENDER NAME</th>
                  <th>TRANSACTION ID</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} style={styles.tableRow}>
                    <td style={{ padding: '15px' }}>{req.get("studentName")}</td>
                    <td>{req.get("phoneNumber")}</td>
                    <td>{req.get("courseTitle")}</td>
                    <td style={{ color: '#fff' }}>{req.get("senderAccountName") || "N/A"}</td>
                    <td style={{ color: '#00ff41', fontWeight: 'bold' }}>{req.get("transactionId") || "N/A"}</td>
                    <td style={{ color: req.get("status") === 'pending' ? '#ffcc00' : '#00ff41' }}>
                      {req.get("status")?.toUpperCase()}
                    </td>
                    <td>
                      {req.get("status") === 'pending' && (
                        <button onClick={() => handleApprove(req.id)} style={styles.approveBtn}>APPROVE</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* SECTION 2: ADD PAID COURSE (မူရင်းအတိုင်း) */}
        <div>
          <h2 style={{ textAlign: 'center' }}>➕ PAID CLASS</h2>
          <form onSubmit={handleSubmitCourse} style={styles.form}>
            <input placeholder="COURSE ID" style={styles.input} value={courseData.courseId} onChange={(e) => setCourseData({...courseData, courseId: e.target.value})} required />
            <input placeholder="DISPLAY TITLE" style={styles.input} value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} required />
            <input placeholder="INSTRUCTOR" style={styles.input} value={courseData.instructor} onChange={(e) => setCourseData({...courseData, instructor: e.target.value})} />
            <input placeholder="ZOOM LINK" style={styles.input} value={courseData.zoomLink} onChange={(e) => setCourseData({...courseData, zoomLink: e.target.value})} />
            <input placeholder="YOUTUBE ID" style={styles.input} value={courseData.videoLink} onChange={(e) => setCourseData({...courseData, videoLink: e.target.value})} />
            <input placeholder="SCHEDULE" style={styles.input} value={courseData.schedule} onChange={(e) => setCourseData({...courseData, schedule: e.target.value})} />
            <button type="submit" style={styles.btn}>SAVE PAID CLASS</button>
            {addStatus && <div style={styles.statusMsg}>{addStatus}</div>}
          </form>
        </div>

        {/* SECTION 3: NEW! ADD FREE COURSE (အသစ်ထည့်သွင်းမှု) */}
        <div>
          <h2 style={{ textAlign: 'center', color: '#fff' }}>🎁 FREE MISSION</h2>
          <form onSubmit={handleFreeCourseSubmit} style={{...styles.form, borderColor: '#fff'}}>
            <input placeholder="MISSION TITLE" style={styles.input} value={freeCourseData.title} onChange={(e) => setFreeCourseData({...freeCourseData, title: e.target.value})} required />
            <input placeholder="YOUTUBE VIDEO ID" style={styles.input} value={freeCourseData.vidId} onChange={(e) => setFreeCourseData({...freeCourseData, vidId: e.target.value})} required />
            <textarea placeholder="MISSION DETAILS/DESCRIPTIONS" style={{...styles.input, height: '80px'}} value={freeCourseData.detail} onChange={(e) => setFreeCourseData({...freeCourseData, detail: e.target.value})} required />
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>COURSE COVER IMAGE (JPG/PNG)</label>
              <input type="file" accept="image/*" style={styles.input} onChange={(e) => setFreeImage(e.target.files[0])} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>GUIDE PDF (Optional)</label>
              <input type="file" accept="application/pdf" style={styles.input} onChange={(e) => setFreePdf(e.target.files[0])} />
            </div>

            <button type="submit" style={{...styles.btn, background: '#fff'}}>PUBLISH FREE MISSION</button>
            {freeStatus && <div style={{...styles.statusMsg, borderColor: '#fff'}}>{freeStatus}</div>}
          </form>

          {/* DELETE FREE MISSIONS CONTROL (အသစ်ထည့်သွင်းမှု) */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #233554', paddingTop: '20px' }}>
            <h3 style={{ color: '#ff4b2b', textAlign: 'center' }}>🗑️ DELETE MISSIONS</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#0a192f', padding: '10px', borderRadius: '5px' }}>
              {liveFreeCourses.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #233554', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>{c.get("title")}</span>
                  <button onClick={() => handleDeleteFreeCourse(c.id)} style={{ background: '#ff4b2b', color: '#fff', border: 'none', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' }}>DELETE</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: '#112240', fontSize: '12px' },
  tableHeader: { borderBottom: '2px solid #00ff41', textAlign: 'left', color: '#8892b0' },
  tableRow: { borderBottom: '1px solid #233554' },
  approveBtn: { background: '#00ff41', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', color: '#0a192f' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', background: '#112240', padding: '25px', borderRadius: '5px', border: '1px solid #233554' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '10px', color: '#8892b0' },
  input: { padding: '12px', background: '#0a192f', border: '1px solid #233554', color: '#00ff41', outline: 'none', fontFamily: 'monospace' },
  btn: { padding: '15px', background: '#00ff41', color: '#0a192f', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  statusMsg: { marginTop: '10px', padding: '8px', border: '1px solid #00ff41', textAlign: 'center', fontSize: '12px' }
};

export default AdminPortal;