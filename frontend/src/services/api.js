import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Resume Services
export const resumeService = {
  uploadResume: (formData) => api.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
};

// Analysis Services
export const analysisService = {
  analyzeResume: (data) => api.post('/analysis', data),
  getAnalyses: () => api.get('/analysis'),
  getAnalysisById: (id) => api.get(`/analysis/${id}`),
  getRecommendations: () => api.get('/analysis/recommendations'),
  getRoadmap: () => api.get('/analysis/roadmap'),
};

// Job Services
export const jobService = {
  createJob: (jobData) => api.post('/jobs', jobData),
  getJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Candidate Services
export const candidateService = {
  addCandidateToJob: (jobId, formData) => api.post(`/jobs/${jobId}/candidates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getJobCandidates: (jobId) => api.get(`/jobs/${jobId}/candidates`),
  getCandidateById: (id) => api.get(`/candidates/${id}`),
  analyzeCandidate: (id) => api.post(`/candidates/${id}/analyze`),
  updateStatus: (appId, status) => api.put(`/applications/${appId}/status`, { status }),
  compareCandidates: (jobId, candidateIds) => api.post(`/jobs/${jobId}/compare`, { candidate_ids: candidateIds }),
};

// Dashboard Services
export const dashboardService = {
  getCandidateDashboard: () => api.get('/dashboard/candidate'),
  getEmployerDashboard: () => api.get('/dashboard/employer'),
};

export default api;
