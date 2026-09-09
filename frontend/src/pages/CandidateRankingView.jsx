import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { jobService, candidateService } from '../services/api';
import { BarChart3, Search, ArrowUpDown, Filter, Sparkles, UserCheck } from 'lucide-react';

const CandidateRankingView = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('overall_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const jobsRes = await jobService.getJobs();
      const jobs = jobsRes.data.jobs || [];

      let allCandidates = [];
      for (const job of jobs) {
        const cRes = await candidateService.getJobCandidates(job.id);
        const jobCands = (cRes.data.candidates || []).map(c => ({
          ...c,
          job_title: job.title
        }));
        allCandidates = [...allCandidates, ...jobCands];
      }

      setCandidates(allCandidates);
    } catch (err) {
      console.error('Failed to fetch candidate ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    let valA = a[sortBy] || 0;
    let valB = b[sortBy] || 0;
    if (sortBy === 'candidate_name') {
      valA = a.candidate_name.toLowerCase();
      valB = b.candidate_name.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCandidates = sortedCandidates.filter(c =>
    c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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
              Candidate AI Ranking Dashboard <BarChart3 className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cross-job applicant ranking based on AI match score, skills alignment, and hiring stage.
            </p>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="employer" />
          </div>

          {/* Search & Sort Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates or job titles..."
                className="bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-500 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Sort by:</span>
              <button
                onClick={() => toggleSort('overall_score')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  sortBy === 'overall_score' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Overall Match {sortBy === 'overall_score' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('skills_match_score')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  sortBy === 'skills_match_score' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Skills Match {sortBy === 'skills_match_score' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Applied Position</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('overall_score')}>
                    <div className="flex items-center gap-1">AI Match Score <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Matched Skills</th>
                  <th className="p-4">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading candidate rankings...</td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 italic">No candidate records available.</td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand, idx) => (
                    <tr key={cand.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-black text-slate-400">#{idx + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{cand.candidate_name}</div>
                        <div className="text-slate-400 text-[11px]">{cand.candidate_email}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-200">{cand.job_title}</td>
                      <td className="p-4">
                        <span className={`font-black text-sm ${
                          cand.overall_score >= 80 ? 'text-emerald-400' : cand.overall_score >= 65 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {cand.overall_score}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cand.matched_skills && cand.matched_skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold text-[10px] rounded-md uppercase border border-slate-700">
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateRankingView;
