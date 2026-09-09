import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Search, Compass, Map, History,
  Briefcase, Users, GitCompare, BarChart3, PlusCircle, UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/candidate/analyze', label: 'Analyze JD', icon: Search },
    { to: '/candidate/resumes', label: 'My Resumes', icon: FileText },
    { to: '/candidate/recommendations', label: 'AI Skill Gap & Recs', icon: Compass },
    { to: '/candidate/roadmap', label: 'Learning Roadmap', icon: Map },
    { to: '/candidate/history', label: 'Past Analyses', icon: History },
  ];

  const employerLinks = [
    { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employer/jobs', label: 'Job Openings', icon: Briefcase },
    { to: '/employer/jobs/create', label: 'Create Job Opening', icon: PlusCircle },
    { to: '/employer/candidates/ranking', label: 'Candidate AI Ranking', icon: BarChart3 },
  ];

  const links = user.role === 'employer' ? employerLinks : candidateLinks;

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-3">
            {user.role === 'employer' ? 'Recruiter Console' : 'Candidate Suite'}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-md shadow-brand-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3.5 bg-slate-850/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AI Model Ready
        </div>
        <p className="text-[11px] text-slate-400">
          NLP Skill Engine & LLM scoring active.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
