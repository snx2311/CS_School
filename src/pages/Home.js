import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from 'parse';

const Home = () => {
  const navigate = useNavigate();
  
  // Courses Data (မူရင်းအတိုင်း)
  const [courses] = useState([
    { id: "linux", title: "Linux Admin", price: "150,000 MMK", duration: "2 Months", req: "Basic Computer,less than RAM 8 And 256GB", vidId: "yv_vPAtE_kQ", img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97", detail: "Master Linux CLI, Server Management, and Security Auditing.", introDes: "Linux သည် server လောက၏ ဘုရင်ဖြစ်သည်။ Enterprise Server များ တည်ဆောက်ပုံကို လက်တွေ့သင်ကြားရမည်။", instructorName: "Dr. May Mi Ko Ko", instructorImg: "images/919888af5779d83aa33de5790bf7eb72.jpg" },
    { id: "cyber", title: "Cyber Security", price: "200,000 MMK", duration: "2 Months", req: "Network Basics,Basic Computer,less than RAM 8 And 256GB", vidId: "Z3_6qJ0pGno", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", detail: "Learn Threat Hunting, SOC Analysis, and Incident Response.", introDes: "Security Analyst တစ်ယောက်ဖြစ်ဖို့ လိုအပ်တဲ့ SOC Operations များကို Lab များဖြင့် လက်တွေ့လေ့ကျင့်ရမည်။", instructorName: "U Kyaw Naing", instructorImg: "images/images (1).jpeg" },
    { id: "net", title: "Networking", price: "150,000 MMK", duration: "2 Months", req: "Basic Computer,less than RAM 8 And 256GB", vidId: "09Z_yK_hS3k", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8", detail: "Deep dive into CCNA level Networking and Protocols.", introDes: "Network အခြေခံမှစ၍ Router/Switch များ configuration လုပ်ပုံအထိ စနစ်တကျ သင်ကြားပေးမည်။", instructorName: "CISCO GURU", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max" },
    { id: "py_basic", title: "Python Basic", price: "100,000 MMK", duration: "1.5 Months", req: "Logic,Basic Computer,less than RAM 8 And 256GB", vidId: "mX4Z0D_vL_A", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", detail: "Fundamentals of Programming and Automation.", introDes: "Programming လောကထဲ စတင်ဝင်ရောက်မည့်သူများအတွက် အခြေခံအကျဆုံးသင်တန်းဖြစ်သည်။", instructorName: "PY MASTER", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb" },
    { id: "py_adv", title: "Python Adv", price: "200,000 MMK", duration: "2 Months", req: "Python Basic", vidId: "X_9e6XmS-Y0", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", detail: "Object Oriented Programming and Web Frameworks.", introDes: "Python ကို အဆင့်မြင့်အသုံးပြုပြီး Web Application များ ရေးသားလိုသူများအတွက်ဖြစ်သည်။", instructorName: "ADV DEV", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler" },
    { id: "hacking", title: "World Hacking", price: "150,000 MMK", duration: "4 Months", req: "Linux/Network", vidId: "f9p233_rMSc", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3", detail: "Real-world Pentesting and Exploitation.", introDes: "Ethical Hacking ကို စနစ်တကျလေ့လာပြီး Bug Bounty ရှာဖွေလိုသူများအတွက် အကောင်းဆုံးဖြစ်သည်။", instructorName: "DARK KNIGHT", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow" }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFounderCard, setShowFounderCard] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('kpay');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkPhone, setCheckPhone] = useState('');
  const [statusResult, setStatusResult] = useState(null);

  useEffect(() => {
    const savedEnrollment = localStorage.getItem("approvedEnrollment");
    const params = new URLSearchParams(window.location.search);
    if (savedEnrollment && !params.get("stay")) {
      const data = JSON.parse(savedEnrollment);
      navigate(`/dashboard/${data.courseId}`);
    }
  }, [navigate]);

  const payments = {
    kpay: { name: "KPay", acc: "09455690715(DNZT)", logo: "/images/unnamed.png" },
    wave: { name: "Wave Money", acc: "09953716690(UKMB)", logo: "/images/images.jpeg" },
    ayapay: { name: "AYA Pay", acc: "09953716690(UKMB)", logo: "/images/ayapay-feature.jpg" },
    visa: { name: "Visa Card", acc: "Not Available", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" }
  };

  const handleEnrollClick = (course) => { setSelectedCourse(course); setShowEnrollForm(true); };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setReceiptFile(file); setReceiptPreview(URL.createObjectURL(file)); }
  };

  // ADMIN PAGE တွင် ပေါ်လာစေရန် ACL ထည့်သွင်းပြင်ဆင်ထားသော Function
  const handleSubmitMission = async () => {
    if (!studentName || !phoneNumber || !receiptFile) { alert("အချက်အလက်အားလုံး ဖြည့်စွက်ပေးပါ။"); return; }
    
    // SECURITY: Input Sanitization
    const cleanName = studentName.trim();
    const cleanPhone = phoneNumber.trim();
    if (cleanName.includes("<") || cleanPhone.includes("<")) {
      alert("Invalid Input Detected!");
      return;
    }

    setIsSubmitting(true);
    try {
      const Enroll = Parse.Object.extend("Enrollments");
      const enroll = new Enroll();
      const parseFile = new Parse.File("receipt.jpg", receiptFile);
      await parseFile.save();
      
      enroll.set("studentName", cleanName);
      enroll.set("phoneNumber", cleanPhone);
      enroll.set("courseId", selectedCourse.id);
      enroll.set("courseTitle", selectedCourse.title);
      enroll.set("paymentMethod", selectedPayment);
      enroll.set("receipt", parseFile);
      enroll.set("status", "pending");

      // +++ ADMIN ဆီတွင် DATA ပေါ်လာစေရန် ACL သတ်မှတ်ချက် +++
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);   // Admin Page က Query လုပ်လျှင် မြင်ရစေရန်
      acl.setPublicWriteAccess(false);  // မည်သူမှ လာရောက်ပြင်ဆင်ခြင်း မပြုနိုင်စေရန်
      enroll.setACL(acl);
      // ++++++++++++++++++++++++++++++++++++++++++++++
      
      await enroll.save();
      alert("Mission Request Sent! 🚀 ၁၅ မိနစ်ခန့်စောင့်ဆိုင်းပေးပါ။");
      setShowEnrollForm(false); setSelectedCourse(null); setReceiptFile(null); setReceiptPreview(null);
    } catch (error) { 
      alert(error.message); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const checkMyStatus = async () => {
    if (!checkPhone) return;
    try {
      const result = await Parse.Cloud.run("checkEnrollmentStatus", { phoneNumber: checkPhone });
      if (result) {
        setStatusResult(result);
        if (result.status === 'approved') {
          localStorage.setItem("approvedEnrollment", JSON.stringify({ 
            courseId: result.courseId, 
            phoneNumber: checkPhone 
          }));
        }
      } else { alert("ဒီဖုန်းနံပါတ်နဲ့ စာရင်းသွင်းထားတာ မရှိသေးပါဘူး။"); }
    } catch (e) { alert("ရှာမတွေ့ပါ။ ဖုန်းနံပါတ် ပြန်စစ်ပေးပါ။"); }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes autoLoop { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .slider-track { display: flex; width: max-content; animation: autoLoop 40s linear infinite; }
          .slider-track:hover { animation-play-state: paused; }
          .social-icon:hover { transform: scale(1.2); }
          @media (max-width: 768px) {
            .navbar { flex-direction: column !important; height: auto !important; padding: 15px !important; gap: 10px; }
            .nav-left, .nav-right { width: 100%; justify-content: center !important; }
            .school-name { font-size: 0.75rem !important; }
            .header-logo { height: 50px !important; }
            .founder-img { width: 55px !important; height: 55px !important; }
            .footer-content { flex-direction: column !important; text-align: center !important; gap: 20px !important; }
          }
        `}
      </style>

      {/* NAVBAR */}
      <nav className="navbar" style={styles.nav}>
        <div className="nav-left" style={styles.navLeft}>
            <div style={styles.founderBox} onClick={() => setShowFounderCard(true)}>
                <img src="images/photo_2026-02-16_07-54-03.jpg" alt="Founder" className="founder-img" style={styles.founderImg} />
                <span style={styles.founderLabel}>တည်ထောင်သူ</span>
            </div>
        </div>
        <div style={styles.logoWrapper}>
          <img src="images/Gemini_Generated_Image_hmvwxnhmvwxnhmvw-removebg-preview.png" alt="CSA Logo" className="header-logo" style={styles.headerLogo} />
          <h2 className="school-name" style={styles.logo}>CYBER SERVICE ACADEMY (CSA)</h2>
        </div>
        <div className="nav-right" style={styles.navRight}>
          <button onClick={() => setShowStatusModal(true)} style={styles.checkStatusBtn}>CHECK STATUS</button>
        </div>
      </nav>

      {/* FOUNDER MODAL */}
      {showFounderCard && (
        <div style={styles.modalOverlay} onClick={() => setShowFounderCard(false)}>
            <div style={styles.founderCard} onClick={e => e.stopPropagation()}>
                <img src="images/photo_2026-02-16_07-54-03.jpg" alt="Founder" style={styles.largeFounderImg} />
                <h2 style={{color: '#00ff41', margin: '10px 0'}}>U Kaung Myat Bhone</h2>
                <p style={{color: '#8892b0', fontSize: '14px'}}>B.SC(Computer)DSA | Diploma in Law</p>
                <div style={styles.founderBody}>
                    <p style={{color: '#fff', fontSize: '13px', lineHeight: '1.6'}}>
                        နည်းပညာလောကမှာ အမှန်တကယ် တတ်မြောက်ကျွမ်းကျင်တဲ့ မျိုးဆက်သစ်လူငယ်တွေ ပေါ်ထွက်လာဖို့အတွက် ရည်ရွယ်ပြီး CSA ကို တည်ထောင်ခဲ့တာဖြစ်ပါတယ်။
                    </p>
                </div>
                <button style={styles.abortBtn} onClick={() => setShowFounderCard(false)}>CLOSE</button>
            </div>
        </div>
      )}

      {/* HERO SLIDER */}
      <div style={styles.heroSection}>
        <div style={styles.sliderContainer}>
          <div className="slider-track">
            {[...courses, ...courses].map((course, idx) => (
              <div key={`${course.id}-${idx}`} style={{...styles.loopItem, backgroundImage: `url(${course.img})`}} onClick={() => setSelectedCourse(course)}>
                <div style={styles.loopContent}>
                  <div style={styles.loopTitle}>{course.title}</div>
                  <div style={styles.loopInstructor}>By {course.instructorName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSIONS GRID */}
      <div style={styles.introContainer}>
        <h2 style={styles.sectionTitle}>[Available Missions]</h2>
        <div style={styles.missionGrid}>
          {courses.map((course) => (
            <div key={course.id} style={styles.missionShapeCard}>
              <div style={{...styles.imgWrap, backgroundImage: `url(${course.img})`}}></div>
              <div style={styles.missionText}>
                <div style={styles.instructorSection}>
                  <div style={styles.miniProfileFrame}><img src={course.instructorImg} alt="pro" style={styles.miniProfileImg} /></div>
                  <div style={{textAlign: 'left'}}>
                    <p style={{margin: 0, fontSize: '10px', color: '#8892b0'}}>INSTRUCTOR</p>
                    <span style={styles.instructorNameTag}>{course.instructorName}</span>
                  </div>
                </div>
                <h3 style={{ color: '#00ff41', margin: '5px 0', fontSize: '1.4rem' }}>{course.title}</h3>
                <p style={{ fontSize: '12px', color: '#8892b0', height: '40px', overflow: 'hidden' }}>{course.introDes}</p>
                <div style={{color: '#00ff41', fontSize: '1.1rem', fontWeight: 'bold', margin: '10px 0'}}>{course.price}</div>
                <button onClick={() => handleEnrollClick(course)} style={styles.shapeBtn}>ENROLL MISSION</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ENROLL & STATUS MODALS */}
      {(selectedCourse || showEnrollForm) && (
        <div style={styles.modalOverlay} onClick={() => { setSelectedCourse(null); setShowEnrollForm(false); setReceiptPreview(null); }}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalMain}>
              {!showEnrollForm ? (
                <>
                  <h2 style={{ color: '#00ff41' }}>MISSION: {selectedCourse.title}</h2>
                  <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${selectedCourse.vidId}`} style={{ border: 'none', borderRadius: '8px' }} title="video"></iframe>
                  <p style={{ color: '#8892b0' }}>{selectedCourse.detail}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button style={styles.abortBtn} onClick={() => setSelectedCourse(null)}>ABORT</button>
                    <button style={styles.enrollBtn} onClick={() => setShowEnrollForm(true)}>JOIN MISSION</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ color: '#00ff41', textAlign: 'center' }}>REGISTRATION</h3>
                  <input style={styles.input} placeholder="NAME" onChange={e => setStudentName(e.target.value)} />
                  <input style={styles.input} placeholder="PHONE" onChange={e => setPhoneNumber(e.target.value)} />
                  <div style={styles.paymentFlex}>
                    {Object.keys(payments).map(key => (
                      <div key={key} onClick={() => setSelectedPayment(key)} style={{...styles.payIconBox, borderColor: selectedPayment === key ? '#00ff41' : '#233554'}}>
                        <img src={payments[key].logo} style={styles.payLogoImg} alt={key} />
                      </div>
                    ))}
                  </div>
                  <div style={styles.accDisplay}>
                    <h4 style={{margin: '5px 0', color: '#00ff41'}}>{payments[selectedPayment].acc}</h4>
                  </div>
                  <label style={styles.uploadArea}>
                    <input type="file" hidden onChange={handleFileChange} />
                    {!receiptPreview ? <div style={{color: '#00ff41'}}>📸 RECEIPT</div> : <img src={receiptPreview} style={{height: '80px'}} alt="Preview" />}
                  </label>
                  <button style={styles.enrollBtn} onClick={handleSubmitMission} disabled={isSubmitting}>{isSubmitting ? "WAIT..." : "SUBMIT"}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowStatusModal(false); setStatusResult(null); }}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalMain}>
              <h3 style={{ color: '#00ff41' }}>CHECK STATUS</h3>
              <input style={styles.input} placeholder="PHONE NUMBER" onChange={e => setCheckPhone(e.target.value)} />
              <button style={styles.enrollBtn} onClick={checkMyStatus}>CHECK</button>
              {statusResult && (
                <div style={styles.statusBox}>
                   <p style={{color: '#fff'}}>Status: <b style={{color: '#00ff41'}}>{statusResult.status.toUpperCase()}</b></p>
                   {statusResult.status === 'approved' && <button onClick={() => navigate(`/dashboard/${statusResult.courseId}`)} style={styles.enrollBtn}>DASHBOARD</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent} className="footer-content">
          <div>
            <h2 style={{ color: '#00ff41', margin: 0 }}>CSA</h2>
            <p style={{ fontSize: '12px', color: '#8892b0' }}>Empowering Future Tech Leaders.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
             <a href="https://www.facebook.com/share/1DgBW43o8Y/" target="_blank" rel="noreferrer"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" className="social-icon" style={styles.socialIcon} alt="FB"/></a>
             <a href="https://t.me/MyATBhone34" target="_blank" rel="noreferrer"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="24" className="social-icon" style={styles.socialIcon} alt="TG"/></a>
             <a href="mailto:mrkolwin49@gmail.com"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="24" className="social-icon" style={styles.socialIcon} alt="Mail"/></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#0a192f', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'monospace' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', background: '#1c1f26', position: 'fixed', width: '100%', zIndex: 1000, borderBottom: '2px solid #00ff41', boxSizing: 'border-box' },
  navLeft: { flex: 1, display: 'flex', justifyContent: 'flex-start' },
  founderBox: { textAlign: 'center', cursor: 'pointer' },
  founderImg: { width: '65px', height: '65px', borderRadius: '50%', border: '2px solid #00ff41', objectFit: 'cover' },
  founderLabel: { display: 'block', color: '#00ff41', fontSize: '9px', marginTop: '4px' },
  logoWrapper: { flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  headerLogo: { height: '70px', width: 'auto' },
  logo: { color: '#00ff41', margin: 0, fontSize: '1rem', textAlign: 'center' },
  navRight: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  checkStatusBtn: { background: 'transparent', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 15px', cursor: 'pointer' },
  founderCard: { background: '#112240', padding: '30px', border: '1px solid #00ff41', maxWidth: '380px', textAlign: 'center', borderRadius: '15px' },
  largeFounderImg: { width: '110px', height: '110px', borderRadius: '50%', border: '3px solid #00ff41' },
  founderBody: { background: 'rgba(0,255,65,0.05)', padding: '15px', borderRadius: '8px', margin: '15px 0' },
  heroSection: { paddingTop: '140px', paddingBottom: '50px' },
  sliderContainer: { width: '100%', overflow: 'hidden' },
  loopItem: { width: '280px', height: '350px', margin: '0 15px', backgroundSize: 'cover', borderRadius: '12px', border: '1px solid #00ff41', position: 'relative', cursor: 'pointer' },
  loopContent: { position: 'absolute', bottom: 0, width: '100%', background: 'rgba(10,25,47,0.9)', padding: '15px', boxSizing: 'border-box' },
  loopTitle: { color: '#00ff41' },
  loopInstructor: { color: '#8892b0', fontSize: '11px' },
  introContainer: { padding: '50px 5%' },
  sectionTitle: { textAlign: 'center', color: '#00ff41' },
  missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
  missionShapeCard: { background: '#112240', border: '1px solid #233554', clipPath: 'polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)' },
  imgWrap: { height: '160px', backgroundSize: 'cover' },
  missionText: { padding: '20px', textAlign: 'center' },
  instructorSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  miniProfileFrame: { width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #00ff41', overflow: 'hidden' },
  miniProfileImg: { width: '100%', height: '100%', objectFit: 'cover' },
  instructorNameTag: { fontSize: '12px', color: '#fff' },
  shapeBtn: { width: '100%', padding: '12px', background: '#00ff41', color: '#0a192f', border: 'none', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { background: '#112240', width: '90%', maxWidth: '450px', border: '1px solid #00ff41', borderRadius: '10px' },
  modalMain: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', background: '#0a192f', border: '1px solid #233554', color: '#00ff41' },
  paymentFlex: { display: 'flex', justifyContent: 'center', gap: '10px' },
  payIconBox: { width: '50px', height: '40px', border: '1px solid #233554', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff', cursor: 'pointer' },
  payLogoImg: { maxWidth: '80%', maxHeight: '80%' },
  accDisplay: { background: 'rgba(0,255,65,0.05)', padding: '10px', textAlign: 'center' },
  uploadArea: { border: '2px dashed #233554', padding: '20px', textAlign: 'center', cursor: 'pointer' },
  enrollBtn: { background: '#00ff41', color: '#0a192f', border: 'none', padding: '12px', cursor: 'pointer' },
  abortBtn: { background: 'transparent', border: '1px solid #ff4b2b', color: '#ff4b2b', padding: '10px 20px', cursor: 'pointer' },
  statusBox: { marginTop: '15px', border: '1px solid #233554', padding: '10px' },
  footer: { padding: '40px 10%', borderTop: '2px solid #00ff41', marginTop: '50px', background: '#112240' },
  footerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  socialIcon: { filter: 'invert(1) brightness(1.5)', cursor: 'pointer' }
};

export default Home;