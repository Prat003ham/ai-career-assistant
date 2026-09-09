import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { jobService, candidateService } from '../services/api';
import {
  Briefcase, Users, PlusCircle, Sparkles, UserCheck, GitCompare, FileText, CheckCircle2, XCircle, ChevronRight, X, UploadCloud
} from 'lucide-react';

const JobDetailsView = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Add Candidate Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Candidate Comparison State
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const jRes = await jobService.getJobById(id);
      setJob(jRes.data.job);

      const cRes = await candidateService.getJobCandidates(id);
      setCandidates(cRes.data.candidates || []);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await candidateService.updateStatus(appId, newStatus);
      fetchJobDetails();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candName || !candEmail) {
      setModalError('Please enter candidate name and email.');
      return;
    }

    const formData = new FormData();
    formData.append('candidate_name', candName);
    formData.append('candidate_email', candEmail);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    setSubmitting(true);
    setModalError('');

    try {
      await candidateService.addCandidateToJob(id, formData);
      setShowAddModal(false);
      setCandName('');
      setCandEmail('');
      setResumeFile(null);
      fetchJobDetails();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Failed to add candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelectCandidate = (candId) => {
    if (selectedIds.includes(candId)) {
      setSelectedIds(selectedIds.filter(i => i !== candId));
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare up to 3 candidates simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, candId]);
    }
  };

  const handleRunComparison = async () => {
    if (selectedIds.length < 2) return;
    setComparing(true);
    try {
      const res = await candidateService.compareCandidates(id, selectedIds);
      setComparisonData(res.data.comparisons);
      setShowCompareModal(true);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setComparing(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" /> Loading Job & Candidates...
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
          {/* Job Overview Banner */}
          {job && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase rounded-md">
                  {job.department} • {job.employment_type}
                </span>
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary_range}</span>
                  <span>⏱️ Min {job.min_experience_years} yrs exp</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {selectedIds.length >= 2 && (
                  <button
                    onClick={handleRunComparison}
                    disabled={comparing}
                    className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
                  >
                    <GitCompare className="w-4 h-4" /> Compare Selected ({selectedIds.length})
                  </button>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Add Applicant Candidate
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <DisclaimerBanner role="employer" />
          </div>

          {/* Hiring Stage Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3 text-xs">
            {['all', 'applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected'].map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveTab(stage)}
                className={`px-3.5 py-2 rounded-xl font-semibold capitalize transition-all ${
                  activeTab === stage
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {stage} ({candidates.filter(c => stage === 'all' || c.status === stage).length})
              </button>
            ))}
          </div>

          {/* Candidate Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4 w-10">Select</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">AI Overall Match</th>
                  <th className="p-4">Skills Match</th>
                  <th className="p-4">Missing Skills</th>
                  <th className="p-4">Hiring Stage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                      No candidates found in this stage. Click "Add Applicant Candidate" to add one!
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand) => {
                    const isSelected = selectedIds.includes(cand.id);
                    return (
                      <tr key={cand.id} className={`hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-brand-600/10' : ''}`}>
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCandidate(cand.id)}
                            className="rounded border-slate-700 bg-slate-950 text-brand-600 focus:ring-brand-500 w-4 h-4"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{cand.candidate_name}</div>
                          <div className="text-slate-400 text-[11px]">{cand.candidate_email}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-black text-sm ${cand.overall_score >= 80 ? 'text-emerald-400' : cand.overall_score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                              {cand.overall_score}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cand.matched_skills && cand.matched_skills.slice(0, 4).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cand.missing_skills && cand.missing_skills.slice(0, 3).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={cand.status}
                            onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none capitalize font-semibold"
                          >
                            {['applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected'].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleStatusChange(cand.id, 'shortlisted')}
                            className="px-2.5 py-1 bg-brand-600/20 text-brand-400 border border-brand-500/30 hover:bg-brand-600/30 rounded-lg text-xs font-semibold"
                          >
                            Shortlist
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add Candidate Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-4">Add Candidate to Job</h3>

                {modalError && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                    {modalError}
                  </div>
                )}

                <form onSubmit={handleAddCandidate} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Candidate Name *</label>
                    <input
                      type="text"
                      required
                      value={candName}
                      onChange={(e) => setCandName(e.target.value)}
                      placeholder="e.g. Jordan Smith"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Candidate Email *</label>
                    <input
                      type="email"
                      required
                      value={candEmail}
                      onChange={(e) => setCandEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Upload Resume (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="w-full text-slate-400 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Running AI Parsing & Analysis...' : 'Add & Run AI Match'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Candidate Comparison Modal */}
          {showCompareModal && comparisonData && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-brand-400" /> Side-by-Side Candidate Comparison Matrix
                </h3>
                <p className="text-xs text-slate-400 mb-6">Compare applicants against job requirements.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisonData.map((cand, idx) => (
                    <div key={cand.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-bold text-brand-400 uppercase">Candidate {idx + 1}</span>
                        <h4 className="font-bold text-base text-white">{cand.name}</h4>
                        <div className="text-xs text-slate-400">{cand.email}</div>
                      </div>

                      <div className="flex items-center justify-center py-2">
                        <MatchGauge score={cand.overall_score} size={100} strokeWidth={8} label="Overall Match" />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400">Skills Score:</span>
                          <span className="font-bold text-brand-400">{cand.skills_match_score}%</span>
                        </div>
                        <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400">Experience Score:</span>
                          <span className="font-bold text-emerald-400">{cand.experience_match_score}%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Matched Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {cand.matched_skills && cand.matched_skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Missing Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {cand.missing_skills && cand.missing_skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] rounded border border-rose-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobDetailsView;
