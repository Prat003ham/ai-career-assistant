import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { analysisService } from '../services/api';
import {
  FileText, CheckCircle2, AlertCircle, XCircle, Sparkles, Award, Map, ArrowRight, ShieldAlert, Layers
} from 'lucide-react';

const ResumeAnalysisView = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const res = await analysisService.getAnalysisById(id);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analysis details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-brand-400 font-semibold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" /> Generating Report...
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Analysis Not Found</h3>
            <p className="text-xs text-slate-400 mb-6">{error || 'The requested analysis record does not exist.'}</p>
            <Link to="/candidate/dashboard" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
              Return to Dashboard
            </Link>
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                AI Analysis Report
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">Resume vs Job Description Match</h1>
              <p className="text-xs text-slate-400 mt-1">Generated on {new Date(analysis.created_at).toLocaleDateString()}</p>
            </div>
            <Link
              to="/candidate/roadmap"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
            >
              View Learning Roadmap <Map className="w-4 h-4" />
            </Link>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="candidate" />
          </div>

          {/* Top Score Summary Banner */}
          <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-slate-800 mb-8 grid md:grid-cols-4 gap-6 items-center">
            <div className="md:border-r border-slate-800 pr-6 flex flex-col items-center justify-center">
              <MatchGauge score={analysis.overall_score} size={140} strokeWidth={12} label="Overall Match Score" />
            </div>

            <div className="md:col-span-3 space-y-4">
              <h3 className="text-lg font-bold text-white">Match Score Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Skills (50%)</span>
                  <div className="text-xl font-black text-brand-400 mt-1">{analysis.skills_match_score}%</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Experience (25%)</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">{analysis.experience_match_score}%</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Education (10%)</span>
                  <div className="text-xl font-black text-violet-400 mt-1">{analysis.education_match_score}%</div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">ATS Readability (5%)</span>
                  <div className="text-xl font-black text-amber-400 mt-1">{analysis.ats_score}%</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {analysis.explanation}
              </p>
            </div>
          </div>

          {/* Categorized Skills Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Matched Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matched Skills ({analysis.matched_skills ? analysis.matched_skills.length : 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matched_skills && analysis.matched_skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Partially Matched Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Partially Matched ({analysis.partially_matched_skills ? analysis.partially_matched_skills.length : 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.partially_matched_skills && analysis.partially_matched_skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <XCircle className="w-4 h-4 text-rose-400" /> Missing Skills ({analysis.missing_skills ? analysis.missing_skills.length : 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missing_skills && analysis.missing_skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Resume Improvement Suggestions (Before vs After) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-400" /> AI Resume Bullet Point Improvements
            </h3>

            <div className="space-y-4">
              {analysis.resume_suggestions && analysis.resume_suggestions.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Current Bullet Point</span>
                    <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">{item.original}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI Suggested Improvement</span>
                    <p className="text-xs text-slate-200 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20 font-medium">{item.suggested}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Projects & Certifications */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Projects */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-violet-400" /> Recommended Projects
              </h3>
              <div className="space-y-3">
                {analysis.recommended_projects && analysis.recommended_projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                    <div className="font-semibold text-sm text-white">{proj.title}</div>
                    <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {proj.techStack && proj.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] rounded border border-violet-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-400" /> Suggested Certifications
              </h3>
              <div className="space-y-3">
                {analysis.recommended_certifications && analysis.recommended_certifications.map((cert, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-white">{cert.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cert.provider}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/20">
                      Recommended
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeAnalysisView;
