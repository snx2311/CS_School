import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Parse from 'parse';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = Parse.User.current();
  const savedEnrollment = JSON.parse(localStorage.getItem("approvedEnrollment"));

  const defaultCourseList = [
    { id: "linux", title: "Linux Administration" },
    { id: "cyber", title: "Cyber Security" },
    { id: "net", title: "Networking" },
    { id: "py_basic", title: "Python (Basic)" },
    { id: "py_adv", title: "Python (Advanced)" },
    { id: "hacking", title: "Real World Hacking" }
  ];

  const [dbData, setDbData] = useState([]);
  const [selectedId, setSelectedId] = useState("linux");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser && !savedEnrollment) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const Course = Parse.Object.extend("Classes");
        const query = new Parse.Query(Course);
        const results = await query.find();
        
        const data = results.map(o => ({
          courseId: o.get("courseId"),
          instructor: o.get("instructor"),
          zoom: o.get("zoomLink"),
          video: o.get("videoLink"),
          schedule: o.get("schedule")
        }));
        
        setDbData(data);
      } catch (error) {
        console.error("Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, navigate, savedEnrollment]);

  const currentDetails = dbData.find(item => item.courseId === selectedId) || {
    instructor: "Assigning...", 
    schedule: "TBA", 
    zoom: "#", 
    video: ""
  };

  const handleLogout = async () => {
    if (currentUser) await Parse.User.logOut();
    localStorage.removeItem("approvedEnrollment");
    navigate('/');
  };

  if (loading) return <div style={styles.loading}>DECRYPTING DATA...</div>;

  return (
    <div style={{ backgroundColor: '#0a192f', minHeight: '100vh', color: '#ccd6f6', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .content-layout { flex-direction: column !important; }
            .sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #233554 !important; padding: 10px !important; display: flex !important; overflow-x: auto !important; white-space: nowrap !important; gap: 10px; }
            .course-tab { padding: 10px 20px !important; border-left: none !important; border-bottom: 3px solid transparent; }
            .main-area { padding: 20px !important; }
            .action-grid { grid-template-columns: 1fr !important; }
            .header-box h1 { font-size: 1.5rem; }
            .meta-flex { flex-direction: column !important; gap: 5px !important; }
            .nav-container { flex-direction: column !important; padding: 15px !important; gap: 15px; }
            .school-logo-img { height: 40px !important; }
            .school-title-text { font-size: 0.9rem !important; }
          }
        `}
      </style>

      {/* HEADER WITH LOGO & SCHOOL NAME */}
      <nav className="nav-container" style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/images/Gemini_Generated_Image_hmvwxnhmvwxnhmvw-removebg-preview.png" 
            alt="CSA Logo" 
            className="school-logo-img"
            style={{ height: '50px', width: 'auto' }}
          />
          <div>
            <h3 className="school-title-text" style={{ color: '#00ff41', margin: 0, fontSize: '1.1rem' }}>CYBER SERVICE ACADEMY</h3>
            <Link to="/?stay=true" style={{ color: '#8892b0', textDecoration: 'none', fontSize: '11px' }}>
              [ GO_HOME ]
            </Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px' }}>Agent: <span style={{color: '#00ff41'}}>{currentUser ? currentUser.get('username') : "STUDENT_ACCESS"}</span></span>
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div className="content-layout" style={styles.contentLayout}>
        {/* Sidebar - သင်တန်းစာရင်း */}
        <div className="sidebar" style={styles.sidebar}>
          <h3 style={{color: '#8892b0', fontSize: '12px', paddingLeft: '10px', letterSpacing: '2px', marginBottom: '15px'}} className="sidebar-title">MY MISSIONS</h3>
          {defaultCourseList.map(course => (
            <div key={course.id} className="course-tab" onClick={() => setSelectedId(course.id)} style={{
                ...styles.courseTab,
                backgroundColor: selectedId === course.id ? '#112240' : 'transparent',
                borderLeft: selectedId === course.id ? '4px solid #00ff41' : '4px solid transparent',
                color: selectedId === course.id ? '#00ff41' : '#8892b0'
            }}>
              {course.title}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-area" style={styles.mainArea}>
          <div style={styles.headerBox}>
            <h1 style={{color: '#00ff41', margin: '0 0 10px 0'}}>
              {defaultCourseList.find(c => c.id === selectedId)?.title}
            </h1>
            <div className="meta-flex" style={{display: 'flex', gap: '30px'}}>
              <p style={styles.metaData}>👤 INSTRUCTOR: <span style={{color: '#fff'}}>{currentDetails.instructor}</span></p>
              <p style={styles.metaData}>🕒 SCHEDULE: <span style={{color: '#fff'}}>{currentDetails.schedule}</span></p>
            </div>
          </div>

          <div className="action-grid" style={styles.actionGrid}>
            {/* Live Zoom Link */}
            <div style={styles.card}>
              <div>
                <h3 style={{color: '#00ff41', marginBottom: '15px'}}>🔴 LIVE MISSION ACCESS</h3>
                <p style={{fontSize: '13px', color: '#8892b0', marginBottom: '20px'}}>အတန်းချိန်ရောက်ပါက အောက်ပါခလုတ်မှတစ်ဆင့် Zoom ဝင်ရောက်နိုင်ပါသည်။</p>
              </div>
              <a href={currentDetails.zoom} target="_blank" rel="noreferrer" 
                 style={currentDetails.zoom === "#" || !currentDetails.zoom ? styles.disabledBtn : styles.zoomBtn}>
                {currentDetails.zoom === "#" || !currentDetails.zoom ? "LINK NOT AVAILABLE" : "JOIN ZOOM CLASS"}
              </a>
            </div>

            {/* Recorded Video */}
            <div style={styles.card}>
              <h3 style={{color: '#00ff41', marginBottom: '15px'}}>📺 MISSION RECORDING</h3>
              {currentDetails.video ? (
                <div style={styles.videoWrapper}>
                  <iframe 
                    src={`https://www.youtube.com/embed/${currentDetails.video}`} 
                    title="vid" 
                    frameBorder="0" 
                    allowFullScreen 
                    style={{width: '100%', minHeight: '200px'}} 
                  />
                </div>
              ) : (
                <div style={styles.noVideo}>
                  <p>ဗီဒီယို မရှိသေးပါ။</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '10px 5%', background: '#112240', borderBottom: '2px solid #00ff41', alignItems: 'center' },
  logoutBtn: { background: 'transparent', color: '#ff4b2b', border: '1px solid #ff4b2b', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' },
  contentLayout: { display: 'flex', flex: 1 },
  sidebar: { width: '280px', background: '#0a192f', borderRight: '1px solid #233554', padding: '20px 10px', boxSizing: 'border-box' },
  courseTab: { padding: '12px 15px', cursor: 'pointer', marginBottom: '5px', fontSize: '13px', transition: '0.3s' },
  mainArea: { flex: 1, padding: '40px', overflowY: 'auto' },
  headerBox: { marginBottom: '30px', borderBottom: '1px solid #233554', paddingBottom: '20px' },
  metaData: { fontSize: '13px', color: '#8892b0', margin: 0 },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  card: { background: '#112240', padding: '20px', borderRadius: '4px', border: '1px solid #233554', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  videoWrapper: { border: '1px solid #00ff41', borderRadius: '4px', overflow: 'hidden', background: '#000' },
  noVideo: { height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #233554', color: '#8892b0' },
  zoomBtn: { display: 'block', textAlign: 'center', background: '#00ff41', color: '#0a192f', padding: '12px', textDecoration: 'none', fontWeight: 'bold', borderRadius: '4px' },
  disabledBtn: { display: 'block', textAlign: 'center', background: '#233554', color: '#8892b0', padding: '12px', textDecoration: 'none', cursor: 'not-allowed', borderRadius: '4px' },
  loading: { height: '100vh', background: '#0a192f', color: '#00ff41', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', letterSpacing: '3px' }
};

export default Dashboard;