import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCandidate = async () => {
    setEmail('alex.candidate@example.com');
    setPassword('password123');
    setError('');
    setLoading(true);
    try {
      const user = await login('alex.candidate@example.com', 'password123');
      navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRecruiter = async () => {
    setEmail('recruiter@technova.com');
    setPassword('password123');
    setError('');
    setLoading(true);
    try {
      const user = await login('recruiter@technova.com', 'password123');
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to your AI Career & Recruitment account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              Instant 1-Click Demo Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCandidate}
                className="py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Candidate Demo
              </button>
              <button
                type="button"
                onClick={handleDemoRecruiter}
                className="py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Recruiter Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
