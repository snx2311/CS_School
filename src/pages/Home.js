import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from 'parse';

const Home = () => {
  const navigate = useNavigate();
  
  // Tab State & Scroll State
  const [activeTab, setActiveTab] = useState('paid');
  const [isScrolled, setIsScrolled] = useState(false);

  // AI Bot State
  const [aiMessage, setAiMessage] = useState('');
  const [showAiBot, setShowAiBot] = useState(true);
  // ဒီနေရာမှာ မိမိနှစ်သက်ရာ Bot ပုံ Link ကို ပြောင်းထည့်နိုင်ပါတယ်
  const [botProfileImg, setBotProfileImg] = useState("images/Gemini_Generated_Image_hmvwxnhmvwxnhmvw-removebg-preview.png");

  // Custom Classes Data (6 Classes) - Admin က ဒီမှာ Data ပြောင်းရုံနဲ့ UI မှာ အလိုအလျောက်ပြောင်းပါမယ်
  const [customClasses, setCustomClasses] = useState([
    { id: "linux", title: "Linux Admin", videoUrl: "videos/linux.mp4", img: "images/linux.jpg", description: "Linux Server Administration သင်ခန်းစာများ" },
    { id: "cyber", title: "Cyber Security", videoUrl: "videos/cyber.mp4", img: "images/CS.jpg", description: "Cyber Security နှင့် Information Security သင်ခန်းစာများ" },
    { id: "networking", title: "Networking", videoUrl: "videos/net.mp4", img: "images/Net.jpg", description: "Network Engineering နှင့် Infrastructure သင်ခန်းစာများ" },
    { id: "py_basic", title: "Python Basic", videoUrl: "videos/pybasic.mp4", img: "images/python1.jpg", description: "Python Programming အခြေခံသင်ခန်းစာများ" },
    { id: "py_adv", title: "Python Adv", videoUrl: "videos/pyadv.mp4", img: "images/Features_Of_Python_1_f4ccd6d9f7.jpg", description: "Advanced Python Development သင်ခန်းစာများ" },
    { id: "hacking", title: "Hacking", videoUrl: "videos/hacking.mp4", img: "images/imagen-ilustrativa-hacking-etico.png", description: "Ethical Hacking နှင့် Penetesting သင်ခန်းစာများ" }
  ]);

  // Paid Courses Data
  const [courses] = useState([
    { id: "linux", title: "Linux Admin", price: "150,000 MMK", duration: "2 Months", req: "Basic Computer,less than RAM 8 And 256GB", vidId: "yv_vPAtE_kQ", img: "images/linux.jpg", detail: "Master Linux CLI, Server Management, and Security Auditing.", introDes: "Linux သည် server လောက၏ ဘုရင်ဖြစ်သည်။ Enterprise Server များ တည်ဆောက်ပုံကို လက်တွေ့သင်ကြားရမည်။", instructorName: "Dr. May Mi Ko Ko", instructorImg: "images/919888af5779d83aa33de5790bf7eb72.jpg" },
    { id: "cyber", title: "Cyber Security", price: "200,000 MMK", duration: "2 Months", req: "Network Basics,Basic Computer,less than RAM 8 And 256GB", vidId: "Z3_6qJ0pGno", img: "images/CS.jpg", detail: "Learn Threat Hunting, SOC Analysis, and Incident Response.", introDes: "Security Analyst တစ်ယောက်ဖြစ်ဖို့ လိုအပ်တဲ့ SOC Operations များကို Lab များဖြင့် လက်တွေ့လေ့ကျင့်ရမည်။", instructorName: "U Kyaw Naing", instructorImg: "images/images (1).jpeg" },
    { id: "net", title: "Networking", price: "150,000 MMK", duration: "2 Months", req: "Basic Computer,less than RAM 8 And 256GB", vidId: "09Z_yK_hS3k", img: "images/Net.jpg", detail: "Deep dive into CCNA level Networking and Protocols.", introDes: "Network အခြေခံမှစ၍ Router/Switch များ configuration လုပ်ပုံအထိ စနစ်တကျ သင်ကြားပေးမည်။", instructorName: "CISCO GURU", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max" },
    { id: "py_basic", title: "Python Basic", price: "100,000 MMK", duration: "1.5 Months", req: "Logic,Basic Computer,less than RAM 8 And 256GB", vidId: "mX4Z0D_vL_A", img: "images/python1.jpg", detail: "Fundamentals of Programming and Automation.", introDes: "Programming လောကထဲ စတင်ဝင်ရောက်မည့်သူများအတွက် အခြေခံအကျဆုံးသင်တန်းဖြစ်သည်။", instructorName: "PY MASTER", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb" },
    { id: "py_adv", title: "Python Adv", price: "200,000 MMK", duration: "2 Months", req: "Python Basic", vidId: "X_9e6XmS-Y0", img: "images/Features_Of_Python_1_f4ccd6d9f7.jpg", detail: "Object Oriented Programming and Web Frameworks.", introDes: "Python ကို အဆင့်မြင့်အသုံးပြုပြီး Web Application များ ရေးသားလိုသူများအတွက်ဖြစ်သည်။", instructorName: "ADV DEV", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler" },
    { id: "hacking", title: "World Hacking", price: "150,000 MMK", duration: "4 Months", req: "Linux/Network", vidId: "f9p233_rMSc", img: "images/imagen-ilustrativa-hacking-etico.png", detail: "Real-world Pentesting and Exploitation.", introDes: "Ethical Hacking ကို စနစ်တကျလေ့လာပြီး Bug Bounty ရှာဖွေလိုသူများအတွက် အကောင်းဆုံးဖြစ်သည်။", instructorName: "DARK KNIGHT", instructorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow" }
  ]);

  const [freeCourses, setFreeCourses] = useState([]); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedFreeCourse, setSelectedFreeCourse] = useState(null); 
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFounderCard, setShowFounderCard] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('kpay');
  const [transactionId, setTransactionId] = useState(''); 
  const [senderAccountName, setSenderAccountName] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkPhone, setCheckPhone] = useState('');
  const [statusResult, setStatusResult] = useState(null);

  useEffect(() => {
    // AI Typing Effect
    const fullText = "နည်းပညာလောကမှာ အမှန်တကယ် တတ်မြောက်ကျွမ်းကျင်တဲ့ မျိုးဆက်သစ်လူငယ်တွေ ပေါ်ထွက်လာဖို့အတွက် ရည်ရွယ်ပြီး CSA ကို တည်ထောင်ခဲ့တာဖြစ်ပါတယ်။ Welcome to CSA! စနစ်တကျနဲ့ နည်းပညာကို လေ့လာလိုက်ပါ။ တတ်ရောက်နိုင်သော သင်တန်းများနှင့် အခမဲ့လေ့လာစရာများကို လေ့လာသင်ယူလိုက်ပါ။ ကျေးဇူးတင်ပါတယ်";
    let index = 0;
    const timer = setInterval(() => {
      setAiMessage(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Database မှ Custom Class Data များကို Fetch လုပ်ခြင်း
    const fetchCustomClasses = async () => {
      try {
        const query = new Parse.Query("CustomTabs");
        const results = await query.find();
        if (results.length > 0) {
          const formatted = results.map(res => ({
            id: res.get("tabId"), // Database ထဲတွင် linux, cyber စသဖြင့် သိမ်းထားရပါမည်
            title: res.get("title"),
            videoUrl: res.get("videoUrl"),
            description: res.get("description"),
            img: res.get("image") ? res.get("image").url() : null
          }));
          setCustomClasses(prev => prev.map(item => {
            const remote = formatted.find(f => f.id === item.id);
            return remote ? { ...item, ...remote, img: remote.img || item.img } : item;
          }));
        }
      } catch (e) { console.log("Custom classes not found"); }
    };
    fetchCustomClasses();

    const fetchFreeCourses = async () => {
      try {
        const query = new Parse.Query("FreeCourses");
        query.descending("createdAt");
        const results = await query.find();
        const formatted = results.map(res => ({
          id: res.id,
          title: res.get("title"),
          vidId: res.get("vidId"),
          img: res.get("image")?.url() || "images/CS.jpg",
          pdf: res.get("pdf")?.url() || "#",
          detail: res.get("detail")
        }));
        setFreeCourses(formatted);
      } catch (e) { console.log("Free courses not found in DB"); }
    };
    fetchFreeCourses();

    const savedEnrollment = localStorage.getItem("approvedEnrollment");
    const params = new URLSearchParams(window.location.search);
    if (savedEnrollment && !params.get("stay")) {
      const data = JSON.parse(savedEnrollment);
      navigate(`/dashboard/${data.courseId}`);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [navigate]);

  const payments = {
    kpay: { name: "KPay", acc: "09455690715(DNZT)", logo: "/images/unnamed.png" },
    wave: { name: "Wave Money", acc: "09953716690(UKMB)", logo: "/images/images.jpeg" },
    ayapay: { name: "AYA Pay", acc: "09953716690(UKMB)", logo: "/images/ayapay-feature.jpg" },
    visa: { name: "Visa Card", acc: "Not Available", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" }
  };

  const handleEnrollClick = (course) => { setSelectedCourse(course); setShowEnrollForm(true); };

  const handleSubmitMission = async () => {
    if (!studentName || !phoneNumber || !transactionId || !senderAccountName) { 
      alert("အချက်အလက်အားလုံး ပြည့်စုံစွာ ဖြည့်စွက်ပေးပါ။"); 
      return; 
    }
    setIsSubmitting(true);
    try {
      const Enroll = Parse.Object.extend("Enrollments");
      const enroll = new Enroll();
      enroll.set("studentName", studentName.trim());
      enroll.set("phoneNumber", phoneNumber.trim());
      enroll.set("transactionId", transactionId.trim());
      enroll.set("senderAccountName", senderAccountName.trim());
      enroll.set("courseId", selectedCourse.id);
      enroll.set("courseTitle", selectedCourse.title);
      enroll.set("paymentMethod", selectedPayment);
      enroll.set("status", "pending");
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      enroll.setACL(acl);
      await enroll.save();
      alert("Mission Request Sent! 🚀");
      setShowEnrollForm(false); 
      setSelectedCourse(null);
    } catch (error) { alert("Error: " + error.message); }
    finally { setIsSubmitting(false); }
  };

  const checkMyStatus = async () => {
    if (!checkPhone) return;
    try {
      const result = await Parse.Cloud.run("checkEnrollmentStatus", { phoneNumber: checkPhone });
      if (result) {
        setStatusResult(result);
        if (result.status === 'approved') {
          localStorage.setItem("approvedEnrollment", JSON.stringify({ courseId: result.courseId, phoneNumber: checkPhone }));
        }
      } else { alert("စာရင်းသွင်းထားတာ မရှိသေးပါ။"); }
    } catch (e) { alert("ရှာမတွေ့ပါ။"); }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes autoLoop { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes neonPulse { 0% { box-shadow: 0 0 5px rgba(0, 255, 65, 0.4); } 50% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.8); } 100% { box-shadow: 0 0 5px rgba(0, 255, 65, 0.4); } }
          @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

          .slider-track { display: flex; width: max-content; animation: autoLoop 30s linear infinite; }
          .slider-track:hover { animation-play-state: running !important; }
          
          .social-icon:hover { transform: scale(1.2); }
          
          .mission-card { 
            animation: fadeInUp 0.6s ease-out forwards; 
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            cursor: pointer; 
            position: relative; 
          }
          .mission-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 15px 35px rgba(0, 255, 65, 0.3); border-color: #00ff41 !important; z-index: 10; }
          
          .responsive-img { width: 100%; height: 220px; object-fit: cover; border-bottom: 1px solid #233554; }

          /* AI Bot Style - Updated for Transparency */
          .ai-bot-container {
            position: fixed; bottom: 20px; right: 20px; z-index: 5000;
            display: flex; align-items: flex-end; gap: 10px;
            animation: slideInRight 0.5s ease-out;
          }
          .ai-bubble {
            background: rgba(17, 34, 64, 0.75); /* Transparent Background */
            backdrop-filter: blur(8px); /* Glass effect */
            border: 1px solid #00ff41; color: #00ff41;
            padding: 12px 18px; borderRadius: 15px 15px 0 15px;
            max-width: 250px; font-size: 13px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          }
          .ai-bot-img {
            width: 60px; height: 60px; border-radius: 50%; border: 2px solid #00ff41;
            background: #0a192f; object-fit: cover; box-shadow: 0 0 15px #00ff41;
            animation: float 3s ease-in-out infinite; cursor: pointer;
          }

          /* 3D Tab Styles */
          .tab-btn { 
            background: #112240; color: #8892b0; border: 1px solid #233554; 
            padding: 12px 25px; cursor: pointer; font-family: monospace; 
            font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px #0a192f; border-radius: 8px;
          }
          .tab-btn:hover { color: #00ff41; border-color: rgba(0,255,65,0.5); transform: translateY(-2px); box-shadow: 0 6px #0a192f; }
          .tab-btn.active { 
            color: #00ff41; border-color: #00ff41; transform: translateY(-5px); 
            box-shadow: 0 8px 15px rgba(0, 255, 65, 0.2); background: #1d2d50;
            animation: neonPulse 1.5s infinite;
          }

          .class-video { width: 100%; border-radius: 10px; border: 1px solid #00ff41; background: #000; margin-bottom: 20px; }
          .class-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; border: 1px solid #233554; margin-bottom: 20px; }

          @media (max-width: 768px) {
            .navbar { flex-direction: column !important; height: auto !important; padding: 10px !important; gap: 5px !important; }
            .header-logo { height: 45px !important; }
            .school-name { font-size: 0.7rem !important; margin: 0 !important; }
            .hero-slide-item { height: 40vh !important; }
            .check-status-btn { font-size: 10px !important; padding: 5px 10px !important; }
            .responsive-img { height: 180px; }
            .tab-btn { padding: 8px 15px; font-size: 11px; }
            .ai-bubble { font-size: 11px; max-width: 180px; }
          }
        `}
      </style>

      {/* AI BOT INTRO */}
      {showAiBot && (
        <div className="ai-bot-container">
          <div className="ai-bubble">
            <div style={{fontWeight: 'bold', borderBottom: '1px solid #00ff41', marginBottom: '5px', fontSize: '10px'}}>CSA</div>
            {aiMessage}
            <div onClick={() => setShowAiBot(false)} style={{textAlign: 'right', marginTop: '5px', cursor: 'pointer', fontSize: '10px', color: '#8892b0'}}>[CLOSE]</div>
          </div>
          <img 
            src={botProfileImg} 
            alt="AI Bot" 
            className="ai-bot-img" 
            onClick={() => setAiMessage("စနစ်တကျနဲ့ နည်းပညာကို လေ့လာလိုက်ပါ။")}
          />
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar" style={{...styles.nav, background: isScrolled ? '#1c1f26' : 'transparent', boxShadow: isScrolled ? '0 5px 15px rgba(0,0,0,0.5)' : 'none'}}>
        <div style={styles.navLeft}></div>
        <div style={styles.logoWrapper}>
          <img src="images/Gemini_Generated_Image_hmvwxnhmvwxnhmvw-removebg-preview.png" alt="CSA Logo" className="header-logo" style={styles.headerLogo} />
          <h2 className="school-name" style={styles.logo}>CYBER SERVICE ACADEMY (CSA)</h2>
        </div>
        <div style={styles.navRight}>
          <button className="check-status-btn" onClick={() => setShowStatusModal(true)} style={styles.checkStatusBtn}>သင်တန်းလက်ခံမှုစစ်ဆေးရန်</button>
        </div>
      </nav>

      {/* HERO SLIDER */}
      <div style={styles.heroSection}>
        <div style={styles.sliderContainer}>
          <div className="slider-track">
            {[...courses, ...courses].map((course, idx) => (
              <div key={`${course.id}-${idx}`} className="hero-slide-item" style={{...styles.loopItem, backgroundImage: `linear-gradient(to bottom, rgba(10,25,47,0.2), rgba(10,25,47,1)), url(${course.img})`}} onClick={() => setSelectedCourse(course)}>
                <div style={styles.loopContent}>
                  <div style={styles.loopTitle}>{course.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAB SELECTOR - ၆ ခုသီးသန့်စီ ခွဲထားပါတယ် */}
      <div style={styles.tabWrapper}>
        <button className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`} onClick={() => setActiveTab('paid')}>သင်တန်းအားလုံး</button>
        {customClasses.map((cls) => (
          <button key={cls.id} className={`tab-btn ${activeTab === cls.id ? 'active' : ''}`} onClick={() => setActiveTab(cls.id)}>
            {cls.title}
          </button>
        ))}
        <button className={`tab-btn ${activeTab === 'free' ? 'active' : ''}`} onClick={() => setActiveTab('free')}>အခမဲ့လေ့လာစရာများ</button>
      </div>

      {/* CONTENT AREA */}
      <div style={styles.introContainer}>
        
        {/* Main Courses Tab */}
        {activeTab === 'paid' && (
          <>
            <h2 style={styles.sectionTitle}>[Available Paid Missions]</h2>
            <div style={styles.missionGrid}>
              {courses.map((course, index) => (
                <div key={course.id} className="mission-card" style={{...styles.missionShapeCard, animationDelay: `${index * 0.1}s`}} onClick={() => handleEnrollClick(course)}>
                  <img src={course.img} alt={course.title} className="responsive-img" />
                  <div style={styles.missionText}>
                    <h3 style={{ color: '#00ff41', margin: '10px 0' }}>{course.title}</h3>
                    <div style={{color: '#fff', fontSize: '14px', marginBottom: '15px'}}>{course.price}</div>
                    <button style={styles.shapeBtn}>VIEW DETAILS</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Dynamic Tabs Content (Admin တင်ထားသမျှ တစ်ခုချင်းစီပြပေးမယ့်အပိုင်း) */}
        {customClasses.map((cls) => activeTab === cls.id && (
          <div key={cls.id} style={{ animation: 'fadeInUp 0.5s ease' }}>
            <h2 style={styles.sectionTitle}>[{cls.title} Section]</h2>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#112240', padding: '30px', borderRadius: '15px', border: '1px solid #00ff41' }}>
              <img src={cls.img} alt={cls.title} className="class-image" />
              {/* key ကို URL ပေးထားခြင်းဖြင့် Tab ပြောင်းလျှင် Video ပါ Refresh ဖြစ်သွားမည် */}
              <video key={cls.videoUrl} controls className="class-video">
                <source src={cls.videoUrl} type="video/mp4" />
                Your browser does not support video.
              </video>
              <div style={styles.introBox}>
                <h3 style={{ color: '#00ff41', marginBottom: '15px' }}>Course Description</h3>
                <p style={{ color: '#fff', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{cls.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Free Lessons Tab */}
        {activeTab === 'free' && (
          <>
            <h2 style={{...styles.sectionTitle, color: '#fff'}}>[အခမဲ့လေ့လာစရာများ]</h2>
            <div style={styles.missionGrid}>
              {freeCourses.length > 0 ? (
                freeCourses.map((course, index) => (
                  <div key={course.id} className="mission-card" style={{...styles.missionShapeCard, borderColor: '#fff', animationDelay: `${index * 0.1}s`}} onClick={() => setSelectedFreeCourse(course)}>
                    <div style={{ position: 'relative' }}>
                      <img src={course.img} alt={course.title} className="responsive-img" />
                      <div style={styles.freeBadge}>FREE</div>
                    </div>
                    <div style={styles.missionText}>
                      <h3 style={{ color: '#fff', margin: '10px 0' }}>{course.title}</h3>
                      <button style={{...styles.shapeBtn, color: '#fff', borderColor: '#fff'}}>START FREE LESSON</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#8892b0'}}>သင်ခန်းစာများ မကြာမီလာပါမည်...</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODALS & OTHERS (Original Logic preserved) */}
      {showStatusModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowStatusModal(false); setStatusResult(null); }}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalMain}>
              <h3 style={{ color: '#00ff41' }}>သင်တန်းလက်ခံမှုစစ်ဆေးရန်</h3>
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
        <div style={styles.footerContent}>
          <div><h2 style={{ color: '#00ff41', margin: 0 }}>CSA</h2><p style={{ fontSize: '12px', color: '#8892b0' }}>Empowering Future Tech Leaders.</p></div>
          <div style={{ display: 'flex', gap: '20px' }}>
             <a href="https://www.facebook.com/share/1DgBW43o8Y/" target="_blank" rel="noreferrer"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" className="social-icon" style={styles.socialIcon} alt="FB"/></a>
             <a href="https://t.me/MyATBhone34" target="_blank" rel="noreferrer"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="24" className="social-icon" style={styles.socialIcon} alt="TG"/></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#0a192f', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'monospace' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', position: 'fixed', width: '100%', zIndex: 1000, transition: '0.4s', borderBottom: '1px solid rgba(0, 255, 65, 0.2)', boxSizing: 'border-box' },
  navLeft: { flex: 1 },
  logoWrapper: { flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  headerLogo: { height: '60px' },
  logo: { color: '#00ff41', margin: 0, fontSize: '1rem', textAlign: 'center' },
  navRight: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  checkStatusBtn: { background: 'transparent', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 15px', cursor: 'pointer', fontSize: '12px' },
  heroSection: { height: '65vh' },
  sliderContainer: { width: '100%', height: '100%', overflow: 'hidden' },
  loopItem: { width: '100vw', height: '65vh', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', display: 'flex', alignItems: 'flex-end' },
  loopContent: { width: '100%', padding: '20px 10%', background: 'linear-gradient(transparent, #0a192f)' },
  loopTitle: { color: '#00ff41', fontSize: '2rem' },
  tabWrapper: { display: 'flex', justifyContent: 'center', gap: '10px', padding: '40px 0', borderBottom: '1px solid #233554', flexWrap: 'wrap' },
  introContainer: { padding: '50px 5%', minHeight: '60vh' },
  sectionTitle: { textAlign: 'center', color: '#00ff41', marginBottom: '30px' },
  missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
  missionShapeCard: { background: '#112240', border: '1px solid #233554', borderRadius: '15px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  freeBadge: { position: 'absolute', top: '10px', right: '10px', background: '#00ff41', color: '#0a192f', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' },
  missionText: { padding: '20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  shapeBtn: { width: '100%', padding: '12px', background: 'transparent', color: '#00ff41', border: '1px solid #00ff41', cursor: 'pointer', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
  modalContent: { background: '#112240', width: '90%', maxWidth: '420px', padding: '20px', borderRadius: '15px', border: '1px solid #00ff41' },
  modalMain: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', background: '#0a192f', border: '1px solid #233554', color: '#00ff41', borderRadius: '5px' },
  enrollBtn: { background: '#00ff41', color: '#0a192f', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold' },
  statusBox: { marginTop: '15px', border: '1px solid #00ff41', padding: '10px' },
  footer: { padding: '40px 10%', borderTop: '2px solid #00ff41', marginTop: '50px' },
  footerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  socialIcon: { filter: 'invert(1) brightness(1.5)', cursor: 'pointer' },
  introBox: { background: 'rgba(0,255,65,0.05)', padding: '20px', borderLeft: '3px solid #00ff41', marginTop: '20px' }
};

export default Home;