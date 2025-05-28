import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MultiStepForm from './components/MultiStepForm';
import Login from './components/Login';
import SchoolRegistration from './components/Signup';
import EduSyncLanding from './components/LandingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        {/* Wrap protected routes with PrivateRoute */}
        
          <Route path="/admin/*" element={<Dashboard />} />
       
        <Route path="/auth/school-registration" element={<SchoolRegistration />} />
        <Route path="/" element={<EduSyncLanding />} />
      </Routes>
    </Router>
  );
}

export default App;
