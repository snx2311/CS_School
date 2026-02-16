import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Add from './pages/Add';

// SECURITY LAYER: ကျောင်းသားက တကယ် Approve ဖြစ်မဖြစ် စစ်တဲ့အပိုင်း
const ProtectedRoute = ({ children }) => {
  const enrollment = localStorage.getItem("approvedEnrollment");
  if (!enrollment) {
    // Approve မဖြစ်သေးရင် Home ကို ပြန်မောင်းထုတ်မယ်
    return <Navigate to="/?stay=true" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard ကို Security နဲ့ အုပ်လိုက်ပါတယ် (မူရင်း Route မပျက်စေရပါ) */}
        <Route 
          path="/dashboard/:id" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        /> 

        <Route path="/admin" element={<Admin />} />
        <Route path="/add-class" element={<Add />} />
      </Routes>
    </Router>
  );
}

export default App;