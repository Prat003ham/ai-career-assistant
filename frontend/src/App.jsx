import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeManagement from './pages/ResumeManagement';
import ResumeAnalysisView from './pages/ResumeAnalysisView';
import RecommendationsView from './pages/RecommendationsView';
import LearningRoadmapView from './pages/LearningRoadmapView';
import PastAnalysesView from './pages/PastAnalysesView';

import EmployerDashboard from './pages/EmployerDashboard';
import JobManagement from './pages/JobManagement';
import JobDetailsView from './pages/JobDetailsView';
import CandidateRankingView from './pages/CandidateRankingView';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Candidate Routes */}
      <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/candidate/resumes" element={<ProtectedRoute allowedRole="candidate"><ResumeManagement /></ProtectedRoute>} />
      <Route path="/candidate/analyze" element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/candidate/analysis/:id" element={<ProtectedRoute allowedRole="candidate"><ResumeAnalysisView /></ProtectedRoute>} />
      <Route path="/candidate/recommendations" element={<ProtectedRoute allowedRole="candidate"><RecommendationsView /></ProtectedRoute>} />
      <Route path="/candidate/roadmap" element={<ProtectedRoute allowedRole="candidate"><LearningRoadmapView /></ProtectedRoute>} />
      <Route path="/candidate/history" element={<ProtectedRoute allowedRole="candidate"><PastAnalysesView /></ProtectedRoute>} />

      {/* Employer Routes */}
      <Route path="/employer/dashboard" element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} />
      <Route path="/employer/jobs" element={<ProtectedRoute allowedRole="employer"><JobManagement /></ProtectedRoute>} />
      <Route path="/employer/jobs/create" element={<ProtectedRoute allowedRole="employer"><JobManagement /></ProtectedRoute>} />
      <Route path="/employer/jobs/:id" element={<ProtectedRoute allowedRole="employer"><JobDetailsView /></ProtectedRoute>} />
      <Route path="/employer/candidates/ranking" element={<ProtectedRoute allowedRole="employer"><CandidateRankingView /></ProtectedRoute>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
