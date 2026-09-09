import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, LogOut, Briefcase, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-500">
            CareerAI
          </span>
          <span className="text-xs block text-slate-400 font-medium">Assistant & Recruiter Copilot</span>
        </div>
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/70 border border-slate-700/60 rounded-full px-3 py-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${user.role === 'employer' ? 'bg-emerald-400' : 'bg-brand-500'}`}></span>
            <span className="font-semibold capitalize text-slate-200">{user.role} Account</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl px-3 py-1.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-500 font-bold flex items-center justify-center text-sm border border-brand-500/30">
              {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white">{user.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
