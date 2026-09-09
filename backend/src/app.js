const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded PDF files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'backend-api',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 [Backend Server] AI Career Assistant Express API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
