import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { dashboardService } from '../services/api';
import {
  Briefcase, Users, UserCheck, UserX, PlusCircle, ArrowRight, Sparkles, BarChart3, CheckCircle2
} from 'lucide-react';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getEmployerDashboard();
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to fetch employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" /> Loading Recruiter Console...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Recruiter Hiring Console <Briefcase className="w-5 h-5 text-emerald-400" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage job openings, analyze candidate resumes with AI, compare applicants, and shortlist talent.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/employer/jobs/create"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Create Job Opening
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="employer" />
          </div>

          {/* Stats Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Active Job Openings</div>
              <div className="text-2xl font-black text-white mt-1">
                {stats ? stats.totalJobs : 2}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Recruiting actively</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Total Applicants</div>
              <div className="text-2xl font-black text-white mt-1">
                {stats ? stats.totalCandidates : 3}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Resumes ingested</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Shortlisted Talent</div>
              <div className="text-2xl font-black text-brand-400 mt-1">
                {stats ? stats.candidatesShortlisted : 1}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">High AI match fit</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Avg Candidate Score</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {stats ? stats.averageMatchScore : 80}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Cross-pipeline average</div>
              </div>
              <MatchGauge score={stats ? stats.averageMatchScore : 80} size={56} strokeWidth={5} label="" />
            </div>
          </div>

          {/* Hiring Stage Funnel & Quick Action Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
            <h3 className="text-base font-bold text-white mb-4">Hiring Pipeline Funnel</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Screening</span>
                <div className="text-xl font-bold text-slate-200 mt-1">{stats ? stats.candidatesScreening : 1}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-brand-400 uppercase font-bold">Shortlisted</span>
                <div className="text-xl font-bold text-brand-400 mt-1">{stats ? stats.candidatesShortlisted : 1}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-violet-400 uppercase font-bold">Interview</span>
                <div className="text-xl font-bold text-violet-400 mt-1">{stats ? stats.candidatesInterview : 1}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Selected</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{stats ? stats.candidatesSelected : 0}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-rose-400 uppercase font-bold">Rejected</span>
                <div className="text-xl font-bold text-rose-400 mt-1">{stats ? stats.candidatesRejected : 0}</div>
              </div>
            </div>
          </div>

          {/* Recent Job Openings List */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Your Job Openings</h3>
              <Link to="/employer/jobs" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                View All Jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {stats && stats.recentJobs && stats.recentJobs.map((job) => (
                <div key={job.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{job.title}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {job.department} • {job.location} • {job.salary_range}
                    </div>
                  </div>
                  <Link
                    to={`/employer/jobs/${job.id}`}
                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    Applicants & AI Rank <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
