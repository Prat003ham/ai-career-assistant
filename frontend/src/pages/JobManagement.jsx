import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { jobService } from '../services/api';
import { Briefcase, PlusCircle, Search, MapPin, DollarSign, ArrowRight, X } from 'lucide-react';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [minExp, setMinExp] = useState('2');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!title || !location || !jobDescription) {
      setError('Please provide title, location, and job description.');
      return;
    }
    setError('');
    setCreating(true);

    try {
      const res = await jobService.createJob({
        title,
        department,
        location,
        employment_type: employmentType,
        salary_range: salaryRange || 'Competitive',
        job_description: jobDescription,
        required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_skills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        min_experience_years: parseFloat(minExp) || 2
      });

      setShowCreateModal(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job opening.');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setSalaryRange('');
    setJobDescription('');
    setRequiredSkills('');
    setPreferredSkills('');
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Job Openings Management <Briefcase className="w-5 h-5 text-emerald-400" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">Create and manage your organization's job requisitions.</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create New Job Opening
            </button>
          </div>

          {/* Search Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-6 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title or location..."
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="text-xs text-slate-400">Loading job postings...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800">
              No active job openings found. Click "Create New Job Opening" to post your first position!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold rounded-md uppercase">
                          {job.employment_type || 'Full-time'}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1">{job.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] rounded font-semibold uppercase ${
                        job.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-500" /> {job.salary_range}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{job.job_description}</p>

                    <div className="flex flex-wrap gap-1">
                      {job.required_skills && job.required_skills.slice(0, 5).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-[10px] rounded border border-slate-800">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Min Exp: {job.min_experience_years} yrs</span>
                    <Link
                      to={`/employer/jobs/${job.id}`}
                      className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      Candidates & Pipeline <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Job Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-4">Create New Job Opening</h3>

                {error && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Job Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Engineering"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="San Francisco, CA / Remote"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Salary Range</label>
                      <input
                        type="text"
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                        placeholder="$120k - $150k"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Min Exp (Years)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={minExp}
                        onChange={(e) => setMinExp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Job Description *</label>
                    <textarea
                      rows={5}
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste detailed job requirements and responsibilities..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={requiredSkills}
                      onChange={(e) => setRequiredSkills(e.target.value)}
                      placeholder="React, Node.js, Express, PostgreSQL, Docker"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {creating ? 'Creating Job Opening...' : 'Publish Job Opening'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobManagement;
