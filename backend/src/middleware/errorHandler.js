const errorHandler = (err, req, res, next) => {
  console.error('[Central Error Handler]', err);

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds maximum allowed limit of 10MB.' });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    error: err.message || 'An unexpected internal server error occurred.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
