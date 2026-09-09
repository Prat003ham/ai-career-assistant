import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { resumeService } from '../services/api';
import { FileText, UploadCloud, CheckCircle2, Eye, Calendar, Sparkles, X } from 'lucide-react';

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeService.getResumes();
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const res = await resumeService.uploadResume(formData);
      setMessage('Resume uploaded and parsed successfully by AI engine!');
      setFile(null);
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
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
              Resume Upload & Parsing <FileText className="w-5 h-5 text-brand-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload your PDF resume to automatically extract skills, experience, projects, and contact info.
            </p>
          </div>

          {/* Upload Drop Zone */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 max-w-3xl">
            <h3 className="text-base font-bold text-white mb-4">Upload New PDF Resume</h3>

            {message && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-8 text-center transition-all bg-slate-950/60 flex flex-col items-center justify-center">
                <UploadCloud className="w-12 h-12 text-brand-400 mb-3" />
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : 'Drag & drop your PDF resume here, or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supported format: PDF only (Max size: 10MB)</p>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload-input"
                />
                <label
                  htmlFor="resume-upload-input"
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl cursor-pointer border border-slate-700 transition-colors"
                >
                  Browse PDF File
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> AI Extracting & Parsing PDF...
                  </>
                ) : (
                  'Upload & Parse Resume'
                )}
              </button>
            </form>
          </div>

          {/* Uploaded Resumes List */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Your Uploaded Resumes</h3>

            {loading ? (
              <div className="text-xs text-slate-400">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800">
                No resumes uploaded yet. Upload your first PDF resume above!
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        {resume.is_primary && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-semibold">
                            Primary
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-white truncate">{resume.file_name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{(resume.file_size / 1024).toFixed(1)} KB</span>
                      <button
                        onClick={() => setSelectedResume(resume)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-brand-400 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Parsed Data
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parsed Resume Modal */}
          {selectedResume && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
                <button
                  onClick={() => setSelectedResume(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-1">Parsed Resume Information</h3>
                <p className="text-xs text-slate-400 mb-6">{selectedResume.file_name}</p>

                {selectedResume.parsed_data ? (
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Candidate Details</span>
                      <div className="text-sm font-semibold text-white">{selectedResume.parsed_data.name || 'Candidate'}</div>
                      <div className="text-slate-400 mt-0.5">{selectedResume.parsed_data.email} • {selectedResume.parsed_data.phone}</div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2">Extracted Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResume.parsed_data.skills && selectedResume.parsed_data.skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2">Education</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {selectedResume.parsed_data.education && selectedResume.parsed_data.education.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <pre className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
                    {selectedResume.parsed_text}
                  </pre>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResumeManagement;
