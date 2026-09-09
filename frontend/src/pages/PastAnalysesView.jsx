import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import { analysisService } from '../services/api';
import { History, FileText, ArrowRight, Calendar } from 'lucide-react';

const PastAnalysesView = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await analysisService.getAnalyses();
      setAnalyses(res.data.analyses || []);
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Analysis History <History className="w-5 h-5 text-brand-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">Review all your previous Job Description analyses and match reports.</p>
          </div>

          {loading ? (
            <div className="text-xs text-slate-400">Loading analysis history...</div>
          ) : analyses.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800">
              No previous analyses recorded. Paste a Job Description to run your first analysis!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {analyses.map((item) => (
                <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 font-medium">
                      {item.jd_text || 'Job Description Analysis'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-emerald-400 font-semibold">{item.matched_skills ? item.matched_skills.length : 0} Matched</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-rose-400 font-semibold">{item.missing_skills ? item.missing_skills.length : 0} Missing</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 pl-4 border-l border-slate-800">
                    <MatchGauge score={item.overall_score} size={64} strokeWidth={6} label="" />
                    <Link
                      to={`/candidate/analysis/${item.id}`}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      Report <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PastAnalysesView;
