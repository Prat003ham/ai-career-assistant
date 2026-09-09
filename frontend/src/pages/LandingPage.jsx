import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Target, Zap, BookOpen, Users, CheckCircle2, Award } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-600/30 via-violet-600/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4" /> Next-Gen AI Career & Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Bridge the Gap Between <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-violet-400 to-emerald-400">
              Resumes and Dream Jobs
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl mb-10 leading-relaxed">
            Instant AI resume analysis, automated skill gap discovery, personalized learning roadmaps for job seekers — paired with smart candidate ranking and side-by-side comparison tools for recruiters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
            >
              Analyze Your Resume Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/70 transition-colors"
            >
              Recruiter Demo Access
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-800/80">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <div className="text-2xl font-black text-white">94%</div>
              <div className="text-xs text-slate-400 font-medium">Skill Extraction Accuracy</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <div className="text-2xl font-black text-brand-400">50+</div>
              <div className="text-xs text-slate-400 font-medium">Skill Synonyms Normalized</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <div className="text-2xl font-black text-violet-400">4-Week</div>
              <div className="text-xs text-slate-400 font-medium">Personalized Roadmaps</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <div className="text-2xl font-black text-emerald-400">&lt; 3s</div>
              <div className="text-xs text-slate-400 font-medium">AI Analysis Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Feature Comparison Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white">Designed for Candidates & Recruiters</h2>
          <p className="text-slate-400 mt-2">A unified intelligence platform empowering both sides of hiring.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidate Card */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">For Candidates & Students</h3>
            <p className="text-slate-400 text-sm mb-6">Analyze your resume against target JDs, uncover hidden skill gaps, and optimize ATS readability.</p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Real-time JD vs Resume match score breakdown
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Categorized matched, partially matched & missing skills
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Tailored project ideas & certification suggestions
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Dynamic week-by-week learning roadmap
              </li>
            </ul>
          </div>

          {/* Employer Card */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">For Employers & Recruiters</h3>
            <p className="text-slate-400 text-sm mb-6">Manage job openings, upload applicant resumes, run AI match scoring, and compare candidates.</p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automated candidate PDF resume parsing & scoring
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> AI Candidate Ranking dashboard with custom sorting
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Side-by-side multi-candidate comparison matrix
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-stage hiring funnel (Applied to Selected)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 AI Career Assistant System. Production Full-Stack Architecture.</div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300">Login</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
