import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { dashboardService, analysisService } from '../services/api';
import {
  FileText, Search, Compass, Map, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, UploadCloud, BookOpen
} from 'lucide-react';

const CandidateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [jdInput, setJdInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getCandidateDashboard();
      setStats(res.data.stats);
      setLatestAnalysis(res.data.latestAnalysis);
    } catch (err) {
      console.error('Failed to fetch candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalyze = async (e) => {
    e.preventDefault();
    if (!jdInput || jdInput.trim().length < 20) {
      setError('Please paste a valid Job Description (at least 20 characters).');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const res = await analysisService.analyzeResume({ jd_text: jdInput });
      navigate(`/candidate/analysis/${res.data.analysis.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run analysis. Make sure you have uploaded a resume first.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-brand-400 font-semibold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" /> Loading Candidate Dashboard...
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
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Candidate Career Hub <Sparkles className="w-5 h-5 text-brand-400" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Analyze your resume against Job Descriptions, discover skill gaps, and track your learning roadmap.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/candidate/resumes"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-brand-400" /> Manage Resumes
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="candidate" />
          </div>

          {/* Stats Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Latest Match Score</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {stats ? stats.latestMatchScore : 84.5}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Based on latest JD analysis</div>
              </div>
              <MatchGauge score={stats ? stats.latestMatchScore : 84.5} size={64} strokeWidth={6} label="" />
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Resumes Uploaded</div>
              <div className="text-2xl font-black text-white mt-1">
                {stats ? stats.totalResumes : 1}
              </div>
              <div className="text-[11px] text-brand-400 mt-0.5">Primary resume active</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Estimated ATS Score</div>
              <div className="text-2xl font-black text-violet-400 mt-1">
                {stats ? stats.atsScore : 88.0}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Keyword & format alignment</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Active Roadmap Weeks</div>
              <div className="text-2xl font-black text-brand-400 mt-1">
                {stats ? stats.learningRoadmapCount : 4} Weeks
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Actionable skill growth</div>
            </div>
          </div>

          {/* Main Action Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Quick JD Analyzer Box */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand-400 font-bold text-sm uppercase tracking-wider mb-2">
                  <Search className="w-4 h-4" /> Instant Job Description Analyzer
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Paste Target Job Description (JD)</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Paste any job posting text below. Our AI engine will extract requirements, match canonical skills, calculate sub-scores, and generate your custom roadmap.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleQuickAnalyze}>
                  <textarea
                    rows={6}
                    required
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    placeholder="e.g. We are seeking a Full Stack Software Engineer proficient in React, Node.js, Express, PostgreSQL, and AWS..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Supports text up to 10,000 characters</span>
                    <button
                      type="submit"
                      disabled={analyzing}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {analyzing ? 'Analyzing with AI...' : 'Run AI Analysis'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Top Missing Skills & Recommendations Sidebar Box */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Top Skill Gaps Identified
                </h3>
                <div className="space-y-2">
                  {stats && stats.topMissingSkills && stats.topMissingSkills.length > 0 ? (
                    stats.topMissingSkills.map((skill, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{skill}</span>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md font-mono text-[10px]">
                          High Priority
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic">No missing skills detected yet.</div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  to="/candidate/recommendations"
                  className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-4 h-4 text-brand-400" /> View Personalized Skill Recs
                </Link>
              </div>
            </div>
          </div>

          {/* Latest Analysis Summary Card if Available */}
          {latestAnalysis && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" /> Latest Resume-JD Analysis Report
                </h3>
                <Link
                  to={`/candidate/analysis/${latestAnalysis.id}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  View Full Detailed Analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/60">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Matched Skills ({latestAnalysis.matched_skills ? latestAnalysis.matched_skills.length : 0})</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {latestAnalysis.matched_skills && latestAnalysis.matched_skills.slice(0, 5).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Missing Skills ({latestAnalysis.missing_skills ? latestAnalysis.missing_skills.length : 0})</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {latestAnalysis.missing_skills && latestAnalysis.missing_skills.slice(0, 5).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Action Plan</div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {latestAnalysis.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
